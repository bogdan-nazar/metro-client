//--------------- PopUp Object Prototype -------------------
/**
* Версия: 1.0.5 (18.06.2013 12:04 +0400)
* Developer: Bogdan Nazar
* Copyright (c) 2005-2013 Metro
*
* Создание объекта всплывающего модального окна
* windowed boolean - показать рамку по умолчанию
* container elemDOM/name/string - id/имя контейнера/строка-содержание
* onclose object(function) - функция выполняемая после закрытия окна,
*			если функция возвращает false, то закрытие окна отменняется
*
* пример вызова: var myPuId = (this.plCore.pluginGet("pu")).add({
* 	windowed:false,
* 	content:"myPopupDivId",
* 	onclose:(function(){alert("ok");return true;})
*	showcloser:false,
* });
*
* @param object pars
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

var __name_lib = "lib";
var __name_script = "pu.js";
var __name_this = "pu";

var _pu = function() {
	this._borderSize=	24;
	this._initErr	=	false
	this._inited	=	false;
	this._items		=	[];
	this._name		=	__name_this;
	this._visible	=	[];
	this.elBase		=	null;
	this.elBox		=	null;
	this.elCss		=	null;
	this.elMama		=	null;
	this.elPage		= 	null;
	this.elShade	=	null;
	this.elWin		=	null;
	this.elWin_		=	null;
	this.plCore		=	null;
};
//функция _init выполняется ядром в onPreload
//если плагин регистрирует себя в ядре с дополнительным
//параметром bool init = true
_pu.prototype._init = function(last) {
	if (this._inited) return true;
	if (typeof last != "boolean") last = false;
	if (!this.elPage)
		this.elPage = document.createElement("DIV");
	if (document.body) {
		document.body.appendChild(this.elPage);
	} else {
		if (last) {
			this.plCore.console(__name_script + " > " + this._name + "._init(): WTF???");
			this._initErr = true;
			this._inited = true;
			return true;
		}
		return false;
	}
	if (!this.elCss) {
		var src = this.plCore.baseDir() + "_plugins/" + this._name + "/" + this._name + ".css?ver=1.0.3";
		var c = this.plCore.resourceLoad("css", src);
		if (c) {
 			this.elCss = c.el;
		} else {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Ошибка загрузки CSS стилей [" + src + "]");
			return true;
		}
	}
	//затенение и основной контейнер
	this.elMama = document.createElement("DIV");
	this.elMama.style.display = "none";
	this.elPage.appendChild(this.elMama);
	this.elShade = document.createElement("DIV");
	this.elShade.className = "pu-shade";
	this.elShade.style.display = "none";
	this.elPage.appendChild(this.elShade);
	this.elBase = document.createElement("DIV");
	this.elBase.className = "pu";
	this.elBase.style.display = "none";
	this.elPage.appendChild(this.elBase);
	var el = document.createElement("DIV");
	el.className = "inner";
	this.elBase.appendChild(el);
	//контейнер для необрамленных поп-апов
	this.elBox = document.createElement("DIV");
	this.elBox.className = "box";
	this.elBox.style.display = "none";
	el.appendChild(this.elBox);
	//контейнер для поп-апов в виде стилизированного окна
	this.elWin_ = document.createElement("DIV");
	this.elWin_.className = "win";
	this.elWin_.style.display = "none";
	el.appendChild(this.elWin_);
	this.elWin = document.createElement("DIV");
	this.elWin.className = "rel";
	this.elWin_.appendChild(this.elWin);
	//левый верхний угол
	el = document.createElement("DIV");
	el.className = "c-tl";
	this.elWin.appendChild(el);
	//правый верхний угол
	el = document.createElement("DIV");
	el.className = "c-tr";
	this.elWin.appendChild(el);
	//правый нижний угол
	el = document.createElement("DIV");
	el.className = "c-br";
	this.elWin.appendChild(el);
	//левый нижний угол
	el = document.createElement("DIV");
	el.className = "c-bl";
	this.elWin.appendChild(el);
	//верхняя граница
	el = document.createElement("DIV");
	el.className = "l-t";
	this.elWin.appendChild(el);
	//правая граница
	el = document.createElement("DIV");
	el.className = "l-r";
	this.elWin.appendChild(el);
	//нижняя граница
	el = document.createElement("DIV");
	el.className = "l-b";
	this.elWin.appendChild(el);
	//левая граница
	el = document.createElement("DIV");
	el.className = "l-l";
	this.elWin.appendChild(el);
	this._inited = true;
	return true;
};
_pu.prototype.add = function(params) {
	if (!this._inited) return -1;
	var item = {
		closer:null,
		closers:[],
		content:null,
		onclose:[],
		owner:null,
		parent:null,
		showcloser:true,
		windowed:true
	}
	if ((typeof params != "object") || (typeof params === null)) return -1;
	//проверка контента
	if (typeof params.content != "undefined" && (params.content)) {
		if (typeof params.content == "string") {
			if (!document.getElementById(params.content)) {
				item.content = document.createElement("DIV");
				item.content.innerHTML = params.content;
				this.elMama.appendChild(item.content);
				item.parent = this.elMama;
			} else {
				item.content = document.getElementById(params.content);
				if (item.content.parentNode) item.parent = item.content.parentNode;
				else item.parent = this.elMama;
			}
		} else {
			if (typeof params.content != "object") return -1;
			else {
				item.content = params.content;
				if (item.content.parentNode) item.parent = item.content.parentNode;
				else item.parent = this.elMama;
			}
		}
	}
	//проверка владельца
	if ((typeof params.owner == "object") && (params.owner))
		item.owner = params.owner;
	else
		item.owner = this;
	//проверка клоузеров
	if (typeof params.closers != "undefined") {
		if (typeof params.closers == "object") {
			if (params.closers instanceof Array) {
				var c;
				for (var i in params.closers) {
					if (!params.closers.hasOwnProperty(i)) continue;
					c = params.closers[i];
					if (typeof c == "string") {
						if (document.getElementById(c)) item.closers.push(document.getElementById(c));
					} else {
						if (typeof c == "object") item.closers.push(c);
					}
				}
			} else item.closers.push(params.closers);
		} else {
			if (typeof params.closers == "string") {
				if (document.getElementById(params.closers)) item.closers.push(document.getElementById(params.closers));
			}
		}
	}
	//проверка функции onclose
	if (typeof params.onclose != "undefined") {
		if (typeof params.onclose == "object") {
			if (params.onclose instanceof Array) {
				var c;
				for (var i in params.onclose) {
					if (!params.hasOwnProperty(i)) return;
					c = params.onclose[i];
					if (c instanceof Function) {
						item.onclose.push(c);
					} else {
						if (typeof c == "string") item.onclose.push((function(code){
							eval(code + ";");
						}).bind(item.owner, c));
					}
				}
			}
		} else {
			if (params.onclose instanceof Function) {
				item.onclose.push(params.onclose);
			}
			else {
				if (typeof params.onclose == "string") item.onclose.push((function(code){
					eval(code + ";");
				}).bind(item.owner, params.onclose));
			}

		}
	}
	//проверка кнопки закрытия
	if (typeof params.showcloser != "undefined") {
		if (typeof params.showcloser == "boolean")
			item.showcloser = params.showcloser;
	}
	//проверка опции обрамляющего окна
	if (typeof params.windowed != "undefined") {
		if (typeof params.windowed == "boolean")
			item.windowed = params.windowed;
	}
	this._items.push(item);
	var id = this._items.length - 1;
	item.funcOnClose = this.hide.bind(this, id);
	for (var i in item.closers) {
		if (!item.closers.hasOwnProperty(i)) continue;
		this.plCore.eventAdd(item.closers[i], "click", item.funcOnClose);
	}
	if (item.showcloser) {
		item.closer = document.createElement("DIV");
		item.closer.className = "close";
		var el = document.createElement("DIV");
		el.className = "btn";
		this.plCore.eventAdd(el, "click", item.funcOnClose);
		item.closer.appendChild(el);
	}
	return id;
};
_pu.prototype.content = function(id, content, closers) {
	//проверяем аргументы
	if (typeof this._items[id] == "undefined") return false;
	if (typeof content == "undefined") return false;
	if (!content) return false;
	var item = this._items[id];
	//отвязываем предыдущий контент и клоузеры
	if (item.content) {
		if (item.parent) item.parent.appendChild(item.content);
		if (item.closers.length) {
			for (var i in item.closers) {
				if (!closers.hasOwnProperty(i)) continue;
				this.plCore.eventRemove(item.closers[i], "click", item.funcOnClose);
			}
		}
		item.closers = [];
	}
	//привязываем новый контент
	if (typeof content == "string") {
		if (!document.getElementById(content)) {
			item.content = document.createElement("DIV");
			item.content.innerHTML = content;
			this.elMama.appendChild(item.content);
			item.parent = this.elMama;
		} else {
			item.content = document.getElementById(content);
			if (item.content.parentNode) item.parent = item.content.parentNode;
			else item.parent = this.elMama;
		}
	} else {
		if (typeof content != "object") return false;
		else {
			item.content = content;
			if (item.content.parentNode) item.parent = item.content.parentNode;
			else item.parent = this.elMama;
		}
	}
	if (typeof closers != "undefined") {
		if (typeof closers == "object") {
			if (closers instanceof Array) {
				var c;
				for (var i in closers) {
					if (!closers.hasOwnProperty(i)) continue;
					c = closers[i];
					if (typeof c == "string") {
						if (document.getElementById(c)) item.closers.push(document.getElementById(c));
					} else {
						if (typeof c == "object") item.closers.push(c);
					}
				}
			} else item.closers.push(closers);
		} else {
			if (typeof closers == "string") {
				if (document.getElementById(closers)) item.closers.push(document.getElementById(closers));
			}
		}
		for (var i in item.closers) {
			if (!item.closers.hasOwnProperty(i)) continue;
			this.plCore.eventAdd(item.closers[i], "click", item.funcOnClose);
		}
	}
	return true;
};
_pu.prototype.hide = function(id) {
	var f = false;
	for (i in this._visible) {
		if (!this._visible.hasOwnProperty(i)) continue;
		if (this._visible[i] == id) {
			f = parseInt(i, 10);
			break;
		}
	}
	if (f === false) return;
	var item = this._items[this._visible[f]];
	var res = true;
	var r;
	for (var i in item.onclose) {
		if (!item.onclose.hasOwnProperty(i)) continue;
		r = false;
		try {
			r = item.onclose[i]();
		} catch(e) {
			this.plCore.console(__name_script + " > Ошибка выполнения callback-функции [" + __name_popup + ".hide(), itemId: " + i + "]. Javascript Runtime Error: " + e.message + " [" + e.name + "/" + e.type + "]");
		}
		if (typeof r == "boolean") res = res && r;
	}
	if (!res) return;
	if (item.windowed)
		this.elWin_.style.display = "none";
	else
		this.elBox.style.display = "none";
	item.parent.appendChild(item.content);
	if (item.showcloser && item.closer)
		item.closer.parentNode.removeChild(item.closer);
	this._visible.splice(f, 1);
	var len = this._visible.length;
	if (len) {
		item = this._items[this._visible[len - 1]];
		if (item.windowed) {
			this.elWin_.style.display = "table-cell";
			this.elWin.appendChild(item.content);
		} else {
			this.elBox.style.display = "table-cell";
			this.elBox.appendChild(item.content)
		}
		if (item.showcloser && item.closer)
			item.content.parentNode.insertBefore(item.closer, item.content.parentNode.childNodes[0]);
	} else {
		this.elShade.style.display = "none";
		this.elBase.style.display = "none";
	}
};
_pu.prototype.show = function(id) {
	if (typeof this._items[id] == "undefined") {
		this.plCore.console(__name_script + " > Невозможно показать всплывающее окно: объект не найден [" + __name_popup + ".show(), itemId: " + id + "]");
		return;
	}
	if (!this._items[id].content) {
		this.plCore.console(__name_script + " > Невозможно показать всплывающее окно: контент не определен [" + __name_popup + ".show(), itemId: " + id + "]");
		return;
	}
	for (i in this._visible) {
		if (!this._visible.hasOwnProperty(i)) continue;
		if (this._visible[i] == id) return;
	}
	var len = this._visible.length;
	var item;
	if (len) {
		item = this._items[this._visible[len - 1]];
		if (item.windowed)
			this.elWin_.style.display = "none";
		else
			this.elBox.style.display = "none";
		item.parent.appendChild(item.content);
		if (item.showcloser && item.closer)
			item.closer.parentNode.removeChild(item.closer);
	} else {
		this.elShade.style.display = "block";
		this.elBase.style.display = "block";
	}
	item = this._items[id];
	if (item.windowed) {
		this.elWin_.style.display = "table-cell";
		this.elWin.appendChild(item.content);
	} else {
		this.elBox.style.display = "table-cell";
		this.elBox.appendChild(item.content)
	}
	if (item.showcloser && item.closer)
		item.content.parentNode.insertBefore(item.closer, item.content.parentNode.childNodes[0]);
	this._visible.push(id);
};

if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginReg(new _pu(), true);
} else {
	var w = {};
	w.init = true;
	w.obj = new _pu();
	thirdparty_shared.waiting.push(w);
}

})();