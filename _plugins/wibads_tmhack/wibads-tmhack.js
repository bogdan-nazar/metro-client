/*
 * Плагин WibAds Timeout Hack
 * Версия: 1.0.2 (27.08.2013 12:43 +0400)
 * Developer: Bogdan Nazar <nazar.bogdan@gmail.com>
 * Copyright (c) 2005-2013 Metro
 *
 * Требования:  Metro Core Thirdparty
 */

 // Unregistering listener
(function(){
	try {
		var l = wib_gallery_paging_slideshow_event.callbacks.length;
		if (l) {
			for (var p in wib_gallery_paging_slideshow_event.callbacks) {
				if (wib_gallery_paging_slideshow_event.callbacks[p] == wib_ads.reload) {
					wib_gallery_paging_slideshow_event.callbacks.splice(p, 1);
					break;
				}
			}
		}
	} catch (e) {
		console.log("Can't unregister callback wib_ads.reload: " + e.message + " [" + e.name + "/" + e.type + "]");
	}
})();

function WibAds() {
	var _lastReloaded = {
		adcomp18: {
			tm: 0,
			ival: 30000
		}
	};
	var reloadable_ads;
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
	}


	// API
	// Constructor function
	this.init = function() {
		reloadable_ads = new Array();
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
			for (var i = 0; i < reloadable_ads.length; i++) {
				if (reloadable_ads[i].pos == "adcomp-18") {
					var geoSPT = false;
					if (typeof thirdparty_core != "undefined") {
						try {
							var g = thirdparty_core.pluginGet("iptogeo");
							var geo = g.getData(false);
							if ((typeof geo == "object") && (geo) && (typeof geo.region != "undefined")) {
								if ((geo.region == "Санкт-Петербург") || (geo.region == "Ленинградская область")) geoSPT = true;
							}
						} catch(e){}
					}
					if (geoSPT) {
						append_fif(reloadable_ads[i]);
					} else {
						try {
							var t = new Date().getTime();
							if ((t - _lastReloaded.adcomp18.tm) > _lastReloaded.adcomp18.ival) {
								_lastReloaded.adcomp18.tm = t;
								append_fif(reloadable_ads[i]);
							} else return;
						} catch(e) {
							append_fif(reloadable_ads[i]);
							console.log("Can't check wib_ads timeout for adcomp-18: " + e.message + " [" + e.name + "/" + e.type + "]");
						}
					}
				} else append_fif(reloadable_ads[i]);
			}
		}
	}

	// Initiate the reloadable ads
	this.set_reloadable_ad = function(provider, pos, src, width, height) {
		var reloadable_ad = {
			"provider": provider,
			"pos": pos,
			"src": src,
			"width": width,
			"height": height
		};
		reloadable_ads.push(reloadable_ad);
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
}

// Callback from Lightbox upon image switch
function wibAdsShowGalleryOverlay(from, to) {
	wib_ads.close_gallery_overlay();
	wib_ads.reload("22", {"from": from ? from: 0, "to": to});
}

wib_ads = new WibAds();
wib_ads.init();

// Register listener
wib_gallery_paging_slideshow_event.registerCb(wib_ads.reload);
wib_ads.set_reloadable_ad("adfox","adcomp-18",ad_src,"240","400");