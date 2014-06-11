/*
 * Ядро подключаемых плагинов Metro Core Thirdparty
 * Версия: 1.0.38 (11.06.2013 15:56 +0400)
 * Developer: Bogdan Nazar
 * Copyright (c) 2005-2013 Metro
 *
 * Требования: -
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
	})(thirdparty_shared);
}

if (typeof thirdparty_core == "undefined") {

var thirdparty_core = ((function(){

var __name_script	=	"core.js";
var __name_this		=	"core";

var _thirdparty_core = function() {
	this._baseDir				=	"/thirdparty-v2/";
	this._console				=	((typeof console == "undefined") || (!console)) ? false : true;
	this._html5					=	false;
	this._imgs					=	{
		dot:	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//fxdAgAEACYYDiPWTNmAAAAAASUVORK5CYII=",
		fbwait:	"R0lGODlhEAAQAPIEAPP1+fP2+fT2+ff5+////wAAAAAAAAAAACH5BAUIAAQAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADPUi63P4wLiAEUNTiSscQiuCBhPiZpHkRwNh+2Bif3oqGrszWsznYngHu90rxSjkY8je0AJ4bDYsjqVqvigQAIfkEBQgAAgAsAAADAAQACwCB8/X58/b5////AAAAAgiEIanL7X9AAQAh+QQJCAAJACwAAAAACgAQAIOBlb6GmsGHm8GwvNaxvdbx9Pfz9fjz9fn19/r///8AAAAAAAAAAAAAAAAAAAAAAAAENBAIAZK9ghBx8dhXURjCMHCJgSAGYKJdeXaWXNEy7M20y8cvWiInlAUsKpYtNMqAepNbJwIAIfkECQgAEAAsAAAAABAAEACEgZW+hprBh5vBipzCl6fIoa/OobDOsLzWsb3WuMLZwcrdwcre8fT38/X48/X59ff6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVsgMQwEBAGCAJgsZCSJYQrHIbRmsSzFXN8mBsOh4/lsJsfjQdzJIDQkrviMAluFxKL6w0GoxyvrZYR2cYZd71RbodVhb7pslTvjECVzvq4Hhy8xeC0iJCYoKl4hACH5BAkIABAALAAAAAAQABAAhIGVvoaawYebwYqcwpenyKGvzqGwzrC81rG91rjC2brE2sHK3cHK3srS49HY5tHY5////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVqICSOxDAQIiAIwDgaSWKIAoIIStMoYrEsBVHggAgoHg8exLeYQYbFo0PJDD4PB+Nj2vtZh1mFg7v0CrHGMdV8Dau7wLObXBUi3En4Fy3OQwxsYFp+dW1GOmtxhi4iMDI0NgGMECUnKSsAIQAh+QQJCAARACwAAAAAEAAQAISKnMKXp8ihr86hsM64wtm6xNrByt3Byt7K0uPR2ObR2Ofj6PDm6vHo7PPp7PPt8fbv8vf///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFY2AkjqQYAEBQrtFAEIO4jAWCFKJwHIPzPA5RQaHARXQHgQ/SEBKNyEADwnQWc7vBtBoZXlvZbbP7FA3C1LEXuhOIrezkm5wwng/StLNuDjceamVgPAyFNDZ2WSwlLjCLJCcpIQAh+QQJCAAMACwAAAAAEAAQAIO6xNrK0uPR2ObR2Ofj6PDo7PPp7PPs7vTs7/Xt8fbv8vfy9Pj///8AAAAAAAAAAAAEWpDJSau9eBIyQQjAkRyHZCSJIQHDEC5LYirp2gIJXDKGsqgMluC12PUShZVgeIDJeL5kcInTSQo0KcvVLF4VCu2t+8SGlcOcl2HWUkkjEwq4BVw2nY89w+8zIgAh+QQJCAANACwAAAAAEAAQAIPj6PDm6vHo7PPp7PPs7vTs7/Xt8fbv8vfy9Pjz9fnz9vn09vn3+fv///8AAAAAAAAEWbDJSau9OAOZ1koSQRiENBjGsDDMEiZJ2QwIubYhkhgmKiQsV8OAQMgEhwPhBmoQYMeD4RfMGUPJJav5jEkCycBN+Lw2kAfB+GVG/zxc0hEly0gAgIB9v48AACH5BAUIAAcALAAAAAAQABAAguzu9Ozv9fL0+PP1+fP2+fT2+ff5+////wNFeLrc/jCuUcpQ1CoQAiiGUSigqASD8IXjUV4HOgADi9kHIMwvieuzmskVgqFUPeJQthqWWjok7rkZBCuwDJQDkHi/YEUCACH5BAQUAAAALAwAAwAEAAoAAAIOhGQzpwCKoGhzvVXRAQUAOw=="
	};
	this._initAttempts			=	0;
	this._initAttemptsCtrl		=	300;
	this._initAttemptsMax		=	100;
	this._initAttemptsTm		=	200;
	this._name					=	__name_this;
	this._plugins				=	[];
	this._pluginsInitTm			=	false;
	this._pluginsInitInstancesTm=	false;
	this._pluginsInstances		=	[];
	this._protos				=	[];
	this._protosInstantiated	=	0;
	this._reqs					=	[];
	this._reqsX					=	[];
	this._ress					=	[];
	this._shared 				= 	thirdparty_shared;
	this._shared.core 			= 	{};
	this._shared.core._loaded 	= 	true;
	this._shared.core._obj 		= 	this;
	this._url					=	this.urlParse();
	this.fPluginsInit			=	this.pluginsInit.bind(this);
	this.fPluginsInitInstances	=	this.pluginsInitInstances.bind(this);
	this._init();
};
_thirdparty_core.prototype._init = function() {
	this.html5Check();
	for (var c in this._shared.waiting) {
		if (!this._shared.waiting.hasOwnProperty(c)) continue;
		if (typeof this._shared.waiting[c].obj != "object") continue;
		if (typeof this._shared.waiting[c].init != "boolean") this._shared.waiting[c].init = false;
		this.pluginReg(this._shared.waiting[c].obj, this._shared.waiting[c].init);
	}
	//регистрируем ждущие прототипы и создаем их экземпляры (в this.pluginRegProto())
	//на которые поступили заявки (waitingInstances)
	if ((typeof this._shared.waitingProtos == "object") && this._shared.waitingProtos) {
		var p;
		for (var c in this._shared.waitingProtos) {
			if (!this._shared.waitingProtos.hasOwnProperty(c)) continue;
			p = this._shared.waitingProtos[c];
			if (typeof p.proto != "function") continue;
			if ((typeof p.name != "string") || !p.name) continue;
			if (typeof p.init != "boolean") p.init = true;
			this.pluginRegProto(p.proto, p.name, p.init);
		}
	}
	//загружаем прототипы, которые не были еще подключены,
	//но на которые есть заявки с пометкой "загрузить"
	if ((typeof this._shared.waitingInstances == "object") && this._shared.waitingInstances) {
		var i;
		for (var c in this._shared.waitingInstances) {
			if (!this._shared.waitingInstances.hasOwnProperty(c)) continue;
			i = this._shared.waitingInstances[c];
			if ((typeof i.name != "string") || !i.name) continue;
			if ((typeof i.called == "boolean") && i.called) continue;
			if (typeof i.load == "undefined") i.load = true;
			if ((typeof i.load == "boolean") && i.load) {
				this.pluginGetInstance(i.name, true);
			}
			if (typeof i.load == "string") {
				if (!i.load) i.load = "1.0.0." + this.seed();
				this.pluginGetInstance(i.name, i.load);
			}
		}
	}
	this.pluginsInit();
	this.pluginsInitInstances();
};
_thirdparty_core.prototype.baseDir = function() {
	return this._baseDir;
};
_thirdparty_core.prototype.base64 = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	//метод для кодировки в base64 на javascript
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0
		input = this._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if( isNaN(chr2) ) {
				enc3 = enc4 = 64;
			}else if( isNaN(chr3) ) {
				enc4 = 64;
			}
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},
	//метод для раскодировки из base64
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if( enc3 != 64 ) {
				output = output + String.fromCharCode(chr2);
			}
			if( enc4 != 64 ) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = this._utf8_decode(output);
		return output;
	},
	// метод для кодировки в utf8
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if( c < 128 ){
				utftext += String.fromCharCode(c);
			} else if( (c > 127) && (c < 2048) ) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	//метод для раскодировки из utf8
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = 0;
		var c1 = 0;
		var c2 = 0;
		var c3 = 0;
		while( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}else if( (c > 191) && (c < 224) ) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};
_thirdparty_core.prototype.bind = (function (slice){
        // (C) WebReflection - Mit Style License
        function bind(context) {
            var self = this; // "trapped" function reference
            // only if there is more than an argument
            // we are interested into more complex operations
            // this will speed up common bind creation
            // avoiding useless slices over arguments
            if (1 < arguments.length) {
                // extra arguments to send by default
                var $arguments = slice.call(arguments, 1);
                return function () {
                    return self.apply(
                        context,
                        // thanks @kangax for this suggestion
                        arguments.length ?
                            // concat arguments with those received
                            $arguments.concat(slice.call(arguments)) :
                            // send just arguments, no concat, no slice
                            $arguments
                    );
                };
            }
            // optimized callback
            return function () {
                // speed up when function is called without arguments
                return arguments.length ? self.apply(context, arguments) : self.call(context);
            };
        }
        // the named function
        return bind;
} (Array.prototype.slice));
_thirdparty_core.prototype.console = function(msg) {
	if (this._console) console.log(msg);
};
_thirdparty_core.prototype.cookieGet = function(name) {
	var res = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)" );
	if (res)
		return (unescape(res[2]));
	else
		return "";
};
_thirdparty_core.prototype.cookieSet = function(name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
};
_thirdparty_core.prototype.eventAdd = function(el, evnt, func) {
	if (el.addEventListener) {
		el.addEventListener(evnt, func, false);
	} else if (el.attachEvent) {
		el.attachEvent("on" + evnt, func);
	} else {
		el[evnt] = func;
	}
};
_thirdparty_core.prototype.eventFix = function(e) {
	// получить объект событие для IE
	e = e || window.event
	// добавить pageX/pageY для IE
	if (e.pageX == null && e.clientX != null) {
		var html = document.documentElement;
		var body = document.body;
		e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
		e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
	}
	// добавить which для IE
	if (!e.which && e.button) {
		e.which = (e.button & 1) ? 1 : ((e.button & 2) ? 3 : ((e.button & 4) ? 2 : 0));
	}
	if (!e.target && e.srcElement) {
		e.target = e.srcElement;
	}
	return e;
};
_thirdparty_core.prototype.eventPreventDefault = function(e) {
	if (typeof e == "undefined") return;
	if (e.preventDefault) {
		e.preventDefault();
		e.stopPropagation();
	} else {
		e.returnValue = false;
		e.cancelBubble = true;
	}
};
_thirdparty_core.prototype.eventRemove = function(el, evnt, func) {
	if (el.removeEventListener) {
		el.removeEventListener(evnt, func, false);
	} else if (el.attachEvent) {
		el.detachEvent("on" + evnt, func);
	} else {
		el[evnt] = null;
	}
};
_thirdparty_core.prototype.historyWrite = function(entity, uri, title) {
	if (!this._html5) return;
	var p = "http://"+ this._url.host + (this._url.port ? (":" + this._url.port) : "") + "/" + uri;
	if (history.state && typeof history.state[entity] != "undefined")
		history.replaceState({entity: "ok"}, title, p);
	else
		history.pushState({entity: "ok"}, title, p);
};
_thirdparty_core.prototype.html5Check = function() {
	var html5history = !!(history.pushState && history.state !== "undefined")
	var classList = "classList" in document.createElement("i");
	this._html5 = (html5history && classList);
};
_thirdparty_core.prototype.objectReg = function(p) {
	p.plCore = this;
	this._objects.push(p);
};
_thirdparty_core.prototype.pluginGet = function(n, load) {
	if (typeof n != "string") return null;
	for (var c in this._plugins) {
		if(!this._plugins.hasOwnProperty(c)) continue;
		if (this._plugins[c].name == n) return this._plugins[c].obj;
	}
	if ((typeof load != "boolean") && (typeof load != "string")) load = false;
	var ver = "";
	if (typeof load == "string") {
		ver = load;
		load = true;
	}
	if (load) {
		var src = this._baseDir + "_plugins/" + n + "/" + n + ".js" + (ver ? ("?ver=" + ver) : "");
		var r = this.resourceFind(src);
		if (!r) this.resourceLoad("script", src);
	}
	return null;
};
_thirdparty_core.prototype.pluginGetInstance = function(name, load) {
	if (typeof name != "string") return null;
	if (typeof load == "undefined") load = false;
	var ver = "";
	if (typeof load == "number") {
		for (var c in this._pluginsInstances) {
			if (!this._pluginsInstances.hasOwnProperty(c)) continue;
			if ((this._pluginsInstances[c].name == name) && (this._pluginsInstances[c].instance == load)) return this._pluginsInstances[c].obj;
		}
		return null;
	}
	if (typeof load == "string") {
		ver = load;
		load = true;
	}
	if (typeof this._protos[name] == "undefined") {
		if (!load) return null;
		var src = this._baseDir + "_plugins/" + name + "/" + name + ".js" + (ver ? ("?ver=" + ver) : "");
		var r = this.resourceFind(src);
		if (!r) this.resourceLoad("script", src);
		return null;
	}
	var p;
	try {
		p = new this._protos[name].worker;
		this._protosInstantiated++;
	} catch (e) {
		this.console(__name_script + " > " + this._name + ".pluginGetInstance(): Ошибка создания экземпляра плагина [" + name + "]. Compiler message: [" + e.name + "/" +  e.message + "]");
		return null;
	}
	var data = {obj: p, name: p._name, instance: this._protosInstantiated, inited: (!this._protos[name].init), initAttempt: 0, initRestarted: false};
	this._pluginsInstances.push(data);
	p.plCore = this;
	p._name = p._name + "-instance" + this._protosInstantiated;
	if (this._protos[name].init) {
		if (!this._pluginsInitInstancesTm)
			this._pluginsInitInstancesTm = window.setTimeout(this.fPluginsInitInstances, 50);
	}
	return p;
};
_thirdparty_core.prototype.pluginInitRestart = function(name) {
	if (typeof name != "string") return false;
	for (var c in this._plugins) {
		if (this._plugins[c].name == name) {
			if (this._plugins[c].iRestarted) return false;
			this._plugins[c].icn = 0;
			this._plugins[c].iRestarted = true;
			return true;
		}
	}
	return false;
};
_thirdparty_core.prototype.pluginInstanceInitRestart = function(obj) {
	if ((typeof obj != "object") || (typeof obj._nameProto != "string")) return false;
	var protoNum = parseInt(obj._name.replace(obj._nameProto + "-instance"), 10);
	if (isNaN(protoNum)) return false;
	for (var c in this._pluginsInstances) {
		if ((this._pluginsInstances[c].name == obj._nameProto) && (this._pluginsInstances[c].instance == protoNum)) {
			if (this._pluginsInstances[c].initRestarted) return false;
			this._pluginsInstances[c].initAttempt = 0;
			this._pluginsInstances[c].initRestarted = true;
			return true;
		}
	}
	return false;
};
_thirdparty_core.prototype.pluginReg = function(p, init) {
	if (typeof p != "object") return;
	if (typeof p._name == "undefined") {
		this.objectReg(p);
		return;
	}
	if (typeof init != "boolean") init = false;
	p.plCore = this;
	var item = {};
	item.ier = false;
	item.init = init;
	item.inited = false;
	item.iRestarted = false;
	item.icn = 0;
	item.obj = p;
	item.name = p._name;
	this._plugins.push(item);
	if (item.init && (typeof item.obj._init == "function")) {
		item.icn++;
		try {
			var res = item.obj._init(item.icn == this._initAttemptsMax);
			if (typeof res != "boolean") {
				if (typeof item.obj._inited == "boolean" && !item.obj._inited) res = false;
				else res = true;
			}
			if (res) item.inited = true;
		} catch (e) {
			item.inited = true;
			item.ier = true;
			this.console(__name_script + " > Ошибка инициализация плагина [" + p._name + "]: Compiler message [" + e.name + "/" + e.message + "]");
		}
	} else item.inited = true;
	if (!item.inited) {
		if (this._initAttempts < this._initAttemptsCtrl) {
			if (!this._pluginsInitTm)
				this._pluginsInitTm = window.setTimeout(this.fPluginsInit, this._initAttemptsTm);
		}
	}
};
_thirdparty_core.prototype.pluginRegProto = function(proto, name, init) {
	if (typeof proto != "function") return false;
	for (var c in this._protos) {
		if (!this._protos.hasOwnProperty(c)) continue;
		if (c == name) break;
	}
	if (typeof init != "boolean") init = true;
	var p = {worker: proto, "init": init};
	this._protos[name] = p;
	if ((typeof this._shared.waitingInstances == "object") && this._shared.waitingInstances) {
		for (var c in this._shared.waitingInstances) {
			if (!this._shared.waitingInstances.hasOwnProperty(c)) continue;
			if ((typeof this._shared.waitingInstances[c].name != "string") || !this._shared.waitingInstances[c].name) continue;
			if (this._shared.waitingInstances[c].name != name) continue;
			if (typeof this._shared.waitingInstances[c].called == "boolean" && this._shared.waitingInstances[c].called) continue;
			this._shared.waitingInstances[c].called = true;
			var i = this.pluginGetInstance(name, false);
			if (i && (typeof this._shared.waitingInstances[c].cb == "function")) {
				try {
					this._shared.waitingInstances[c].cb(i);
				} catch(e) {
					this.console(__name_script + " > " + this._name + "._init(): Ошибка выполнения callback-функции при конструировании плагина из стека ожидания [" + name + "]. Compiler message: [" + e.name + "/" +  e.message + "]");
				}
			}
		}
	}
	return true;
};
_thirdparty_core.prototype.pluginsInit = function() {
	if (this._pluginsInitTm) window.clearTimeout(this._pluginsInitTm);
	this._pluginsInitTm = false;
	this._initAttempts++;
	var icnt = 0;
	var pcnt = 0;
	for (var p in this._plugins) {
		if (!this._plugins.hasOwnProperty(p)) continue;
		pcnt++;
		if (this._plugins[p].inited) {
			icnt++;
			continue;
		}
		if (this._plugins[p].init) {
			this._plugins[p].icn++;
			if(this._plugins[p].icn > this._initAttemptsMax) {
				this._plugins[p].inited = true;
				icnt++;
				continue;
			}
			try {
				var last = ((this._plugins[p].icn == this._initAttemptsMax) || (this._initAttempts == this._initAttemptsCtrl));
				var res = this._plugins[p].obj._init(last);
				if (typeof res != "boolean") {
					if ((typeof this._plugins[p].obj._inited == "boolean") && !this._plugins[p].obj._inited) res = false;
					else res = true;
				}
				if (res) {
					this._plugins[p].inited = true;
					icnt++;
				}
			} catch (e) {
				this._plugins[p].inited = true;
				this._plugins[p].ier = true;
				icnt++;
				this.console(__name_script + " > " + this._name + ".pluginsInit(): Ошибка инициализация плагина [" + p + "]. Compiler message [" + e.name + "/" + e.message + "]");
			}
		}
		else icnt++;
	}
	if ((this._initAttempts < this._initAttemptsCtrl) && (icnt != pcnt)) {
		this._pluginsInitTm = window.setTimeout(this.fPluginsInit, this._initAttemptsTm);
	}
};
_thirdparty_core.prototype.pluginsInitInstances = function() {
	if (this._pluginsInitInstancesTm) window.clearTimeout(this._pluginsInitInstancesTm);
	this._pluginsInitInstancesTm = false;
	var notInitedYet = 0;
	for (var c in this._pluginsInstances) {
		if (!this._pluginsInstances.hasOwnProperty(c)) continue;
		var p = this._pluginsInstances[c];
		if (p.inited) continue;
		if (typeof p.obj._inited == "boolean" && (p.obj._inited)) {
			p.inited = true;
			continue;
		}
		if (typeof p.obj._init == "function") {
			p.initAttempt++;
			try {
				var res = p.obj._init((p.initAttempt == this._initAttemptsMax));
				if (typeof res !== "boolean") {
					p.inited = true;
				} else {
					if (!res) {
						if (p.initAttempt < this._initAttemptsMax) {
							notInitedYet++;
						} else {
							if (typeof p.obj._inited == "boolean" && (!p.obj._inited)) p.obj._initErr = true;
							p.inited = true;
						}
					} else {
						p.inited = true;
					}
				}
			} catch(e) {
				this.console(__name_script + " > " + this._name + ".pluginsInitInstances(): Ошибка инициализации экземпляра [" + p.name + "]. Compiler message: [" + e.name + "/" + e.message + "].");
				if (typeof p.obj._inited == "boolean") p.obj._initErr = true;
				p.inited = true;
			}
		} else {
			this.console(__name_script + " > " + this._name + ".pluginsInitInstances(): Предупреждение - точка инициализации [._init] экземпляра [" + p.name + "] не определена или не является функцией. Экземпляр пропущен.");
			p.inited = true;
		}
	}
	if (notInitedYet) {
		this._pluginsInitInstancesTm = window.setTimeout(this.fPluginsInitInstances, this._initAttemptsTm);
	}
};
_thirdparty_core.prototype.queryParse = function(q) {
	var pars = {},
		seg = q.replace(/^\?/, "").split("&"),
		len = seg.length, i = 0, s;
	for (;i<len;i++) {
		if (!seg[i]) continue;
		s = seg[i].split("=");
		pars[s[0]] = s[1];
	}
	return pars;
};
_thirdparty_core.prototype.reqBuild = function(o) {
	if (typeof o == "undefined") o = null;
	var r = {
		callback:	null,
		done:		false,
		error:		false,
		data:		{},
		isdata:		true,
		json:		true,
		key:		"" + (Math.floor((Math.random()*1000000000) + 1)),
		method:		"POST",
		pars:		{},
		owner:		o,
		response:	"",
		time:		new Date().getTime(),
		url:		"",
		valuesget:	"",
		valuespost:	null,
		worker:		this.xmlHttpGet()
	};
	return r;
};
_thirdparty_core.prototype.reqXBuild = function(o) {
	if (typeof o == "undefined") o = null;
	var r = {
		done:		false,
		error:		false,
		form:		null,
		json:		false,
		key:		"" + (Math.floor((Math.random()*1000000000) + 1)),
		method:		"GET",
		parent:		null,
		pars:		{},
		owner:		o,
		owner_store:{},
		status:		false,
		statusCb:	null,
		statusTm:	300,
		statusUrl:	"",
		time:		(new Date()).getTime(),
		url:		"",
		valsGET:	[],
		valsPOST:	[],
		worker:		null
	};
	return r;
};
_thirdparty_core.prototype.reqXFetch = function(key) {
	for (var c in this._reqsX) {
		if (!this._reqsX.hasOwnProperty(c)) continue;
		if (this._reqsX[c].key == key) return this._reqsX[c];
	}
	return false;
};
_thirdparty_core.prototype.reqXFormField = function(form, name, value) {
	if (typeof form == "undefined") return false;
	if (typeof name == "undefined") return false;
	if (typeof value == "undefined") value = "false";
	var type = "input";
	var val = "unknown value";
	if ((typeof value == "object") && (typeof value.nodeName != "undefined")) {
		if (typeof value.tagName != "undefined") {
			var tag = value.tagName.toLowerCase();
			switch (tag) {
				case "input":
					switch (value.type) {
						case "button":
							val = value.value;
							break;
						case "checkbox":
							val = value.checked ? "on" : "off";
							break;
						case "file":
							type = "file";
							break;
						case "hidden":
							val = value.value;
							break;
						case "password":
							val = value.value;
							break;
						case "submit":
							val = value.value;
							break;
						case "text":
							val = value.value;
							break;
						default:
							val = "not supported input type";
							break
					}
					break;
				case "textarea":
					type = "textarea";
					val = value.value;
					break;
				default:
					val = "not supported input";
					break;
			}
		} else {
			if (typeof value.textContent != "undefined") {
				type = "textarea";
				val = value.textContent;
			} else if (typeof value.innerText != "undefined") {
				type = "textarea";
				val = value.innerText;
			} else if (typeof value.innerHTML != "undefined") {
				type = "textarea";
				val = value.innerHTML;
			} else if (typeof value.nodeValue != "undefined") {
				type = "textarea";
				val = value.nodeValue;
			} else if (typeof value.toString != "undefined") {
				type = "textarea";
				val = value.toString();
			}
		}
	} else {
		if ((typeof value == "string") || (typeof value == "number")) val = "" + value;
		else {
			if (typeof value.toString != "undefined") val = value.toString();
			else val = "" + value;
		}
	}
	switch (type) {
		case "input":
			var el = document.createElement("INPUT");
			el.type = "hidden";
			el.name = name;
			el.value = val;
			form.appendChild(el);
			break;
		case "textarea":
			var el = document.createElement("TEXTAREA");
			el.name = name;
			el.value = val;
			form.appendChild(el);
			break;
		case "file":
			value.name = name;
			form.appendChild(value);
			break;
		default:
			return false;
	}
	return true;
};
_thirdparty_core.prototype.resourceFind = function(src, loaded) {
	src = src.split("?");
	var srcUrl = src[0];
	var srcQu = "";
	if (typeof src[1] != "undefined") srcQu = src[1];
	if (typeof loaded != "boolean") loaded = false;
	for (var c in this._ress) {
		if (!this._ress.hasOwnProperty(c)) continue;
		if (this._ress[c].url == srcUrl) {
			if (!loaded) return this._ress[c];
			else {
				if (this._ress[c].loaded) return this._ress[c];
			}
		}
	}
	return false;
};
_thirdparty_core.prototype.resourceLoad = function(type, src, id, callback) {
	if ((typeof type == "string") && type) type = type.toLowerCase();
	else return false;
	var key, val;
	var srcUrl, srcQu;
	if (typeof src == "string" && src) {
		//поиск по урлу
		src = src.split("?");
		srcUrl = src[0];
		srcQu = "";
		if (typeof src[1] != "undefined") srcQu = src[1];
		key = "url";
		val = srcUrl;
	} else {
		src = "";
		if ((typeof id != "string") || (!id)) return false;
		//поиск по id
		key = "id";
		val = id;
	}
	//ищем в ресурсах
	for (var c in this._ress) {
		if (!this._ress.hasOwnProperty(c)) continue;
		if (this._ress[c][key] == val) {
			//регистрируем callback
			var cbAdded = false;
			if (typeof callback == "function") {
				for (var c1 in this._ress[c].cbs) {
					if (!this._ress[c].cbs.hasOwnProperty(c1)) continue;
					if (this._ress[c].cbs[c1] == callback) break;
				}
				cbAdded = true;
				this._ress[c].cbs.push({cb: callback, done: false});
			}
			if (this._ress[c].loaded) {
				if (typeof callback == "function" && cbAdded) {
					window.setTimeout(this.resourceOnLoad.bind(this, this._ress[c]), 1);
				}
			}
			return this._ress[c];
		}
	}
	//если в ресурсах ничего нет, ищем в head
	var nodes = document.getElementsByTagName("head")[0].childNodes;
	var n = null;
	if (nodes.length) {
		for (var c in nodes) {
			n = document.getElementsByTagName("head")[0].childNodes[c];
			if (n && n.tagName) {
				var found = false;
				var tp = "";
				var url = ""
				if (key == "url") {
					url = val;
					if ((n.tagName.toUpperCase() == "LINK") && (n.href == val)) {
						found = true;
						tp = "text/css";
					}
					if ((n.tagName.toUpperCase() == "SCRIPT") && (n.src == val)) {
						found = true;
						tp = "text/javascript";
					}
				} else {
					if (n.id && (n.id == val)) {
						found = true;
						if (n.tagName.toUpperCase() == "LINK") {
							url = n.href;
							tp = "text/css";
						}
						if (n.tagName.toUpperCase() == "SCRIPT") {
							url = n.src;
							tp = "text/javascript";
						}
						url = url.split("?");
						srcUrl = url[0];
						srcQu = "";
						if (typeof url[1] != "undefined") srcQu = url[1];
					}
				}
				if (found) {
					var i = {
						cbs: [],
						el: n,
						id: (n.id ? n.id : ""),
						ie: (document.all ? true : false),
						loaded: ((n.readyState != "loaded") && (n.readyState != "complete") ? false : true),
						qu: srcQu,
						"tp": tp,
						url: srcUrl,
					}
					this._ress.push(i);
					//регистрируем callback
					if (typeof callback == "function") i.cbs.push({cb: callback, done: false});
					var f = this.resourceOnLoad.bind(this, i);
					if (i.loaded) {
						if (typeof callback == "function") {
							window.setTimeout(f, 1);
						}
					} else {
						if (i.ie) i.el.onreadystatechange = f;
						else i.el.onload = f;
					}
					return i;
				}
			}
		}
	}
	if (!src) return false;
	//если нигде не найден - загружаем
	var i = {
		cbs: [],
		el: null,
		id: "",
		ie: (document.all ? true : false),
		loaded: false,
		qu: srcQu,
		tp: type,
		url: srcUrl,
	}
	var h = document.getElementsByTagName("head");
	if (h.length == 0) return false;
	i.el = document.createElement(type == "css" ? "LINK" : "SCRIPT");
	if (id) {
		i.id = id;
		i.el.id = id;
	}
	i.el.type = (type == "css" ? "text/css" : "text/javascript");
	if (type == "css" ) {
		i.el.rel = "stylesheet";
		i.el.href = i.url + (i.qu ? ("?" + i.qu) : "");
		i.el.media = "screen";
	} else i.el.src = i.url + (i.qu ? ("?" + i.qu) : "");
	h[0].appendChild(i.el);
	if (typeof callback == "function") i.cbs.push({cb: callback, done: false});
	var f = this.resourceOnLoad.bind(this, i);
	if (i.ie) i.el.onreadystatechange = f;
	else i.el.onload = f;
	this._ress.push(i);
	return i;
};
_thirdparty_core.prototype.resourceOnLoad = function(i) {
	if (!i.loaded) {
		if ((i.el.readyState == "loaded") || (i.el.readyState == "complete")) i.loaded = true;
	}
	if (i.loaded) {
		for (var c in i.cbs) {
			if (!i.cbs.hasOwnProperty(c)) continue;
			if (i.cbc[c].done) continue;
			try {
				i.cbs[c].cb(i);
			} catch(e) {
				this.console(__name_script + " > resourceOnLoad(): Callback для ресурса [" + i.url + "] выполнен с ошибкой, " + e.message + " [" + e.name + "/" + e.type + "].");
			}
			i.cbc[c].done = true;
		}
	}
};
_thirdparty_core.prototype.seed = function() {
	if (typeof Math != "undefined")
		return "" + (Math.floor((Math.random()*1000000000) + 1));
	else
		return (new Date()).getTime();
};
_thirdparty_core.prototype.silent = function(req) {
	if ((typeof req == "undefined") || !req) return false;
	var r = {
		action: "",
		encode: false,
		cbobj: null,
		cbfunc: null,
		cbargs: null,
		data: "",
		path: "",
		query: "silent",
		r: this.xmlHttpGet(),
		url: ""
	};
	if (!r.r) {
		alert(__name_script + " > Ошибка создания фонового запроса [XmlHttpRequest]: браузер не поддерживает данную функцию.");
		return false;
	}
	r.action = typeof req.action == "string" ? req.action : "";
	//флаг кодирования
	r.encode = typeof req.encode == "boolean" ? req.encode : false;
	//замыкание
	r.cbobj = ((typeof req.cbobj == "object") && req.cbobj) ? req.cbobj : this;
	r.cbfunc = (typeof req.cbfunc == "function") ? req.cbfunc : null;
	r.cbargs = ((typeof req.cbargs == "object") && req.cbargs) ? req.cbargs : null;
	//данные
	if ((typeof req.data == "undefined") || !req.data) {
		if (!r.action) r.data = null;
		else r.data = this.elAction.name + "=" + r.action;
	}
	else {
		var p = [];
		if (r.action) p.push(this.elAction.name + "=" + r.action);
		for (var id in req.data)
			p.push("" + id + (((typeof req.data[id] != "undefined") && (req.data[id] != null)) ? ("=" + (r.encode ? encodeURIComponent(req.data[id]) : req.data[id])) : ""));
		r.data = p.join("&");
	}
	//http путь запроса
	r.path = ((typeof req.path != "string") || !req.path) ? document.location.href.replace("http://" + document.domain, "") : ((req.path.indexOf("http") != -1) ? req.path : (this._siteRoot + req.path).replace(/\/\//g, ""));
	//параметры запроса
	r.query += (((typeof req.query != "string") || !req.query) ? "" : ("&" + req.query)) + (r.base64 ? "&base64encoded" : "");
	r.url = this._plugins[__name_lib].obj.urlBuild(r.path, r.query, true);
	r.r.open("POST", r.url, true);
	r.r.onreadystatechange = this.silentOnState.bind(this, r);
	r.r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	r.r.send(r.data);
	this._reqs.push(r);
	return true;
};
_thirdparty_core.prototype.silentOnState = function(req) {
	if (req.r.readyState != 4) return;
	if (req.r.status == 200) {
		var args = [req.r.responseText];
		if (req.cbfunc)
			req.cbfunc.apply(req.cbobj, (req.cbargs ? args.concat(req.cbargs) : args));
	} else {
		this.console(__name_script + " > XMLHttpRequest: Ошибка операции [status: " + req.r.status + "]");
	}
	var l = this._reqs.length;
	for (var c = 0; c < l; c++)
		if (this._reqs[c] == req) {
			this._reqs.splice(c, 1);
			break;
		}
};
_thirdparty_core.prototype.silentX = function(req) {
	if (req.method == "GET") {
		req.worker = document.createElement("SCRIPT");
		req.worker.type = "text/javascript";
		req.worker.src = req.url + (req.url.indexOf("?") == -1 ? "?" : "&") + "actionKey=" + req.key + (req.valsGET ? (req.valsGET.indexOf("&") == 0 ? "" :"&") : "");
		document.getElementsByTagName("head")[0].appendChild(req.worker);
		this._reqsX.push(req);
		return;
	}
	if(req.method == "POST") {
		var name = "thirdparty-postform-" + this.seed();
		req.worker = document.createElement("IFRAME");
		req.worker.id = name;
		req.worker.name = name;
		if (typeof req.valsGET == "object") {
			var vg = "";
			for (var c in req.valsGET) {
				if (!req.valsGET.hasOwnProperty(c)) continue;
				vg += ((vg ? "" : "&") + c + "=" + req.valsGET[c]);
			}
			req.valsGET = vg;
		}
		if (typeof req.valsGET == "string") {
			if (req.valsGET.indexOf("&") == 0) req.valsGET = req.valsGET.substring(1, req.valsGET.length);
		}
		if (typeof req.valsPOST == "object") {
			var cnt = 0;
			for (var c in req.valsPOST) {
				if (!req.valsPOST.hasOwnProperty(c)) continue;
				cnt++;
			}
			if (!cnt) req.method = "GET";
			else {
				req.form = document.createElement("FORM");
				for (var c in req.valsPOST) {
					if (!req.valsPOST.hasOwnProperty(c)) continue;
					this.reqXFormField(req.form, c, req.valsPOST[c]);
				}
			}
		}
		req.parent = document.createElement("DIV");
		req.parent.style.display = "none";
		req.parent.style.overflow = "hidden";
		req.parent.style.height = "0";
		if (document.body.childNodes.length)
			document.body.insertBefore(req.parent, document.body.firstChild);
		else
			document.body.appendChild(req.parent);
		req.parent.appendChild(req.worker);
		req.onready = this.silentXOnReady.bind(this, req, "load");
		req.onreadyState = this.silentXOnReady.bind(this, req, "readystate");
		req.worker.onload = req.onready;
		req.worker.onreadystatechange = req.onreadyState;
		var action = (req.statusUrl ? ((req.url.indexOf("?") == -1 ? "?" : "&") + "actionKey=" + req.key) : "");
		action = req.url + action + (req.valsGET ? ((action ? "&" : (req.url.indexOf("?") == -1 ? "?" : "&")) + req.valsGET) : "");
		if (req.method == "POST") {
			req.worker.src = "javascript:false;";
			req.form.action = action;
			req.form.enctype = "multipart/form-data";
			req.form.method = "POST";
			req.form.target = name;
			req.parent.appendChild(req.form);
			req.form.submit();
		} else {
			req.worker.src = action;
		}
		this._reqsX.push(req);
	}
};
_thirdparty_core.prototype.silentXOnReady = function(req, type) {
	if (req.done) return;
	if (type == "readystate") {
		if ((req.worker.readyState != "interactive") && (req.worker.readyState != "complete")) return;
	}
	if (req.statusUrl) {
		if (req.status) return;
		req.status = true;
		var rstat = this.reqXBuild(this);
		rstat.url = req.statusUrl + (req.statusUrl.indexOf("?") == -1 ? "?" : "&") + "thirdparty-core-xcb=thirdparty_core.silentXOnStat&thirdparty-core-xkey=" + req.key;
		rstat.pars.req = req;
		this.silentX(rstat);
		this._reqsX.push(rstat);
	} else {
		req.done = true;
		if (typeof req.statusCb == "function") {
			try {req.statusCb(req);} catch(e) {this.console(__name_script + " > silentXOnReady(): Ошибка выполнения callback-функции [Сообщение: \"" + e.message + "\, (" + e.name + "/" + e.type + ")]");}
		}
	}
	req.worker.onload = null;
	req.worker.onreadystatechange = null;
	req.worker.parentNode.parentNode.removeChild(req.worker.parentNode);
};
_thirdparty_core.prototype.silentXOnStat = function(resp, key) {
	for (var c in this._reqsX) {
		if (!this._reqsX.hasOwnProperty(c)) continue;
		if (this._reqsX[c].done) continue;
		if (typeof this._reqsX[c].pars.req != "undefined" && this._reqsX[c].pars.req.key == key) {
			this._reqsX[c].done = true;
			this._reqsX[c].pars.req.done = true;
			if (typeof this._reqsX[c].pars.req.statusCb == "function") {
				if (this._reqsX[c].pars.req.json) {
					try {
						this._reqsX[c].pars.req.resp = eval("(" + resp + ");");
					} catch(e) {
						this.console(__name_script + " > silentXOnStat(): Ошибка парсинга JSON-ответа [Сообщение: \"" + e.message + "\, (" + e.name + "/" + e.type + ")]");
						this._reqsX[c].pars.req.resp = {res: false, msg: "Ошибка парсинга JSON-ответа.", data: resp};
					}
				} else {
					this._reqsX[c].pars.req.resp = {res: true, msg: "", data: resp};
				}
				try {this._reqsX[c].pars.req.statusCb(this._reqsX[c].pars.req);} catch(e) {
					this.console(__name_script + " > silentXOnStat(): Ошибка выполнения callback-функции [Сообщение: \"" + e.message + "\, (" + e.name + "/" + e.type + ")]");
				}
			}
			this._reqsX[c].worker.parentNode.removeChild(this._reqsX[c].worker);
			return;
		}
	}
	this.console(__name_script + " > silentXOnStat: Предупреждение, получен статус незарегистрированной операции [key: " + key + "]. Содержимое ответа: ");
	this.console(resp);
};
_thirdparty_core.prototype.toElement = function(html) {
	(function(){
        var div = document.createElement("div");
        return function(html){
            div.innerHTML = html;
            var el = div.firstChild;
            return div.removeChild(el);
        };
    })(html);
};
_thirdparty_core.prototype.urlParse = function(url) {
	if (typeof url == "undefined") url = document.location.href;
	var a = document.createElement('A');
	a.href = url;
	return {
		source: a.href,
		protocol: a.protocol.replace(':',''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function(){
			var ret = {},
			seg = a.search.replace(/^\?/,'').split('&'),
			len = seg.length, i = 0, s;
			for (; i < len; i++) {
				if (!seg[i]) continue;
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
		hash: a.hash.replace('#',''),
		path: a.pathname.replace(/^([^\/])/,'/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
		segments: a.pathname.replace(/^\//,'').split('/')
	};
};
_thirdparty_core.prototype.validEmail = function(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
};
_thirdparty_core.prototype.xmlHttpGet = function() {
	var r;
	try {
		r = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			r = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
			r = false;
		}
	}
	if (!r && (typeof XMLHttpRequest != "undefined"))
		r = new XMLHttpRequest();
	else {
		this.console(__name_script + " > Невозможно создать объект [XMLHttpRequest]");
		r = false;
	}
	return r;
};
if (Function.prototype.bind == null) {
    Function.prototype.bind = (function (slice){
        // (C) WebReflection - Mit Style License
        function bind(context) {
            var self = this; // "trapped" function reference
            // only if there is more than an argument
            // we are interested into more complex operations
            // this will speed up common bind creation
            // avoiding useless slices over arguments
            if (1 < arguments.length) {
                // extra arguments to send by default
                var $arguments = slice.call(arguments, 1);
                return function () {
                    return self.apply(
                        context,
                        // thanks @kangax for this suggestion
                        arguments.length ?
                            // concat arguments with those received
                            $arguments.concat(slice.call(arguments)) :
                            // send just arguments, no concat, no slice
                            $arguments
                    );
                };
            }
            // optimized callback
            return function () {
                // speed up when function is called without arguments
                return arguments.length ? self.apply(context, arguments) : self.call(context);
            };
        }
        // the named function
        return bind;
    }(Array.prototype.slice));
}

return new _thirdparty_core();

}))();

}