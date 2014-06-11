/*
 * Плагин Metro Adult Warning
 * Версия: 1.0.5 (29.05.2013 17:51 +0400)
 * Developer: Bogdan Nazar
 * Type: Prototype
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
		script.src = "/thirdparty-v2/_core/core.js?ver=1.0.33";
		document.getElementsByTagName("head")[0].appendChild(script);
	})(thirdparty_shared);
}

(function(){

var __name_popup	=	"pu";
var __name_script	=	"adult-warning.js";
var __name_this		=	"adult-warning";

var _adult_warning = function() {
	this._config		=	{
		_loaded:			false,
		section:			"test"
	};
	this._debug			=	true;
	this._initErr		=	false;
	this._inited		=	false;
	this._name			=	__name_this;
	this._nameProto		=	this._name;
	this._pu			=	-1;
	this.elContent		=	null;
	this.elCss			=	null;
	this.elSection		=	null;
	this.plCore			=	null;
	this.plPu			=	null;
};
_adult_warning.prototype._init = function(last, config) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if ((typeof config != "object") || !config) config = false;
	if (!this._config._loaded && config) {
		if (typeof config == "object") {
			var res = this.configImport(config);
			if (!res) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > [" + this._name + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. Объект конфига имеет неверный формат.");
				return true;
			}
		}
	}
	if (!this.elCss) {
		var src = this.plCore.baseDir() + "_plugins/" + this._nameProto + "/" + this._nameProto + ".css?ver=1.0.5";
		var c = this.plCore.resourceLoad("css", src);
		if (c) this.elCss = c.el;
		else {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Ошибка загрузки CSS стилей [" + src + "]");
			return true;
		}
	}
	if (!this.plPu) {
		this.plPu = this.plCore.pluginGet(__name_popup, "1.0.3");
		if (!this.plPu) {
			if (last) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Истек таймаут ожидания инициализации требуемого плагина [" + __name_pu + "]");
				return true;
			} else return false;
		}
	}
	if (!this._config._loaded) {
		if (last) {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > [" + this._name + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. Истек таймаут ожидания конфигурационных данных.");
			return true;
		}
		return false;
	}
	if (!this.elSection) {
		this.elSection = document.getElementById("section-1");
		if (!this.elSection) {
			if (last) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > [" + this._name + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. Разметка страницы имеет неизвестный формат, элемент не найден [#section-1].");
				return true;
			}
			return false;
		}
	}
	this._inited = true;
	var cookie = this.plCore.cookieGet("thirdparty-" + this._nameProto);
	if (cookie) return true;
	if (document.location.href.indexOf("http://www.metronews.ru/" + this._config.section) != -1) this.popup();
	return true;
};
_adult_warning.prototype.configImport = function(config) {
	for (var c in this._config) {
		if (!this._config.hasOwnProperty(c)) continue;
		if (c == "_loaded") continue;
		if (typeof config[c] == "undefined") continue;
		switch (c) {
			case "section":
				if (typeof config[c] != "string") return false;
				this._config[c] = config[c];
				break;
		}
	}
	this._config._loaded = true;
	return true;
};
_adult_warning.prototype.onClickCancel = function() {
	this.elContent.parentNode.removeChild(this.elContent);
	document.location.href = "/";
};
_adult_warning.prototype.onClickOk = function() {
	var d = new Date();
	d.setDate(d.getDate() + 7);
	d = d.toUTCString();
	this.plCore.cookieSet("thirdparty-" + this._nameProto, "ok", d, "/" + this._config.section);
	this.plPu.hide(this._pu);
};
_adult_warning.prototype.popup = function() {
	try {
		this._pu = this.plPu.add({
			windowed: false,
			showcloser: false
		});
	} catch(e) { this._pu = -1;}
	if (this._pu == -1) {
		this.plCore.console(__name_script + " > [" + this._name + "].popup(): Невозможно показать предупреждение, ошибка создания всплывающего окна.");
		return;
	}
	var c = document.createElement("DIV");
	this.elContent = c;
	c.className = this._nameProto;
	var el = document.createElement("DIV");
	el.className = "popup-main";
	c.appendChild(el);
	var btn1 = document.createElement("DIV");
	btn1.className = "btn";
	el.appendChild(btn1);
	var btn2 = document.createElement("DIV");
	btn2.className = "btn-sp";
	el.appendChild(btn2);
	var btn2 = document.createElement("DIV");
	btn2.className = "btn";
	el.appendChild(btn2);
	var img1 = document.createElement("IMG");
	img1.src = "/thirdparty-v2/_plugins/" + this._nameProto + "/images/18yes.png?ver=2";
	this.plCore.eventAdd(img1, "click", this.onClickOk.bind(this));
	btn1.appendChild(img1);
	var img2 = document.createElement("IMG");
	img2.src = "/thirdparty-v2/_plugins/" + this._nameProto + "/images/18no.png?ver=2";
	this.plCore.eventAdd(img2, "click", this.onClickCancel.bind(this));
	btn2.appendChild(img2);
	this.plPu.content(this._pu, c);
	this.plPu.show(this._pu);
};

if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginRegProto(_adult_warning, __name_this, true);
} else {
	var w = {};
	w.proto = _adult_warning;
	w.name = __name_this;
	w.init = true;
	if (typeof thirdparty_shared.waitingProtos == "undefined") thirdparty_shared.waitingProtos = [];
	thirdparty_shared.waitingProtos.push(w);
}

})();