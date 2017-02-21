/*
 * Плагин WibAds Timeout Hack
 * Версия: 1.1.21 09.10.2015 17:32 +0400)
 * Developer: Bogdan Nazar <nazar.bogdan@gmail.com>
 * Copyright (c) 2005-2015 Metro
 *
 * Requirements: Metro Thirdparty Core ver.2
 */
(function(worker){
	var wads = worker;//our instance constructor
	var tm = 100;
	var tamp = 1.5;
	var stopped = false;
	var start = function() {
		if (typeof WibAds != "function") {
			//wait for original WibAds constructor
			tm = tm * tamp;
			window.setTimeout(start, parseInt(tm, 10));
			return;
		}
		//clearing gallery callback of previous instance
		var cbs = window.wib_gallery_paging_slideshow_event.callbacks;
		if (cbs.length) {
			for (var c = 0; c < cbs.length; c++) {
				if (cbs[c] == window.wib_ads.reload) {
					cbs.splice(c, 1);
					break;
				}
			}
		}
		if (stopped) {
			console.log("WibAds reloading stopped.");
			return;//banners' reload stopped
		}
		if ((typeof window.wib_ads_thirdparty == "undefined") || (typeof window.wib_ads_thirdparty.instance == "undefined")) {
			if (typeof window.wib_ads_thirdparty == "undefined") {
				window.wib_ads_thirdparty = {};
				window.wib_ads_thirdparty.got = false;
				window.wib_ads_thirdparty.ads = [];
			}
			try {
				//initiating new modified instance
				window.wib_ads_thirdparty.got = true;//for backward compatibility with ver 1.0.4
				window.wib_ads_thirdparty.instance = new wads();
				window.wib_ads = window.wib_ads_thirdparty.instance;
				window.wib_ads.thirdparty = true;//indicate replaced instance
				window.wib_ads.init();
				var reload = function(ad_pos, extra) {
					window.wib_ads.reload(ad_pos, extra);
				};
				//moving all callbacks to new instance
				if (cbs.length) {
					var l = cbs.length;
					for (var c = 0; c < l; c++) window.wib_gallery_paging_slideshow_event.registerCb(cbs[c]);
					for (var c = l - 1; c > -1; c--) cbs.splice(c, 1);
				}
				window.wib_gallery_paging_slideshow_event.registerCb(reload);
			} catch (e) {
				console.log("Can't implement wib_ads slideshow event [wib_ads.reload], interpreter says: [" + e.name + "/" + e.message + "]");
			}
		}
	};
	start();
})(function(){
	var _adsChecked = false;
	var _inited = false;
	var _region = true;
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
		if (typeof ad.expander == "undefined") {
			ad.expander = $("#ad" + ad.pos + "_expander")[0];
			if (typeof ad.expander.style == "undefined") {
				ad.expander = false;
				console.log("Adv container not found [#ad" + ad.pos + "_expander]");
				return;
			}
		}
		if (ad.expander === false) return;
		//контейнер
		var wrap = document.createElement("DIV");
		wrap.style.borderBottom = "1px dashed #b2b2b2";
		wrap.style.backgroundColor = "#fff";
		wrap.style.paddingBottom = "10px";
		wrap.style.marginBottom = "20px";
		var inr = document.createElement("DIV");
		inr.style.margin = "0 auto";
		inr.style.width = ad.width + "px";
		inr.style.height = ad.height + "px";
		inr.style.backgroundColor = "#9c6";
		wrap.appendChild(inr);
		//контент
		var iframe = document.createElement("IFRAME");
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
		inr.appendChild(iframe);
		ad.expander.innerHTML = "";
		ad.expander.appendChild(wrap);
	};
	var checkRegion = function(list, rule, onerr) {
		if (typeof onerr != "boolean") onerr = true;
		if (_region === false) return onerr;
		if ((typeof list == "undefined") || !(list instanceof Array)) list = [];
		var inarr = false;
		if (list.length) {
			var l = list.length;
			for (var c = 0; c < l; c++) {
				if ((list[c] === _region) || (_region.indexOf(list[c]) != -1)) {
					inarr = true;
					break;
				}
 			}
		}
		switch (rule) {
			case "skip":
				if (inarr) return false;
				else return true;
			default://"proc"
				if (inarr) return true;
				else return false;
		}
	};
	var checkReload = function(ad) {
		if (typeof ad.reload_do != "boolean") {
			//caching check result
			ad.reload_do = checkRegion(ad.reload_regions, ad.reload_geo_rule);
		}
		return ad.reload_do;
	};
	var checkTm = function(ad) {
		if ((typeof ad.tm_hack != "boolean") || !ad.tm_hack) return true;//timeout hack disabled
		else {
			if (typeof ad.tm_hack_do != "boolean") {
				//caching check result
				ad.tm_hack_do = checkRegion(ad.tm_hack_regions, ad.tm_hack_geo_rule, false);
			}
		}
		if (!ad.tm_hack_do) return true;
		try {
			var t = new Date().getTime();
			if (typeof _lastReloaded[ad.pos] != "object") {
				_lastReloaded[ad.pos] = {
					ival: ((typeof ad.ival == "number") ? ad.ival : _reloadTm),
					tm: 0
				};
			}
			if ((t - _lastReloaded[ad.pos].tm) > _lastReloaded[ad.pos].ival) {
				_lastReloaded[ad.pos].tm = t;
				return true;
			}
		} catch(e) {
			console.log("Can't check wib_ads timeout for " + ad.pos + ": [" + e.name + "/" + e.message + "]");
			return true;
		}
		return false;
	};

	// API
	// Constructor function
	var init = function(geo) {
		if (!_adsChecked) {
			var ads = window.wib_ads_thirdparty.ads;//shortcut
			for (c in ads) {
				if (!ads.hasOwnProperty(c)) continue;
				reloadable_ads.push(ads[c]);
			}
			_adsChecked = true;
		}
		//getting GeoLocation
		if (_region === true) {
			if (typeof geo == "undefined") {
				var wait = false;
				if (typeof thirdparty_core != "undefined") {
					try {
						var g = thirdparty_core.pluginGet("iptogeo");
						if (g) {
							g.getData(init);
							return;
						} else wait = true;
					} catch(e){
						_region = false;
					}
				} wait = true;
				if (wait) {
					window.setTimeout(init, 500);
					return;
				}
			} else {
				if ((typeof geo == "object") && geo && (typeof geo.region != "undefined")) _region = geo.region;
				else _region = false;
			}
		}
		_inited = true;
	};
	this.init = init;

	// Reload a specific or all reloadable ads
	this.reload = function(ad_pos, extra) {
		if (!_inited) {
			console.log("Can't reload until initialization is completed.");
			return;
		}
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
			var ad;
			for (var i = 0; i < reloadable_ads.length; i++) {
				if (!reloadable_ads.hasOwnProperty(i)) continue;
				ad = reloadable_ads[i];
				if (!checkReload(ad)) continue;
				if (!checkTm(ad)) continue;
				append_fif(ad);
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