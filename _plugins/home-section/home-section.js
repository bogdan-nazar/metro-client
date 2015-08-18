/*
 * Плагин Metro Home Section
 * Версия: 1.0.26 (15.05.2015 18:28 +0400)
 * Developer: Bogdan Nazar
 * Type: Prototype
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

var __name_iptogeo	=	"iptogeo";
var __name_script	=	"home-section.js";
var __name_this		=	"home-section";

var _home_section = function() {
	this._config		=	{
		_loaded:			false,
		debugIP:			"",
		destDom:			"section-4",
		destDivsSkip:		3,
		destDivsRem:		"all",
		mode:				"client",
		serverURL:			"http://apps.metronews.ru/pool/home-section/index.php",
		sourceDom:			"section-4",
		sourceSection:		"",
		sourceDivsInsert:	8,
		sourceDivsSkip:		0,
		sourceDivsMaxProc:	300,
		statSave:			false,
		triggerPath:		""//leave empty for index page
	};
	this._debug			=	true;
	this._initErr		=	false;
	this._inited		=	false;
	this._knownSections	=	{
			chelyabinsk:	{
				geo:		["Челябинск", "Челябинская область"],
				path:		"region/chelyabinsk"
			},
			ekaterinburg:	{
				geo:		["Екатеринбург", "Свердловская область"],
				path:		"region/ekaterinburg",
			},
			kazan:	{
				geo:		["Казань", "Республика Татарстан"],
				path:		"region/kazan",
			},
			nn:	{
				geo:		["Нижний Новгород", "Нижегородская область"],
				path:		"region/nn",
			},
			novosibirsk:	{
				geo:		["Новосибирск", "Новосибирская область"],
				path:		"region/novosibirsk",
			},
			omsk:	{
				geo:		["Омск", "Омская область"],
				path:		"region/omsk",
			},
			rnd:	{
				geo:		["Ростов-на-Дону", "Ростовская область"],
				path:		"region/rnd",
			},
			smolensk:	{
				geo:		["Смоленск", "Смоленская область"],
				path:		"region/smolensk",
			},
			tlt:	{
				geo:		["Тольятти", "Самарская область"],
				path:		"region/tlt",
			},
			ufa:	{
				geo:		["Уфа", "Республика Башкортостан"],
				path:		"region/ufa",
			},
			voronezh:	{
				geo:		["Воронеж", "Воронежская область"],
				path:		"region/voronezh",
			}
		},
	this._name			=	__name_this;
	this._nameProto		=	this._name;
	this._remhost		=	"";
	this.elDestDom		=	null;
	this.plCore			=	null;
	this.plIpToGeo		=	null;
};
_home_section.prototype._init = function(last, config) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if ((typeof config != "object") || !config) config = false;
	if (!this._config._loaded && config) {
		if (typeof config == "object") {
			var res = this.configImport(config);
			if (!res) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > [" + this._nameProto + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. Объект конфига имеет неверный формат.");
				return true;
			}
		}
	}
	if (!this.plIpToGeo) {
		this.plIpToGeo = this.plCore.pluginGet(__name_iptogeo);
		if (!this.plIpToGeo) {
			if (last) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > [" + this._nameProto + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. Истек таймаут ожидания инициализации требуемого плагина [" + __name_iptogeo + "].");
				return true;
			}
			return false;
		}
	}
	if (!this._config._loaded) {
		if (last) {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > [" + this._nameProto + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. Истек таймаут ожидания конфигурационных данных.");
			return true;
		}
		return false;
	}
	if (!this.elDestDom) {
		this.elDestDom = document.getElementById(this._config.destDom);
		if (!this.elDestDom) {
			if (last) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > [" + this._nameProto + "]._init(): Ошибка инициализации экземпляра плагина [" + this._name + "]. DOM-назначения не найден [#" + this._config.destDom + "].");
				return true;
			}
			return false;
		}
	}
	this._inited = true;
	this.elDestDom.style.minHeight = "1px";
	if (typeof thirdpartyHomeSectionStat == "object") {
		if (typeof thirdpartyHomeSectionStat[this._config.sourceSection] != "undefined")
			thirdpartyHomeSectionStat[this._config.sourceSection].push(new Date().getTime());
	}
	if (document.location.href.indexOf("http://www.metronews.ru/" + this._config.triggerPath + (this._config.triggerPath ? "/" : "")) === 0) {
		this.fRun = this._run.bind(this);
		this.plIpToGeo.getData(this.fRun);
	}
	return true;
};
_home_section.prototype._run = function(geo) {
	if ((typeof geo != "object") || !geo) return;
	if (typeof geo.region != "string") return;
	if (typeof thirdpartyHomeSectionStat == "object") {
		if (typeof thirdpartyHomeSectionStat[this._config.sourceSection] != "undefined")
			thirdpartyHomeSectionStat[this._config.sourceSection].push(new Date().getTime());
	}
	this._remohost = geo.remote_host;
	var f = false;
	var g;
	if ((window.location.href.indexOf("thirdpartyGeo=0") != -1) || (geo.remote_host == this._config.debugIP)) f = true;
	else {
		for (var c in this._knownSections[this._config.sourceSection].geo) {
			if (!this._knownSections[this._config.sourceSection].geo.hasOwnProperty(c)) continue;
			g = this._knownSections[this._config.sourceSection].geo[c];
			if ((g == geo.region) || (g == geo.city)) {
				f = true;
				break
			}
		}
	}
	if (f)	this.actionSectionGet();
};
_home_section.prototype.actionSectionGet = function() {
	if (this._config.mode == "client") {
		var req = this.plCore.reqXBuild(this);
		req.method = "POST";
		req.url = "/" + this._knownSections[this._config.sourceSection].path + "/";
		req.statusCb = this.onAction.bind(this);
		this.plCore.silentX(req);
	} else {
		var instance = parseInt(this._name.replace(this._nameProto + "-instance",""), 10);
		if (isNaN(instance)) instance = 1;
		var req = this.plCore.reqXBuild(this);
		req.method = "GET";
		req.url = this._config.serverURL + "?region=" + this._config.sourceSection + "&section=" + encodeURIComponent(this._config.sourceDom) + "&callback=" + this.plCore.base64.encode(("thirdparty_core.pluginGetInstance(\"" + this._nameProto + "\", " + instance + ").onData")) + "&skip=" + this._config.sourceDivsSkip + "&fetch=" + this._config.sourceDivsInsert;
		this.plCore.silentX(req);
	}
};
_home_section.prototype.actionStatSave = function() {
	if (!this._config.serverURL) {
		this.plCore.console(__name_script + " > [" + this._nameProto + "].actionStatSave(): невозможно сохранить статистику: серверный URL не задан [this._config.serverURL].");
		return;
	}
	var start = 0;
	var init = 0;
	var run = 0;
	var done = 0;
	var host = "";
	if (typeof thirdpartyHomeSectionStat != "undefined") {
		if (typeof thirdpartyHomeSectionStat[this._config.sourceSection]) {
			if (typeof thirdpartyHomeSectionStat[this._config.sourceSection][0] != "undefined") {
				start = thirdpartyHomeSectionStat[this._config.sourceSection][0];
			}
			if (typeof thirdpartyHomeSectionStat[this._config.sourceSection][1] == "number") {
				init = thirdpartyHomeSectionStat[this._config.sourceSection][1];
			}
			if (typeof thirdpartyHomeSectionStat[this._config.sourceSection][2] == "number") {
				run = thirdpartyHomeSectionStat[this._config.sourceSection][2];
			}
			if (typeof thirdpartyHomeSectionStat[this._config.sourceSection][3] == "number") {
				done = thirdpartyHomeSectionStat[this._config.sourceSection][3];
			}
			if (typeof thirdpartyHomeSectionStat[this._config.sourceSection][4] == "string") {
				host = thirdpartyHomeSectionStat[this._config.sourceSection][4];
			}
		}
	}
	if (start && init && run && done && host) {
		var req = this.plCore.reqXBuild(this);
		req.method = "POST";
		req.statusCb = this.onActionStat.bind(this);
		req.url = this._config.serverURL + "?stat=1&region=" + this._config.sourceSection +
		"&host=" + host + "&start=" + start + "&init=" + init + "&run=" + run + "&done=" + done;
		this.plCore.silentX(req);
	}
};
_home_section.prototype.configImport = function(config) {
	for (var c in this._config) {
		if (!this._config.hasOwnProperty(c)) continue;
		if (c == "_loaded") continue;
		if (typeof config[c] == "undefined") continue;
		switch (c) {
			case "debugIP":
			case "destDom":
				if (typeof config[c] != "string") return false;
				this._config[c] = config[c];
				break;
			case "destDivsSkip":
			case "destDivsRem":
				if ((typeof config[c] == "string") && (config[c] == "all")) this._config[c] = "all";
				else {
					if (typeof config[c] == "number") this._config[c] = config[c];
					else {
						var n = parseInt(config[c], 10);
						if (isNaN(n)) return false;
						this._config[c] = n;
					}
				}
				break;
			case "mode":
				if (typeof config.mode != "string") return false;
				if (config.mode != "client") this._config.mode = "server";
				else this._config.mode = "client";
				break;
			case "serverURL":
			case "sourceDom":
			case "sourceSection":
				if (typeof config[c] != "string") return false;
				if (c == "sourceSection") {
					if (!config[c]) return false;
					if (typeof this._knownSections[config[c]] == "undefined") return false;
				}
				this._config[c] = config[c];
				break;
			case "sourceDivsInsert":
			case "sourceDivsSkip":
				if ((typeof config[c] == "string") && (config[c] == "all")) this._config[c] = "all";
				else {
					if (typeof config[c] == "number") this._config[c] = config[c];
					else {
						var n = parseInt(config[c], 10);
						if (isNaN(n)) return false;
						this._config[c] = n;
					}
				}
				break;
			case "triggerPath":
				if (typeof config[c] != "string") return false;
				this._config[c] = config[c].replace(/^\/|\/$/g, "");
				break;
			default:
				this._config[c] = config[c];
		}
	}
	if (this._config.sourceDivsSkip == "all") return false;
	if (this._config.triggerPath == this._knownSections[this._config.sourceSection].path) return false;
	this._config._loaded = true;
	return true;
};
_home_section.prototype.domUpdate = function(sd) {
	var sNodes = [];
	if (this._config.mode == "client") {
		var cntS = 0;
		var cntI = 0;
		for (var c in sd.childNodes) {
			if (typeof sd.childNodes[c].tagName == "undefined") continue;
			if (sd.childNodes[c].tagName.toUpperCase() != "DIV") continue;
			cntS++;
			if (cntS > this._config.sourceDivsSkip) {
				if (this._config.sourceDivsInsert == "all")
					sNodes.push(sd.childNodes[c]);
				else {
					cntI++;
					if (cntI > this._config.sourceDivsInsert) break;
					sNodes.push(sd.childNodes[c]);
				}
			}
		}
	} else {
		for (var c in sd.childNodes) {
			if (typeof sd.childNodes[c].tagName == "undefined") continue;
			if (sd.childNodes[c].tagName.toUpperCase() != "DIV") continue;
			sNodes.push(sd.childNodes[c]);
		}
	}
	var refNode = false;
	var cnt = 0;
	if (this._config.destDivsSkip !== "all") {
		for (var c in this.elDestDom.childNodes) {
			if (typeof this.elDestDom.childNodes[c].tagName == "undefined") continue;
			if (this.elDestDom.childNodes[c].tagName.toUpperCase() != "DIV") continue;
			cnt++;
			if (cnt > this._config.destDivsSkip) {
				refNode = this.elDestDom.childNodes[c];
				break;
			}
		}
	}
	if (this._config.destDivsSkip !== "all") {
		var rem = [], cnt2 = 0;
		if (this._config.destDivsRem !== "all") {
			for (var c in this.elDestDom.childNodes) {
				if (typeof this.elDestDom.childNodes[c].tagName == "undefined") continue;
				if (this.elDestDom.childNodes[c].tagName.toUpperCase() != "DIV") continue;
				cnt++;
				if (cnt <= this._config.destDivsSkip) continue;
				cnt2++;
				if (cnt2 > this._config.destDivsRem) break;
				rem.push(this.elDestDom.childNodes[c]);
			}
		} else {
			for (var c in this.elDestDom.childNodes) {
				if (typeof this.elDestDom.childNodes[c].tagName == "undefined") continue;
				if (this.elDestDom.childNodes[c].tagName.toUpperCase() != "DIV") continue;
				cnt++;
				if (cnt <= this._config.destDivsSkip) continue;
				rem.push(this.elDestDom.childNodes[c]);
			}
		}
		for (var c in rem) {
			if (!rem.hasOwnProperty(c)) continue;
			rem[c].parentNode.removeChild(rem[c]);
		}
	}
	if (!refNode) {
		for (var c in sNodes) {
			if (!sNodes.hasOwnProperty(c)) continue;
			this.elDestDom.appendChild(sNodes[c]);
		}
	} else {
		for (var c in sNodes) {
			if (!sNodes.hasOwnProperty(c)) continue;
			this.elDestDom.insertBefore(sNodes[c], refNode);
		}
	}
};
_home_section.prototype.onAction = function(req) {
	var sd;
	try {
		var d = req.worker.contentDocument;
		sd = d.getElementById(this._config.sourceDom);}catch(e){sd = false;};
	if (!sd) {
		this.plCore.console(__name_script + " > [" + this._nameProto + "].onAction(): невозможно выполнить вставку. DOM-источника не найден [#" + this._config.sourceDom + "].");
		return;
	}
	if (typeof thirdpartyHomeSectionStat == "object") {
		if (typeof thirdpartyHomeSectionStat[this._config.sourceSection] != "undefined") {
			thirdpartyHomeSectionStat[this._config.sourceSection].push(new Date().getTime());
			thirdpartyHomeSectionStat[this._config.sourceSection].push(this._remohost);
		}
	}
	this.domUpdate(sd);
	if (this._config.statSave) this.actionStatSave();
};
_home_section.prototype.onActionStat = function(req) {
	var r = req;
};
_home_section.prototype.onData = function(res) {
	if (!res.data) {
		this.plCore.console(__name_script + " > [" + this._nameProto + "].onData(): невозможно выполнить вставку. Сервер вернул пустой ответ [регион: " + this._config.sourceSection + "].");
		return;
	}
	var html = this.plCore.base64.decode(res.data);
	var sd = document.createElement("DIV");
	sd.innerHTML = html;
	if (typeof thirdpartyHomeSectionStat == "object") {
		if (typeof thirdpartyHomeSectionStat[this._config.sourceSection] != "undefined") {
			thirdpartyHomeSectionStat[this._config.sourceSection].push(new Date().getTime());
			thirdpartyHomeSectionStat[this._config.sourceSection].push(this._remohost);
		}
	}
	this.domUpdate(sd);
	if (this._config.statSave) this.actionStatSave();
};
if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginRegProto(_home_section, __name_this, true);
} else {
	var w = {};
	w.proto = _home_section;
	w.name = __name_this;
	w.init = true;
	if (typeof thirdparty_shared.waitingProtos == "undefined") thirdparty_shared.waitingProtos = [];
	thirdparty_shared.waitingProtos.push(w);
}

})();