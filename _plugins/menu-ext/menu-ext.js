/*
 * Плагин MenuExtend
 * Версия: 1.0.11 (15.04.2015 12:01 +0400)
 * Developer: Bogdan Nazar <nazar.bogdan@gmail.com>
 * Copyright (c) 2005-2015 Metro
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
var __name_script	=	"menu-ext.js";
var __name_this		=	"menu-ext";

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
	this._data			=	[
		{title: "Metro Воронеж", domain: "vrn.metronews.ru", link: "/region/voronezh/"},
		{title: "Metro Екатеринбург", domain: "ekb.metronews.ru", link: "/region/ekaterinburg/"},
		{title: "Metro Казань", domain: "kzn.metronews.ru", link: "/region/kazan/"},
		{title: "Metro Нижний Новгород", domain: "nn.metronews.ru", link: "/region/nn/"},
		{title: "Metro Новосибирск", domain: "nsk.metronews.ru", link: "/region/novosibirsk/"},
		{title: "Metro Омск", domain: "omsk.metronews.ru", link: "/region/omsk/"},
		{title: "Metro Ростов-на-Дону", domain: "rnd.metronews.ru", link: "/region/rnd/"},
		{title: "Metro Смоленск", domain: "smolensk.metronews.ru", link: "/region/smolensk/"},
		{title: "Metro Тольятти", domain: "tlt.metronews.ru", link: "/region/tlt/"},
		{title: "Metro Уфа", domain: "ufa.metronews.ru", link: "/region/ufa/"},
		{title: "Metro Челябинск", domain: "chel.metronews.ru", link: "/region/chelyabinsk/"}
    ];
	this._name			=	__name_this;
	this.elPlaceholder	=	null;
	this.plCore			=	null;
};
_p.prototype._init = function(last) {
	if (this._inited) return true;
	this._inited = true;
	this.placeholder();
	return this._inited;
};
_p.prototype.placeholder = function() {
	var f, self = this;
	var t = 100;
	var tc = 0;
	var tm = 100;
	f = function() {
		self.elPlaceholder = $("#body-wrapper #wrapper #header-links ul")[0] || null;
		if (self.elPlaceholder) {
			self.geo();
			return;
		}
		tc++;
		t = t * 2;
		if (tc < tm) window.setTimeout(f, t);
	}
	f();
};
_p.prototype.geo = function() {
	var g, f, self = this;
	var t = 100;
	var tc = 0;
	var tm = 100;
	f = function(d) {
		if (typeof d == "object") {
			//if ((d.region != "Москва") && (d.region.indexOf("Москов") == -1) && (d.region.indexOf("Санкт") == -1) && (d.region.indexOf("Ленинград") == -1)) self.render();
			self.render();
			return;
		}
		tc++;
		t = t * 2;
		g = self.plCore.pluginGet("iptogeo");
		if (!g) {
			if (tc < tm) window.setTimeout(f, t);
			return;
		}
		g.getData(f);
	}
	f();
};
_p.prototype.render = function() {
	var self = this,
		c = null,
		h = 0,
		p = this.elPlaceholder,
		state = 0;
	var el = document.createElement("LI");
	el.style.fontWeight = "bold";
	p.appendChild(el);
	//относительный слой
	var rel = document.createElement("DIV");
	rel.style.display = "inline-block";
	rel.style.position = "relative";
	rel.style.margin = "0";
	rel.style.outline = "0";
	rel.style.padding = "0";
	rel.style.fontSize = "0";
	rel.style.lineHeight = "0";
	rel.style.width = "0";
	rel.style.height = "0";
	rel.style.overflow = "visible";
	rel.style.zIndex = "1000";
	el.appendChild(rel);
	//текст меню
	var t = document.createElement("SPAN");
	t.style.display = "inline-block";
	t.style.textDecoration = "none";
	t.style.color = "#555";
	t.style.fontSize = "13px";
	t.style.padding = "0 .5em";
	t.style.cursor = "pointer";
	t.innerHTML = "Регионы";
	el.appendChild(t);
	//контейнер
	c = document.createElement("DIV");
	c.style.position = "absolute";
	c.style.top = "5px";
	c.style.left = "-3000px";
	c.style.width = "200px";
	c.style.padding = "5px";
	c.style.border = "1px solid #f47721";
	c.style.backgroundColor = "#fff";
	c.style.fontSize = "13px";
	c.style.fontWeight = "normal";
	c.style.lineHeight = "normal";
	c.style.overflow = "hidden";
	//кнопка закрытия
	var b = document.createElement("DIV");
	b.style.position = "absolute";
	b.style.right = "5px";
	b.style.zIndex = "+1";
	var bi = document.createElement("DIV");
	bi.style.padding = "3px 5px";
	bi.style.backgroundColor = "#f47721";
	bi.style.color = "#fff";
	bi.style.fontWeight = "bold";
	bi.style.borderRadius = "5px";
	bi.style.cursor = "pointer";
	b.appendChild(bi);
	c.appendChild(b);
	//пункты меню
	var len = this._data.length, mi;
	for (var c1 = 0; c1 < len; c1++) {
		mi = document.createElement("A");
		mi.setAttribute("href", this._data[c1].link);
		mi.innerHTML = this._data[c1].title;
		mi.style.padding = "3px 0";
		c.appendChild(mi);
	}
	rel.appendChild(c);
	h = $(c).height();
	c.style.display = "none";
	c.style.height = "0";
	c.style.left = "0";
	var f = function() {
		$(c).stop(true, false);
		if (state) $(c).animate({height: 0, opacity: 0}, 500, function() {
			this.style.display = "none";
		}); else {
			c.style.display = "block";
			$(c).animate({height: h, opacity: 1}, 500);
		}
		state = state ? 0 : 1;
	};
	$(el).on("click", f);
	$(bi).on("click", f);
	$(t).mouseover(function() {t.style.textDecoration = "underline";});
	$(t).mouseout(function() {t.style.textDecoration = "none";});
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