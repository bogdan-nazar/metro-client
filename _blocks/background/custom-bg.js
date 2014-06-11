/*
 * Плагин Metro Background Changer
 * Версия: 1.0.0 (22.10.2013 11:58 +0400)
 * Developer: Bogdan Nazar (me@bogdan-nazar.ru)
 * Type: Anonymous Object
 * Copyright (c) 2005-2013 Metro
 *
 * Требования:  -
 */
(function() {
	var config = {
		bg:			"bg.jpg",
		bgAttach:	"fixed",//false
		bgColor:	false,//#000
		bgPos:		"center center",//false
		bgRepeat:	"no-repeat",//false
		bgSize:		false,//cover
		nameDir:	"background",
		nameImages:	"images",
		nameRes:	"custom-bg",
		nameSection:"_blocks",
		version:	"1.0.1",
	};
	var head = document.getElementsByTagName("head")[0];
	if (!head.childNodes.length) return;
	var nodes = head.childNodes;
	var n = null;
	var found = false;
	for (var c in nodes) {
		n = nodes[c];
		if (!n || (typeof n.tagName == "undefined")) continue;
		if (n.tagName.toUpperCase() != "SCRIPT") continue;
		if (n.src.indexOf("/" + config.nameDir + "/" + config.nameRes + ".js") == -1) continue;
		found = n.src;
		break;
	}
	if (found === false) return;
	var qp = function(q) {
		var pars = {},
			seg = q.replace(/^\?/, "").split("&"),
			len = seg.length, i = 0, s;
		for (;i<len;i++) {
			if (!seg[i]) continue;
			s = seg[i].split("=");
			if (typeof s[1] == "undefined") pars.bg = s[0];
			else pars[s[0]] = s[1];
		}
		return pars;
	};
	var val = "";
	var p = found.split("?");
	if (p.length > 1) {
		var pars = qp(p[1]);
		for (var c in config) {
			if (!config.hasOwnProperty(c)) continue;
			if (typeof pars[c] == "undefined") continue;
			if (pars[c] === "") continue;
			if ((pars[c] === "false") || ((pars[c] === "0"))) val = false;
			else val = pars[c];
			config[c] = decodeURIComponent(val);
		}
	}
	var bgSet = false;
	var css = document.createElement("LINK");
	css.type = "text/css";
	css.rel = "stylesheet";
	css.href = "/thirdparty-v2/" + config.nameSection + "/" + config.nameDir + "/" + config.nameRes + ".css?ver=" + config.version;
	css.media = "screen";
	var f = function(nc) {
		if (bgSet) return;
		if ((typeof css.readyState == "undefined") || (css.readyState === "loaded") || (css.readyState === "complete") || (typeof nc == "boolean")) {
			bgSet = true;
			if (config.bgColor) document.body.style.backgroundColor = config.bgColor;
			if (config.bgPos) document.body.style.backgroundPosition = config.bgPos;
			if (config.bgRepeat) document.body.style.backgroundRepeat = config.bgRepeat;
			if (config.bgSize) document.body.style.backgroundSize = config.bgSize;
			if (config.bgAttach) document.body.style.backgroundAttachment = config.bgAttach;
			document.body.style.backgroundImage = "url('/thirdparty-v2/" + config.nameSection + "/" + config.nameDir + "/" + config.nameImages + "/" + config.bg + "')";
		}
	};
	var ival;
	var tm = function() {
		if (bgSet) {
			window.clearInterval(ival);
			return;
		}
		for (var c in nodes) {
			n = nodes[c];
			if (!n || (typeof n.tagName == "undefined")) continue;
			if (n.tagName.toUpperCase() != "LINK") continue;
			if (n.href.indexOf("/" + config.nameDir + "/" + config.nameRes + ".css") == -1) continue;
			window.clearInterval(ival);
			f(true);
			return;
		}
	};
	if (typeof css.onreadystatechange != "undefined") css.onreadystatechange = f;
	else css.onload = f;
	head.appendChild(css);
	ival = window.setInterval(tm, 100);
})();