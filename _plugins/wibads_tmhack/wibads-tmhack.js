/*
 * Плагин WibAds Timeout Hack
 * Версия: 1.0.13 (18.08.2015 23:44 +0400)
 * Developer: Bogdan Nazar <nazar.bogdan@gmail.com>
 * Copyright (c) 2005-2015 Metro
 *
 * Requirements: Metro Thirdparty Core ver.2
 */
(function(worker){
	var wads = worker;//our instance constructor
	var tm = 100;
	var tamp = 1.5;
	var paused = true;
	var start = function() {
		if (typeof WibAds != "function") {
			//wait for original WibAds constructor
			tm = tm * tamp;
			window.setTimeout(start, parseInt(tm, 10));
			return;
		}
		if ((typeof wib_ads_thirdparty == "undefined") || (typeof wib_ads_thirdparty.instance == "undefined")) {
			if (typeof wib_ads_thirdparty == "undefined") {
				wib_ads_thirdparty = {};
				wib_ads_thirdparty.got = false;
				wib_ads_thirdparty.ads = [];
			}
			try {
				//clearing gallery callback of previous instance
				var cbs = wib_gallery_paging_slideshow_event.callbacks;
				if (cbs.length) {
					for (var c = 0; c < cbs.length; c++) {
						if (cbs[c] == wib_ads.reload) {
							wib_gallery_paging_slideshow_event.callbacks.splice(c, 1);
							break;
						}
					}
				}
				if (paused) return;
				//initiating new modified instance
				wib_ads_thirdparty.got = true;//for backward compatibility with ver 1.0.4
				wib_ads_thirdparty.instance = new wads();
				wib_ads = wib_ads_thirdparty.instance;
				wib_ads.thirdparty = true;//indicate replaced instance
				wib_ads.init();
				var reload = function(ad_pos, extra) {
					wib_ads.reload(ad_pos, extra);
				};
				wib_gallery_paging_slideshow_event.registerCb(reload);
			} catch (e) {
				console.log("Can't implement wib_ads slideshow event [wib_ads.reload], interpreter says: [" + e.name + "/" + e.message + "]");
			}
		}
	};
	start();
})(function(){
	var _reloadTm = 30000;
	var _lastReloaded = {};
	var reloadable_ads = [];
	var gallery_overlay_ad;
	var gallery_overlay_ad_html =
	"<div class='ad' id='ad22'>" +
	"  <div class='ad-msg'>" +
	"    <span class='ad-msg'>" + msg_advertisement + "</span>" +
	"  </div>" +
	"  <div id='ad22_rectangle' class='ad-rectangle'>" +
	"    <div id='ad22_expander'>" +
	"    </div>" +
	"  </div>" +
	"</div>";
	var append_fif = function(ad) {
		var iframe = document.createElement("iframe");
		iframe.style.margin = "0px";
		iframe.style.padding = "0px";
		iframe.style.borderWidth = "0px";
		iframe.style.visibility = "hidden";
		iframe.scrolling = "no";
		iframe.frameBorder = "0";
		iframe.allowTransparency = "true";
		iframe.ad_src = ad.src;
		iframe.ad_width = ad.width;
		iframe.ad_height = ad.height;
		iframe.src = "/templates/v3/html/wib-ads-fif.html?__toolbar=0&provider=" + ad.provider;
		var ad_expander = $("#ad" + ad.pos + "_expander");
		ad_expander.html("");
		ad_expander.append(iframe);
	};

	var reloadCheck = function(ad) {
		//exclusion for SPT
		var geoSPT = false, region = "";
		if (ad.geo_spt) {
			if (typeof ad.region == "undefined") {
				if (typeof thirdparty_core != "undefined") {
					try {
						var g = thirdparty_core.pluginGet("iptogeo");
						var geo = g.getData(false);
						if ((typeof geo == "object") && geo && (typeof geo.region != "undefined")) ad.region = geo.region;
					} catch(e){}
				}
			} else region = ad.region;
			if ((region == "Санкт-Петербург") || (region.indexOf("Ленинград") != -1)) geoSPT = true;
		}
		if (geoSPT) return true;
		//
		try {
			var t = new Date().getTime();
			if (typeof _lastReloaded[ad.pos] != "object") {
				_lastReloaded[ad.pos] = {tm: 0, ival: ((typeof ad.ival == "number") ? ad.ival : _reloadTm)};
			}
			if ((t - _lastReloaded[ad.pos].tm) > _lastReloaded[ad.pos].ival) {
				_lastReloaded[ad.pos].tm = t;
				return true;
			}
		} catch(e) {
			console.log("Can't check wib_ads timeout for " + ad.pos + ": [" + e.name + "/" + e.message + "]");
		}
		return false;
	};

	// API
	// Constructor function
	this.init = function() {
		for (c in wib_ads_thirdparty.ads) {
			if (!wib_ads_thirdparty.ads.hasOwnProperty(c)) continue;
			reloadable_ads.push(wib_ads_thirdparty.ads[c]);
		}
	}
	// Reload a specific or all reloadable ads
	this.reload = function(ad_pos, extra) {
		if (ad_pos == 22) {
			// Show the ad only on configured image positions
			if (!gallery_overlay_ad || !gallery_overlay_ad_config[extra.to % 10]) return;
			// Ad pos 22 is special: the HTML ad container doesn't exist in the page
			// normally, so before we create the fif we need to create and append the
			// HTML container. We also hide the lightbox stuff
			$("#imageContainer").css({visibility: "hidden" });
			$("#imageData").css({visibility: "hidden" });
			$("#imageContainer").before("<div id='wibAdOverlay' class='wibAdOverlay'>" + gallery_overlay_ad_html +  "</div>");
			// Append the fif to the ad container
			append_fif(gallery_overlay_ad);
		} else {
			var reload;
			for (var i = 0; i < reloadable_ads.length; i++) {
				if (!reloadable_ads.hasOwnProperty(i)) continue;
				reload = false;
				if ((typeof reloadable_ads[i].tm_hack == "boolean") && reloadable_ads[i].tm_hack) reload = reloadCheck(reloadable_ads[i]);
				if (reload) append_fif(reloadable_ads[i]);
			}
		}
	};

	// Initiate the reloadable ads
	this.set_reloadable_ad = function(provider, pos, src, width, height) {
		if ((typeof provider == "object") && provider) reloadable_ads.push(provider);
		else reloadable_ads.push({
			"provider": provider,
			"pos": pos,
			"src": src,
			"width": width,
			"height": height
		});
	}
	// Changin reload timeout
	this.set_reload_timeout = function(adname, timeout) {
		if (typeof _lastReloaded[adname] == "undefined") return false;
		_lastReloaded[adname].ival = timeout;
		return true;
	}
	// Initiate the gallery overlay ad
	this.set_gallery_overlay_ad = function(provider, pos, src, width, height) {
		gallery_overlay_ad = {
			"provider": provider,
			"pos": pos,
			"src": src,
			"width": width,
			"height": height
		};
	}
	// Closes the gallery overlay ad. Called by ad providers from inside a fif
	this.close_gallery_overlay = function() {
		var wib_ad_overlay = $("#wibAdOverlay");
		if (!wib_ad_overlay) return;
		wib_ad_overlay.remove();
		$("#imageContainer").css({visibility: "visible" });
		$("#imageData").css({visibility: "visible" });
	}
});
/*/код для adfox-->
//replace pos, width and height with actual values
//wib_ads.set_reloadable_ad("adfox","adcomp-18",ad_src,"240","400"); //old fashion call
var wa_prov = "adfox";
var wa_pos = "ad30";
var wa_wid = "200";
var wa_ht = "300";
var wa_geo_spt = true;
var wa_interval = 30000;
var wa_ad = {
	provider: wa_prov,
	pos: wa_pos,
	src: ad_src,
	width: wa_wid,
	height: wa_ht,
	tm_hack: true,
	geo_spt: wa_geo_spt,
	ival: wa_interval
};
if ((typeof wib_ads != "undefined") && (typeof wib_ads.thirdparty == "boolean")) wib_ads.set_reloadable_ad(wa_ad);
else {
	if (typeof wib_ads_thirdparty == "undefined") {
		var wib_ads_thirdparty = {};
		wib_ads_thirdparty.got = false;
		wib_ads_thirdparty.ads = [];
	}
	wib_ads_thirdparty.ads.push(wa_add);
}
//<--/*/