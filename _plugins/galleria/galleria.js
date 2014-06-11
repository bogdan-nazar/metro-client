/*
 * Плагин Metro Galleria Wrapper
 * Версия: 1.0.2 (01.04.2013 14:53 +0400)
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
		script.src = "/thirdparty-v2/_core/core.js?ver=1.0.18";
		document.getElementsByTagName("head")[0].appendChild(script);
	})(thirdparty_shared);
}

(function(){

var __name_lib		=	"lib";
var __name_script	=	"galleria.js";
var __name_this		=	"galleria";

//защита от двойной инициализации
if (thirdparty_shared.core._loaded) {
	if (thirdparty_shared.core._obj.pluginGet(__name_this)) return;
} else {
	for (var c in thirdparty_shared.waiting) {
		if (!thirdparty_shared.waiting.hasOwnProperty(c)) continue;
		if (thirdparty_shared.waiting[c].obj && thirdparty_shared.waiting[c].obj._name && (thirdparty_shared.waiting[c].obj._name == __name_this)) return;
	}
}

var _galleria = function() {
	this._initErr			=	false;
	this._inited			=	false;
	this._items				=	[];
	this._hooksOnReady		=	[];
	this._name				=	__name_this;
	this._script			=	null;
	this.fOnScriptReady		=	null;
	this.plCore				=	null;
	this.plLib				=	null;
};
_galleria.prototype._init = function(last) {
	if (this._inited) return true;
	if (!this.fOnScriptReady)
		this.fOnScriptReady = this.onScriptReady.bind(this);
	if (typeof Galleria == "undefined") {
		if (this.plCore._url.host.indexOf("metronews.ru") != -1) {
			if (last) {
				this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Требуемый внешний  Galleria не обнаружен.");
				this._inited = true;
				this._initErr = true;
				this.hooksOnReady();
				return true;
			} else return false;
		} else {
			if (!this._script) {
				var src = this.plCore.baseDir() + "_plugins/" + this._name + "/" + this._name + ".min.js?ver=1";
				this._script = this.plCore.resourceLoad("script", src, this.fOnScriptReady);
				if (this._script == false) {
					this._inited = true;
					this._initErr = true;
					this.hooksOnReady();
					this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Ошибка загрузки основного скрипта [" + src + "]");
					return true;
				}
			}
		}
	}
	this._inited = true;
	if (!this._script) {
		Galleria.loadTheme('/templates/v3/javascript/vendor/galleria.azur.min.js');
		this.hooksOnReady();
	}
	return true;
};
_galleria.prototype.hookOnReadyAdd = function(cb) {
	if (this._inited) {
		var c = cb;
		var er = this._initErr;
		var cr = this.plCore;
		window.setTimeout(function(){
			try {c(er)} catch(e) {
				cr.console(__name_script + " > " + this._name + ".hookOnReady(): Ошибка выполнения callback-функции. " + e.message + " [" + e.name + "/" + e.type + "]");
			}
		}, 1);
		return;
	}
	this._hooksOnReady.push(cb);
};
_galleria.prototype.hooksOnReady = function() {
	for (var c in this._hooksOnReady) {
		if (!this._hooksOnReady.hasOwnProperty(c)) continue;
		try {this._hooksOnReady[c](this._initErr)} catch(e) {
			this.plCore.console(__name_script + " > " + this._name + ".hookOnReady(): Ошибка выполнения callback-функции. " + e.message + " [" + e.name + "/" + e.type + "]");
		}
	}
};
_galleria.prototype.onScriptReady = function(i) {
	if (!i.loaded) {
		this._initErr = true;
		this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Истек таймаут загрузки основного скрипта [" + src + "]");
	}
	Galleria.loadTheme(this.plCore.baseDir() + "_plugins/" + this._name + "/themes/classic/galleria.classic.min.js");
	this.hooksOnReady();
};

if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginReg(new _galleria(), true);
} else {
	var w = {};
	w.init = true;
	w.obj = new _galleria();
	thirdparty_shared.waiting.push(w);
}

})();