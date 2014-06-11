/*
 * Плагин Football League
 * Версия: 1.0.0 (12.03.2013 11:42 +0400)
 * Developer: Bogdan Nazar
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
		var script = document.createElement("SCRIPT");
		script.type = "text/javascript";
		script.src = "/thirdparty-v2/_core/core.js?v1";
		document.getElementsByTagName("head")[0].appendChild(script);
	})(thirdparty_shared);
}

(function(){
var __name_script	=	"league.js";
var __name_this		=	"league";

//защита от двойной инициализации
if (thirdparty_shared.core._loaded) {
	if (thirdparty_shared.core._obj.pluginGet(__name_this)) return;
} else {
	for (var c in thirdparty_shared.waiting) {
		if (!thirdparty_shared.waiting.hasOwnProperty(c)) continue;
		if (thirdparty_shared.waiting[c].obj && thirdparty_shared.waiting[c].obj._name && (thirdparty_shared.waiting[c].obj._name == __name_this)) return;
	}
}

var _league = function() {
	this._inited	=	false;
	this._name		=	__name_this;
	this._tables	=	[];
	this.elBlock300	=	null;
	this.elScript	=	null;
	this.elStyles	=	null;
	this.plCore		=	null;
};
_league.prototype._init = function(last) {
	if (!this.elBlock300) {
		if (!document.getElementById("thirdparty-v2-" + this._name)) {
			if (last) {
				this.plCore.console(__name_script + " > " + this._name +"._init(): Частичная инициализиация, Block300 отключен: соответствующий DOM не найден.");
			} else return false;
		} else this.elBlock300 = document.getElementById("thirdparty-v2-" + this._name);
	}
	if (this.elBlock300) {
		this.elStyles = document.createElement("LINK");
		this.elStyles.type = "text/css";
		this.elStyles.rel = "stylesheet";
		this.elStyles.href = "/thirdparty-v2/_plugins/" + this._name + "/" + this._name + ".css?ver=1";
		this.elStyles.media = "screen";
		document.getElementsByTagName("head")[0].appendChild(this.elStyles);
		var ts = $(".html-component ." + this._name + "-v2");
		if (ts && ts.length) {
			for (var c = 0; c < ts.length; c++)
				this._tables.push(ts[c]);
		}
		for (var c in this._tables)
			if (this._tables.hasOwnProperty(c)) {
				this.elBlock300.appendChild(this._tables[c]);
				this._tables[c].className = this._name + "-table";
			}
	}
	this._inited = true;
	return true;
};

if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginReg(new _league(), true);
} else {
	var p = {};
	p.init = true;
	p.obj = new _league();
	thirdparty_shared.waiting.push(p);
}

})();