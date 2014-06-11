/*
 * Плагин WWF Teaser
 * Версия: 1.0.6 (21.03.2013 12:48 +0400)
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
		script.src = "/thirdparty-v2/_core/core.js?ver=4";
		document.getElementsByTagName("head")[0].appendChild(script);
	})(thirdparty_shared);
}

(function(){
var __name_script	=	"wwf.js";
var __name_this		=	"wwf";

//защита от двойной инициализации
if (thirdparty_shared.core._loaded) {
	if (thirdparty_shared.core._obj.pluginGet(__name_this)) return;
} else {
	for (var c in thirdparty_shared.waiting) {
		if (!thirdparty_shared.waiting.hasOwnProperty(c)) continue;
		if (thirdparty_shared.waiting[c].obj && thirdparty_shared.waiting[c].obj._name && (thirdparty_shared.waiting[c].obj._name == __name_this)) return;
	}
}

var _wwf = function() {
	this._inited		=	false;
	this._fields		=	{
		fname:		{},
		lname:		{},
		mname:		{},
		city:		{},
		email:		{},
		captcha:	{}
	};
	this._formServer	=	"apps.metronews.ru";
	this._formSendUrl	=	"http://apps.metronews.ru/wwf/index.php";
	this._formStatUrl	=	"http://apps.metronews.ru/wwf/status.php";
	this._listItems		=	[];
	this._name			=	__name_this;
	this._teaserURL		=	"http://www.wwf.ru/php/eh13cnt_server.php?partner=metro";
	this._teaserCounts	=	[];
	this._queryCntList	=	0;
	this._queryCntMax	=	45;
	this._queryTm		=	20000;
	this._reqsX			=	[];
	this._urlsParsed	=	false;
	this.elBlocker		=	null;
	this.elCaptcha		=	null;
	this.elCss			=	null;
	this.elFieldsWrap	=	null;
	this.elForm			=	null;
	this.elFormCount	=	null;
	this.elFormList		=	null;
	this.elMsgSuccess	=	null;
	this.elTeaser		=	null;
	this.elTeaserCnt	=	null;
	this.elWait			=	null;
	this.plCore			=	null;
	this.cbItemNext		=	this.actionItemNext.bind(this);
	this.cbOnItemNext	=	this.onActionItemNext.bind(this);
	this.cbTeaserCount	=	this.actionTeaserCount.bind(this);
};
_wwf.prototype._init = function(last) {
	if (!this._urlsParsed) {
		this._urlsParsed = true;
		var d = this.plCore._url.host;
		var p = d.split(".");
		var ls = p[p.length - 1].toLowerCase();
		if (ls == "loc") {
			this._formServer = this._formServer.replace(".ru", "." + ls);
			this._formSendUrl = this._formSendUrl.replace(".ru", "." + ls);
			this._formStatUrl = this._formStatUrl.replace(".ru", "." + ls);
		}
	}
	if (!this.elCss) {
		this.elCss = document.createElement("LINK");
		this.elCss.type = "text/css";
		this.elCss.rel = "stylesheet";
		this.elCss.href = "/thirdparty-v2/_plugins/" + this._name + "/" + this._name + ".css?ver=2";
		this.elCss.media = "screen";
		document.getElementsByTagName("head")[0].appendChild(this.elCss);
	}
	if (!this.elForm) {
		if (!document.getElementById("thirdparty-" + this._name + "-form")) {
			if (last) this.plCore.console(__name_script + " > " + this._name +"._init(): Частичная инициализация, Form отключен [соответствующий DOM не найден].");
		} else this.elForm = document.getElementById("thirdparty-" + this._name + "-form");
	}
	if (!this.elTeaser) {
		if (!document.getElementById("thirdparty-" + this._name + "-teaser")) {
			if (last) this.plCore.console(__name_script + " > " + this._name +"._init(): Частичная инициализация, Teaser отключен [соответствующий DOM не найден].");
		} else this.elTeaser = document.getElementById("thirdparty-" + this._name + "-teaser");
	}
	if (last) this._inited = true;
	else this._inited = (this.elForm && this.elTeaser) ? true : false;
	if (this.elForm) {
		if (typeof this._fields.fname.dom == "undefined") {
			this.formDOM();
			this.actionFormCaptcha();
			this.actionListInitial();
		}
	}
	if (this.elTeaser) {
		if (!this.elTeaserCnt) {
			this.elTeaserCnt = document.getElementById("thirdparty-" + this._name + "-teaser-count");
			this.actionTeaserCount();
		}
	}
	return this._inited;
};
_wwf.prototype.actionFormCaptcha = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.url = this._formSendUrl + "?action=captcha";
	req.statusUrl = this._formStatUrl;
	req.statusCb = this.onActionFormCaptcha.bind(this);
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_wwf.prototype.actionFormSubmit = function() {
	if (!this.formCheck()) return;
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.url = this._formSendUrl;
	req.statusUrl = this._formStatUrl;
	req.statusCb = this.onActionFormSubmit.bind(this);
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c)) continue;
		req.data[this._name + "-form-" + c] = this._fields[c].dom;
	}
	this._reqsX.push(req);
	this.plCore.silentX(req);
	this.formWait();
};
_wwf.prototype.actionItemNext = function() {
	if (!this._listItems.length) return;
	this._queryCntList++;
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.url = this._formSendUrl + "?action=item";
	req.statusUrl = this._formStatUrl;
	req.statusCb = this.cbOnItemNext;
	req.data[this._name + "-form-itemid"] = this._listItems[this._listItems.length - 1].id;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_wwf.prototype.actionListInitial = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.url = this._formSendUrl + "?action=list";
	req.statusUrl = this._formStatUrl;
	req.statusCb = this.onActionListInitial.bind(this);
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_wwf.prototype.actionTeaserCount = function() {
	if (this.elTeaserCnt === true) return;
	if (!this.elTeaserCnt) {
		this.elTeaserCnt = true;
		this.plCore.console(__name_script + " > " + this._name +".actionTeaserCount(): Невозможно получить значение счетчика, элемент не найден [thirdparty-" + this._name + "-teaser-count]");
		return;
	}
	var req = this.plCore.reqXBuild(this);
	req.url = this._teaserURL + "&callback=thirdparty_core.pluginGet(\"wwf\").onActionTeaserCount";
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_wwf.prototype.formCheck = function() {
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c)) continue;
		var v = this._fields[c].defaultValue.replace(this._fields[c].dom.value, "");
		var n = (this._fields[c].defaultValue.indexOf("*") == -1 ? false : true);
		if (n && ((v == "") || (v == "*"))) {
			alert("Заполните поле \"" + this._fields[c].defaultValue + "\"!");
			this._fields[c].dom.focus();
			return false;
		}
		if (!n && ((v == "") || (v == "*")))
			this._fields[c].dom.value = "";
		switch (c) {
			case "email":
				if (!this.plCore.validEmail(this._fields[c].dom.value)) {
					alert("Вы ошиблись при вводе E-mail!");
					this._fields[c].dom.focus();
					return false;
				}
				break;
			default:
				break;
		}
	}
	return true;
};
_wwf.prototype.formCountSet = function() {
	if (!this.elFormCount) return;
	if (!this._teaserCounts.length) return;
	this.elFormCount.innerHTML = "Нас поддержали " + this._teaserCounts[this._teaserCounts.length - 1] + " человек";
	this.elFormCount.style.display = "block";
};
_wwf.prototype.formDOM = function() {
	//сообщение об успешной отправке
	this.elMsgSuccess = document.createElement("DIV");
	this.elMsgSuccess.className = "msg-success"
	this.elMsgSuccess.style.display = "none";
	this.elForm.appendChild(this.elMsgSuccess);
	var el = document.createElement("H1");
	el.innerHTML = "Спасибо вам большое за помощь!";
	this.elMsgSuccess.appendChild(el);
	el = document.createElement("H2");
	el.innerHTML = "На ваш адрес выслано письмо-подтверждение. Пожалуйста, кликните на ссылку в этом письме.";
	this.elMsgSuccess.appendChild(el);
	el = document.createElement("P");
	el.innerHTML = "Подробности о конкурсе среди участников вы можете узнать ";
	this.elMsgSuccess.appendChild(el);
	var el1 = document.createElement("A");
	el1.href = "http://www.wwf.ru/eh2013/vote";
	el1.innerHTML = "на сайте WWF России";
	el.appendChild(el1);
	el = document.createElement("P");
	el.innerHTML = "Если вы хотите зарегистрировать другого участника, ";
	this.elMsgSuccess.appendChild(el);
	var el1 = document.createElement("DIV");
	el1.className = "pseudo-link";
	el1.innerHTML = "нажмите сюда";
	this.plCore.eventAdd(el1, "click", this.onClickFormRenew.bind(this));
	el.appendChild(el1);
	//главная форма
	this.elFieldsWrap = document.createElement("DIV");
	this.elFieldsWrap.className = "wrap";
	this.elForm.appendChild(this.elFieldsWrap);
	//блокер
	el = document.createElement("DIV");
	el.className = "rel";
	this.elFieldsWrap.appendChild(el);
	this.elBlocker = document.createElement("DIV");
	this.elBlocker.className = "blocker";
	this.elBlocker.style.display = "none";
	el.appendChild(this.elBlocker);
	// ------ первая колонка
	el = document.createElement("DIV");
	el.className = "flds-col";
	this.elFieldsWrap.appendChild(el);
	//фамилия
	this._fields.lname.dom = document.createElement("INPUT");
	this._fields.lname.dom.type = "text";
	this._fields.lname.dom.className = "inp-field";
	this._fields.lname.dom.value = "Фамилия*";
	this._fields.lname.defaultValue = "Фамилия*";
	this._fields.lname.onfocus = this.onFormInputFocus.bind(this, this._fields.lname);
	this._fields.lname.onblur = this.onFormInputBlur.bind(this, this._fields.lname);
	this.plCore.eventAdd(this._fields.lname.dom, "focus", this._fields.lname.onfocus);
	this.plCore.eventAdd(this._fields.lname.dom, "blur", this._fields.lname.onblur);
	el.appendChild(this._fields.lname.dom);
	//имя
	this._fields.fname.dom = document.createElement("INPUT");
	this._fields.fname.dom.type = "text";
	this._fields.fname.dom.className = "inp-field";
	this._fields.fname.dom.value = "Имя*";
	this._fields.fname.defaultValue = "Имя*";
	this._fields.fname.onfocus = this.onFormInputFocus.bind(this, this._fields.fname);
	this._fields.fname.onblur = this.onFormInputBlur.bind(this, this._fields.fname);
	this.plCore.eventAdd(this._fields.fname.dom, "focus", this._fields.fname.onfocus);
	this.plCore.eventAdd(this._fields.fname.dom, "blur", this._fields.fname.onblur);
	el.appendChild(this._fields.fname.dom);
	//отчество
	this._fields.mname.dom = document.createElement("INPUT");
	this._fields.mname.dom.type = "text";
	this._fields.mname.dom.className = "inp-field";
	this._fields.mname.dom.value = "Отчество";
	this._fields.mname.defaultValue = "Отчество";
	this._fields.mname.onfocus = this.onFormInputFocus.bind(this, this._fields.mname);
	this._fields.mname.onblur = this.onFormInputBlur.bind(this, this._fields.mname);
	this.plCore.eventAdd(this._fields.mname.dom, "focus", this._fields.mname.onfocus);
	this.plCore.eventAdd(this._fields.mname.dom, "blur", this._fields.mname.onblur);
	el.appendChild(this._fields.mname.dom);
	// ------ вторая колонка
	el = document.createElement("DIV");
	el.className = "flds-col";
	this.elFieldsWrap.appendChild(el);
	//Откуда вы (город)
	this._fields.city.dom = document.createElement("INPUT");
	this._fields.city.dom.type = "text";
	this._fields.city.dom.className = "inp-field";
	this._fields.city.dom.value = "Откуда вы (город)";
	this._fields.city.defaultValue = "Откуда вы (город)";
	this._fields.city.onfocus = this.onFormInputFocus.bind(this, this._fields.city);
	this._fields.city.onblur = this.onFormInputBlur.bind(this, this._fields.city);
	this.plCore.eventAdd(this._fields.city.dom, "focus", this._fields.city.onfocus);
	this.plCore.eventAdd(this._fields.city.dom, "blur", this._fields.city.onblur);
	el.appendChild(this._fields.city.dom);
	//Адрес электронной почты
	this._fields.email.dom = document.createElement("INPUT");
	this._fields.email.dom.type = "text";
	this._fields.email.dom.className = "inp-field";
	this._fields.email.dom.value = "Адрес электронной почты*";
	this._fields.email.defaultValue = "Адрес электронной почты*";
	this._fields.email.onfocus = this.onFormInputFocus.bind(this, this._fields.email);
	this._fields.email.onblur = this.onFormInputBlur.bind(this, this._fields.email);
	this.plCore.eventAdd(this._fields.email.dom, "focus", this._fields.email.onfocus);
	this.plCore.eventAdd(this._fields.email.dom, "blur", this._fields.email.onblur);
	el.appendChild(this._fields.email.dom);
	//Число на картинке
	this._fields.captcha.dom = document.createElement("INPUT");
	this._fields.captcha.dom.type = "text";
	this._fields.captcha.dom.className = "inp-field";
	this._fields.captcha.dom.value = "Число на картинке*";
	this._fields.captcha.defaultValue = "Число на картинке*";
	this._fields.captcha.onfocus = this.onFormInputFocus.bind(this, this._fields.captcha);
	this._fields.captcha.onblur = this.onFormInputBlur.bind(this, this._fields.captcha);
	this.plCore.eventAdd(this._fields.captcha.dom, "focus", this._fields.captcha.onfocus);
	this.plCore.eventAdd(this._fields.captcha.dom, "blur", this._fields.captcha.onblur);
	el.appendChild(this._fields.captcha.dom);
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c)) continue;
		this._fields[c].dom.className += " empty";
	}
	// ------ третья колонка
	el = document.createElement("DIV");
	el.className = "flds-col";
	this.elFieldsWrap.appendChild(el);
	//каптча
	this.elCaptcha = document.createElement("IMG");
	this.elCaptcha.className = "captcha";
	this.elCaptcha.src = "data:image/png;base64," + this.plCore._imgs.dot;
	el.appendChild(this.elCaptcha);
	//кнопка отправки
	this.elBtnSend = document.createElement("DIV");
	this.elBtnSend.className = "btn-send";
	this.plCore.eventAdd(this.elBtnSend, "click", this.onClickFormBtn.bind(this));
	el.appendChild(this.elBtnSend);
	//гифка загрузки
	this.elWait = document.createElement("DIV");
	this.elWait.className = "waiter";
	this.elWait.style.display = "none";
	el.appendChild(this.elWait);
	el = document.createElement("IMG");
	el.src = "data:image/gif;base64," + this.plCore._imgs.fbwait;
	this.elWait.appendChild(el);
	//список
	this.elFormList = document.createElement("DIV");
	this.elFormList.className = "list";
	this.elForm.appendChild(this.elFormList);
	this.elFormCount = document.createElement("DIV");
	this.elFormCount.className = "count";
	this.elFormCount.style.display = "none";
	this.elFormList.appendChild(this.elFormCount);
	this.formCountSet();
};
_wwf.prototype.formListInsertNext = function(i) {
	for (var c in this._listItems) {
		if (!this._listItems.hasOwnProperty(c)) continue;
		if (this._listItems[c].id == i.id) return;
	}
	this._listItems.push(i);
	var el = document.createElement("DIV");
	el.className = "item";
	el.style.display = "none";
	el.innerHTML = i.name;
	this.elFormList.insertBefore(el, this.elFormList.childNodes[1]);
	$(el).slideDown(200);
};
_wwf.prototype.formWait = function(w) {
	if (typeof w != "boolean") w = true;
	if (w) {
		this.elBtnSend.style.display = "none";
		this.elWait.style.display = "block";
		this.elBlocker.style.display = "block";
	} else {
		this.elWait.style.display = "none";
		this.elBtnSend.style.display = "block";
		this.elBlocker.style.display = "none";
	}
};
_wwf.prototype.onActionFormCaptcha = function(res, resp, key) {
	this.elCaptcha.src = "http://" + this._formServer + resp + "?rand=" + this.plCore.seed();
};
_wwf.prototype.onActionFormSubmit = function(res, resp, key) {
	this.formWait(false);
	var r;
	try {
		r = eval("(" + resp + ");");
	} catch(e) {
		this.plCore.console(resp);
		alert("Ошибка: сервер вернул некорректный ответ!");
		return;
	}
	if (r.msg) {
		alert(r.msg);
	}
	if (r.res) {
		if (r.id) {
			var i = {id: r.id, name: r.name};
			this.formListInsertNext(i);
			if (this._teaserCounts.length) {
				this._teaserCounts[this._teaserCounts.length - 1]++;
				this.formCountSet();
			}
			this.elFieldsWrap.style.display = "none";
			this.elMsgSuccess.style.display = "block";
		}
	}
};
_wwf.prototype.onActionItemNext = function(res, resp, key) {
	var r;
	try {
		r = eval("(" + resp + ");");
	} catch(e) {
		this.plCore.console(resp);
		alert("Ошибка: сервер вернул некорректный ответ!");
		return;
	}
	if (r.msg) {
		alert(r.msg);
	}
	if (r.res) {
		if (r.id) {
			var i = {id: r.id, name: r.name};
			this.formListInsertNext(i);
		}
		if (this._queryCntList < this._queryCntMax)
			window.setTimeout(this.cbItemNext, this._queryTm);
	}
};
_wwf.prototype.onActionListInitial = function(res, resp, key) {
	this.formCountSet();
	var r;
	try {
		r = eval("(" + resp + ");");
	} catch(e) {
		this.plCore.console(resp);
		alert("Ошибка: сервер вернул некорректный ответ!");
		return;
	}
	if (r.msg) {
		alert(r.msg);
	}
	if (r.res) {
		for (var c in r.names) {
			if (!r.names.hasOwnProperty(c)) continue;
			this._listItems.unshift(r.names[c]);
			var el = document.createElement("DIV");
			el.className = "item";
			el.style.display = "none";
			el.innerHTML = r.names[c].name;
			this.elFormList.appendChild(el);
			$(el).slideDown(200);
		}
		window.setTimeout(this.cbItemNext, this._queryTm);
	}
};
_wwf.prototype.onActionTeaserCount = function(c, key) {
	if (typeof key != "undefined") {
		var req = this.plCore.reqXFetch(key);
		if (req) {
			req.done = true;
			req.worker.parentNode.removeChild(req.worker);
		}
	}
	if (typeof this.elTeaserCnt != "object") {
		this.plCore.console(__name_script + " > " + this._name +".onActionTeaserCount(): Невозможно установить значение счетчика, элемент-контейнер не инициализирован [elTeaserCnt]");
		return;
	}
	var cnt = parseInt(c, 10);
	if (cnt == "NaN" || isNaN(cnt)) {
		this.plCore.console(__name_script + " > " + this._name +".onActionTeaserCount(): Удаленный сервер вернул некоРректное целое значение [" + c + "]");
		return;
	}
	this._teaserCounts.push(cnt);
	var th = (cnt - parseInt(cnt/1000, 10) * 1000);
	if (th < 100) th = "0" + th;
	this.elTeaserCnt.innerHTML = (parseInt(cnt/1000, 10)) + " " + th;
	this.formCountSet();
	if (this._teaserCounts.length < this._queryCntMax)
		window.setTimeout(this.cbTeaserCount, this._queryTm);
};
_wwf.prototype.onClickFormBtn = function() {
	if (!this.formCheck()) return;
	this.actionFormSubmit();
};
_wwf.prototype.onClickFormRenew = function() {
	this.elCaptcha.src = "data:image/png;base64," + this.plCore._imgs.dot;
	this.actionFormCaptcha();
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c)) continue;
		this._fields[c].dom.value = this._fields[c].defaultValue;
		this._fields[c].dom.className = "inp-field empty";
	}
	this.elFieldsWrap.style.display = "block";
	this.elMsgSuccess.style.display = "none";
};
_wwf.prototype.onFormInputBlur = function(i) {
	if (i.dom.value == "") {
		i.dom.value = i.defaultValue;
		i.dom.className = "inp-field empty";
	}
	else i.dom.className = "inp-field filled";
};
_wwf.prototype.onFormInputFocus = function(i) {
	if (i.dom.value == i.defaultValue) i.dom.value = "";
};
_wwf.prototype.setCount = function(c) {
	this.onActionTeaserCount(c);
};
if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginReg(new _wwf(), true);
} else {
	var w = {};
	w.init = true;
	w.obj = new _wwf();
	thirdparty_shared.waiting.push(w);
}

})();