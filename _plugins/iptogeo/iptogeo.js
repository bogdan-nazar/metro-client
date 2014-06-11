/*
 * Плагин IPToGeo
 * Версия: 1.0.11 (04.04.2014 16:29 +0400)
 * Developer: Bogdan Nazar <nazar.bogdan@gmail.com>
 * Copyright (c) 2005-2013 Metro
 *
 * Требования:  Metro Core Thirdparty
 */

if (typeof thirdparty_shared == "undefined") {
	thirdparty_shared = {};
	(function(ts){
		ts.core = {};
		ts.core._loaded = false;
		ts.core._obj = null;
		ts.waiting = [];
		ts.waitingProtos = [];
		ts.waitingInstances = [];
		try {
			var n;
			for (var c in document.getElementsByTagName("head")[0].childNodes) {
				n = document.getElementsByTagName("head")[0].childNodes[c];
				if (n.tagName && (n.tagName.toUpperCase() == "SCRIPT") && n.src) {
					if (n.src.indexOf("thirdparty-v2/_core/core.js") != -1) return;
				}
			}
		}catch(e){}
		var script = document.createElement("SCRIPT");
		script.type = "text/javascript";
		script.src = "/thirdparty-v2/_core/core.js?ver=1.0.38";
		document.getElementsByTagName("head")[0].appendChild(script);
	})(thirdparty_shared);
}

(function(){
var __name_script	=	"iptogeo.js";
var __name_this		=	"iptogeo";

//защита от двойной инициализации
if (thirdparty_shared.core._loaded) {
	if (thirdparty_shared.core._obj.pluginGet(__name_this)) return;
} else {
	for (var c in thirdparty_shared.waiting) {
		if (!thirdparty_shared.waiting.hasOwnProperty(c)) continue;
		if (thirdparty_shared.waiting[c].obj && thirdparty_shared.waiting[c].obj._name && (thirdparty_shared.waiting[c].obj._name == __name_this)) return;
	}
}

var _p = function() {
	this._clientCBs		=	[];
	this._cookieNames	=	{
		city:				"thirdpartyGeoCity2",
		region:				"thirdpartyGeoRegion2",
		remhost:			"thirdpartyGeoRemoteHost2"
	},
	this._data			=	{
		city:			"",
		region:			"",
		remote_host:	""
	};
	this._got			=	false;
	this._inited		=	false;
	this._moscow		=	["46.228.3.18", "46.228.3.19", "93.89.186.213"];
	this._name			=	__name_this;
	this._urlDataGet	=	"http://apps.metronews.ru/iptogeo/iptogeo.php";
	this.cbOnData		=	"thirdparty_core.pluginGet(\"" + this._name + "\").onActionDataGet";
	this.elWorker		=	null;
	this.plCore			=	null;
};
_p.prototype._init = function(last) {
	if (this._inited) return true;
	this._inited = true;
	this.actionDataGet();
	return this._inited;
};
_p.prototype.actionDataGet = function() {
	var city = this.plCore.cookieGet(this._cookieNames.city);
	var region = this.plCore.cookieGet(this._cookieNames.region);
	var remoteHost = this.plCore.cookieGet(this._cookieNames.remhost);
	if ((city.indexOf("Unknown city") != -1) || (!remoteHost)) {
		this.elWorker = document.createElement("SCRIPT");
		this.elWorker.type = "text/javascript";
		this.elWorker.src = this._urlDataGet + "?callback=" + this.cbOnData;
		document.getElementsByTagName("head")[0].appendChild(this.elWorker);
		return;
	}
	this._data.city = city;
	this._data.region = region;
	this._data.remote_host = remoteHost;
	this._got = true;
	this.plCore.console(__name_script + " > " + this._name + ".actionDataGet(): Current GEO got [city: " + this._data.city + ", region: " + this._data.region + ", remote host: " + this._data.remote_host + "].");
};
_p.prototype.getData = function(cb) {
	if (this._got) {
		var self = this;
		var d = {};
		d.city = this._data.city;
		d.region = this._data.region;
		d.remote_host = this._data.remote_host;
		if (typeof cb == "boolean") return d;
		var func = cb;
		window.setTimeout(function(){
			try {
				func(d);
			} catch(e) {
				self.plCore.console(__name_script + " > " + "getData: Callback execution error. " + e.message + " [" + e.name + "/" + e.type + "]");
			}
		}, 0);
	} else {
		if (typeof cb == "boolean") return false;
		this._clientCBs.push = cb;
	}
};
_p.prototype.inArray = function(needle, haystack, strict) {
	// Checks if a value exists in an array
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	var found = false, key, strict = !!strict;
	for (key in haystack) {
		if (!haystack.hasOwnProperty(key)) continue;
		if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
			found = true;
			break;
		}
	}
	return found;
}
_p.prototype.onActionDataGet = function(data) {
	if (this._got) return;
	this._got = true;
	this._data.city = data.city;
	this._data.region = data.region;
	this._data.remote_host = data.remote_host;
	if (this.inArray(this._data.remote_host, this._moscow, true)) {
		this._data.city = "Москва";
		this._data.region = "Москва";
	}
	var d = new Date();
	d.setDate(d.getDate() + 2);
	d = d.toUTCString();
	this.plCore.cookieSet(this._cookieNames.city, this._data.city, d, "/");
	this.plCore.cookieSet(this._cookieNames.region, this._data.region, d, "/");
	this.plCore.cookieSet(this._cookieNames.remhost, this._data.remote_host, d, "/");
	this.plCore.console(__name_script + " > " + this._name + ".onActionDataGet(): Current GEO got [city: " + this._data.city + ", region: " + this._data.region + ", remote host: " + this._data.remote_host + "].");
	for (var c in this._clientCBs) {
		if (!this._clientCBs.hasOwnProperty(c)) continue;
		try {
			this._clientCBs[c](data);
		} catch(e) {
			this.plCore.console(__name_script + " > " + "onActionDataGet: Callback execution error. " + e.message + " [" + e.name + "/" + e.type + "]");
		}
		return;
	}
};

if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginReg(new _p(), true);
} else {
	var w = {};
	w.init = true;
	w.obj = new _p();
	thirdparty_shared.waiting.push(w);
}

})();