/*
 * Плагин Metro Photo World
 * Версия: 1.0.79 (16.05.2013 11:23 +0400)
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

var __name_galleria	=	"galleria";
var __name_lib		=	"lib";
var __name_pu		=	"pu";
var __name_script	=	"photo-vzyatka.js";
var __name_this		=	"photo";

//защита от двойной инициализации
if (thirdparty_shared.core._loaded) {
	if (thirdparty_shared.core._obj.pluginGet(__name_this)) return;
} else {
	for (var c in thirdparty_shared.waiting) {
		if (!thirdparty_shared.waiting.hasOwnProperty(c)) continue;
		if (thirdparty_shared.waiting[c].obj && thirdparty_shared.waiting[c].obj._name && (thirdparty_shared.waiting[c].obj._name == __name_this)) return;
	}
}

var _photo_vzyatka = function() {
	this._appRemoteSrv		=	"apps.metronews.ru";
	this._appRemoteUri		=	"/pool/" + __name_this + "/index.php";
	this._appRemoteUrl		=	"http://";
	this._config			=	{
		formConf:				{
			mainClass:			"form-4col",//"form"
			title:				"Пришли фото своего Top Music Moment",
			titleClass:			"prompt",
			titleShow:			true,
		},
		noteConf:				{
			display:			"popup",//"both","block"
			html:				"Если вы обнаружили фото со звездой в своем архиве - поделитесь им!. Загрузите изображение со своего компьютера, напишите, с какой звездой, когда и при каких обстоятельствах вы сфотографировались и придумайте к фото интересный заголовок. Лучшие снимки, как всегда, будут опубликованы в газете Metro.",
		},
		ratedConf:				{
			cols:				1,
			display:			"inblock",//"runtime"
			imgHeight:			"150px",
			inblockId:			__name_this + "-vzyatka-rated",
			inblockSearchCnt:	0,
			inblockSearchTimes:	100,
			inblockSearchTm:	200,
			inblockSearchFunc:	this.DOMRatedSearch.bind(this),
			pushClass:			"push-component",//push-component clearfix small mt-article
			mainClass:			"rated-items-1col",
			title:				"Популярное",
			titleClass:			"rated-title",
			titleShow:			true
		},
		termsConf:				{
			html:				"",
			loadFromBlock:		false,
			loadFromBlockId:	"photo-vzyatka-terms"
		},
		showForm:				false,
		showLast:				false,
		showNote:				false,
		showRated:				false,
		showTerms:				false
	};
	this._debugAtions		=	true;
	this._galleriaReady		=	false;
	this._galleriaStart		=	0;
	this._inited			=	false;
	this._items				=	[];
	/*
    {
        image: 'img1.jpg',
        thumb: 'thumb1.jpg',
        big: 'big1.jpg',
        title: 'my first image',
        description: 'Lorem ipsum caption',
        link: 'http://domain.com'
    },
    {
        video: 'http://www.youtube.com/watch?v=GCZrz8siv4Q',
        title: 'my second image',
        description: 'Another caption'
    }
	*/
	this._fields			=	{
		image:	{
			dom:		null,
			isrc: 		"",
			loaded:		false,
			msg:		"Вы забыли загрузить фото для конкурса!",
		},
		title:	{
			dom:		null,
			msg:		"Введите заголовок к конкурсному фото!",
			valdef:		"Придумайте заголовок к вашему фото",
		},
		desc:	{
			dom:		null,
			msg:		"Вы забыли заполнить описание к фото (см. условия конкурса)!",
			valdef:		"Здесь вы можете оставить описание к своей фотографии",
		}
	};
	this._lastItems			=	[];
	this._lastClrs			=	[];
	this._listItems			=	[];
	this._ratedItems		=	[];
	this._ratedClrs			=	[];
	this._loadNext			=	true;
	this._loadPrev			=	true;
	this._loadingTreshold	=	5;
	this._loadingNext		=	false;
	this._loadingPrev		=	false;
	this._name_sub			=	"vzyatka";
	this._name				=	__name_this + "-" + this._name_sub;
	this._pu				=	-1;
	this._reqsX				=	[];
	this._title				=	"";
	this._urlsParsed		=	false;
	this._user				=	{
		nickname:		{
			dom:		null,
			msg:		"Введите свое имя!",
			valsrv:		""
		},
		mobile:			{
			dom:		null,
			msg:		"Номер мобильного введен некорректно!",
			valsrv:		""
		},
		email:			{
			dom:		null,
			msg:		"Вы ввели некорректный (пустой) e-mail адрес!",
			valsrv:		""
		},
		terms:			{
			accepted:	false,
			msg:		"Прочтите условия конкурса и установите флажок о согласии с ними!",
			dom:		null
		}
	};
	this._snVKappId			=	0;
	this.elCss				=	null;
	this.elMain				=	null;
	this.elForm				=	null;
	this.elFormBtnSend		=	null;
	this.elFormInfo			=	null;
	this.elFormDataFCont	=	null;
	this.elFormDataFWait	=	null;
	this.elFormData			=	null;
	this.elGallery			=	null;
	this.elLast				=	null;
	this.elLastItems		=	null;
	this.elLastMore			=	null;
	this.elLastMoreBtn		=	null;
	this.elLastMoreWait		=	null;
	this.elRated			=	null;
	this.elRatedItems		=	null;
	this.elVK				=	null;
	this.fOnAction			=	null;
	this.fOnFBLiked			=	null;
	this.fOnFBUnliked		=	null;
	this.fOnFormBtnClick	=	null;
	this.fOnFormFileSelect	=	null;
	this.fOnGalleriaInstance=	null;
	this.fOnGalleriaReady	=	null;
	this.fOnTerms			=	null;
	this.plCore				=	null;
	this.plGalleria			=	null;
	this.plGalleriaSlider	=	null;
	this.plPu				=	null;
};
_photo_vzyatka.prototype._init = function(last) {
	if (this._inited) return true;
	if (!this._urlsParsed) {
		this._urlsParsed = true;
		var d = this.plCore._url.host;
		var p = d.split(".");
		var ls = p[p.length - 1].toLowerCase();
		if (ls == "loc")
			this._appRemoteSrv = this._appRemoteSrv.replace(".ru", "." + ls);
		this._appRemoteUrl += this._appRemoteSrv + this._appRemoteUri;
		this._galleriaStart = this.plCore._url.params.id;
		if (typeof this._galleriaStart == "undefined") this._galleriaStart = 0;
	}
	if (!this.elVK) {
		var src = "//vk.com/js/api/openapi.js?95";
		var r = this.plCore.resourceLoad("js", src);
		if (r) this.elVK = r.el;
		else {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Ошибка загрузки VK модуля.");
			return true;
		}
	}
	if (!this.elCss) {
		var src = this.plCore.baseDir() + "_plugins/" + this._name + "/" + this._name + ".css?ver=1.0.79";
		var c = this.plCore.resourceLoad("css", src);
		if (c) this.elCss = c.el;
		else {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Ошибка загрузки CSS стилей [" + src + "]");
			return true;
		}
	}
	if (this._config.showForm) {
		if (!this.plPu) {
			this.plPu = this.plCore.pluginGet(__name_pu, "1.0.3");
			if (!this.plPu) {
				if (last) {
					this._initErr = true;
					this._inited = true;
					this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Истек таймаут ожидания инициализации требуемого плагина [" + __name_pu + "]");
					return true;
				} else return false;
			}
		}
	}
	if (!this.plGalleria) {
		this.plGalleria = this.plCore.pluginGet(__name_galleria, "1.0.2");
		if (!this.plGalleria) {
			if (last) {
				this._initErr = true;
				this._inited = true;
				this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Истек таймаут ожидания инициализации требуемого плагина [" + __name_galleria + "]");
				return true;
			} else return false;
		}
	}
	if (!this.elMain) {
		var ss = "thirdparty-v2-" + this._name;
		if (!document.getElementById(ss)) {
			this._initErr = true;
			this._inited = true;
			return true;
		}
		ss = document.getElementById(ss);
		this.elMain = document.createElement("DIV");
		this.elMain.className = this._name;
		ss.parentNode.insertBefore(this.elMain, ss);
	}
	if (typeof VK == "undefined") {
		if (last) {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Истек таймаут ожидания инициализации требуемого плагина [VK]");
			return true;
		} else return false;
	}
	if (typeof FB == "undefined") {
		if (last) {
			this._initErr = true;
			this._inited = true;
			this.plCore.console(__name_script + " > " + this._name + "._init(): Ошибка инициализации плагина [" + this._name + "]. Истек таймаут ожидания инициализации требуемого плагина [FB]");
			return true;
		} else return false;
	}
	this._inited = true;
	this.fOnAction = this.onAction.bind(this);
	this.fOnGalleriaInstance = this.onGalleriaInstance.bind(this);
	this.fOnGalleriaReady = this.onGalleriaReady.bind(this);
	this.fOnTerms = this.onClickChbTerms.bind(this);
	this.plGalleria.hookOnReadyAdd(this.fOnGalleriaReady);
	this.DOMGallery();
	if (this._config.showRated) {
		if (this._config.ratedConf.display == "runtime") {
			this.DOMRated();
			this.actionListRated();
		}
		if (this._config.ratedConf.display == "inblock") {
			this._config.ratedConf.inblockSearchFunc();
		}
	}
	if (this._config.showLast) this.DOMLast();
	if (this._config.showForm) this.DOMForm();
	//this.actionUserGet();
	this.actionListInitial();
	if (this._config.showLast && this._galleriaStart) this.actionListLast();
	return true;
};
_photo_vzyatka.prototype.actionDataSave = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "data-save";
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.onAction.bind(this);
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c) || (c == "image")) continue;
		req.valsPOST[this._name + "-form-" + c] = this._fields[c].dom;
	}
	for (var c in this._user) {
		if (!this._user.hasOwnProperty(c) || (c == "terms")) continue;
		req.valsPOST[this._name + "-form-" + c] = this._user[c].dom;
	}
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionImgUpload = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "img-upload";
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.onAction.bind(this);
	req.valsPOST[this._name + "-form-image"] = this._fields.image.dom;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionListInitial = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "list-initial";
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub + (this._galleriaStart ? ("&startid=" + this._galleriaStart) : "");
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionListLast = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "list-last";
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionListLastMore = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "list-last-more";
	req.owner_store.refid = this._lastItems[this._lastItems.length - 1].id;
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	req.valsPOST[this._name + "-refid"] = req.owner_store.refid;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionListMore = function(dir) {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "list-" + dir;
	var refid;
	if (dir == "prev")
		refid = this._listItems[this._listItems.length - 1].id;
	else
		refid = this._listItems[0].id
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub + "&refid=" + refid;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	this._reqsX.push(req);
	this.plCore.silentX(req);
	if (dir == "prev") this._loadingPrev = true;
	else this._loadingNext = true;
};
_photo_vzyatka.prototype.actionListRated = function() {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "list-rated";
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionLoveChange = function(id, c) {
	if (typeof c == "undefined") c = 1;
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "love-change";
	req.owner_store.id = id;
	req.owner_store.cnt = c;
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	req.valsPOST[this._name + "-love-id"] = req.owner_store.id;
	req.valsPOST[this._name + "-love-count"] = req.owner_store.cnt;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionLoveFbSave = function(id, c) {
	var req = this.plCore.reqXBuild(this);
	req.method = "POST";
	req.json = true;
	req.owner_store.action = "love-fb-save";
	req.owner_store.id = id;
	req.owner_store.cnt = c;
	req.url = this._appRemoteUrl + "?app-action=" + req.owner_store.action + "&" + __name_this + "-project=" + this._name_sub;
	req.statusUrl = this._appRemoteUrl + "?app-mode=status";
	req.statusCb = this.fOnAction;
	req.valsPOST[this._name + "-love-id"] = req.owner_store.id;
	req.valsPOST[this._name + "-love-count"] = req.owner_store.cnt;
	this._reqsX.push(req);
	this.plCore.silentX(req);
};
_photo_vzyatka.prototype.actionUserGet = function() {
};
_photo_vzyatka.prototype.DOMForm = function() {
	this.elForm = document.createElement("DIV");
	this.elForm.className = this._config.formConf.mainClass;
	this.elMain.appendChild(this.elForm);
	if (this._config.showNote && ((this._config.noteConf.display == "block") || (this._config.noteConf.display == "both"))) {
		//левая часть - Условия конкурса
		this.elFormInfo = document.createElement("DIV");
		this.elFormInfo.className = "project-info";
		this.elForm.appendChild(this.elFormInfo);
		var el = document.createElement("DIV");
		el.className = "info-title";
		el.innerHTML = "Условия конкурса";
		this.elFormInfo.appendChild(el);
		el = document.createElement("DIV");
		el.className = "info-text";
		el.innerHTML = this._config.noteConf.html;
		this.elFormInfo.appendChild(el);
	}
	//правая часть - Форма загрузки фото
	this.elFormData = document.createElement("DIV");
	this.elFormData.className = "upload-block";
	this.elForm.appendChild(this.elFormData);
	if (this._config.formConf.titleShow) {
		el = document.createElement("DIV");
		el.className = this._config.formConf.titleClass;
		el.innerHTML = this._config.formConf.title;
		this.elFormData.appendChild(el);
	}
	this.elFormDataPhoto = document.createElement("DIV");
	this.elFormDataPhoto.className = "up-img";
	this.elFormData.appendChild(this.elFormDataPhoto);
	this.elFormDataFields = document.createElement("DIV");
	this.elFormDataFields.className = "fields";
	this.elFormData.appendChild(this.elFormDataFields);
	//выбор файла
	el = document.createElement("DIV");
	el.className = "field";
	this.elFormDataFields.appendChild(el);
	var el1 = document.createElement("DIV");
	el1.className = "num";
	el1.innerHTML = "1";
	el.appendChild(el1);
	this.elFormDataFWait = document.createElement("DIV");
	this.elFormDataFWait.className = "fwaiter";
	this.elFormDataFWait.innerHTML = "загрузка фото...";
	el.appendChild(this.elFormDataFWait);
	this.elFormDataFCont = document.createElement("DIV");
	this.elFormDataFCont.className = "data";
	this.elFormDataFCont.innerHTML = "Загрузите фото с компьютера";
	el.appendChild(this.elFormDataFCont);
	this.fOnFormFileSelect = this.onClickFormFileSelect.bind(this);
	this.formInpFileRecreate();
	//группа остальных полей с блокером
	el = document.createElement("DIV");
	el.className = "blockable";
	this.elFormDataFields.appendChild(el);
	this.elFormDataBlocker = document.createElement("DIV");
	this.elFormDataBlocker.className = "blocker";
	el.appendChild(this.elFormDataBlocker);
	//заголовок к фото
	el1 = document.createElement("DIV");
	el1.className = "field";
	el.appendChild(el1);
	var el2 = document.createElement("DIV");
	el2.className = "num";
	el2.innerHTML = "2";
	el1.appendChild(el2);
	this._fields.title.dom = document.createElement("INPUT");
	this._fields.title.dom.type = "text";
	this._fields.title.dom.value = this._fields.title.valdef;
	this._fields.title.dom.maxLength = 255;
	this.plCore.eventAdd(this._fields.title.dom, "focus", this.onFocusFormField.bind(this, this._fields.title));
	this.plCore.eventAdd(this._fields.title.dom, "blur", this.onBlurFormField.bind(this, this._fields.title));
	el1.appendChild(this._fields.title.dom);
	//описание к фото
	el1 = document.createElement("DIV");
	el1.className = "field";
	el.appendChild(el1);
	var el2 = document.createElement("DIV");
	el2.className = "num";
	el2.innerHTML = "3";
	el1.appendChild(el2);
	this._fields.desc.dom = document.createElement("TEXTAREA");
	this._fields.desc.dom.value = this._fields.desc.valdef;
	this.plCore.eventAdd(this._fields.desc.dom, "focus", this.onFocusFormField.bind(this, this._fields.desc));
	this.plCore.eventAdd(this._fields.desc.dom, "blur", this.onBlurFormField.bind(this, this._fields.desc));
	el1.appendChild(this._fields.desc.dom);
	//имя пользователя
	el1 = document.createElement("DIV");
	el1.className = "usr-field nickname";
	el.appendChild(el1);
	this._user.nickname.dom = document.createElement("INPUT");
	this._user.nickname.dom.type = "text";
	this._user.nickname.dom.maxLength = 64;
	this._user.nickname.dom.value = this._user.nickname.valsrv;
	el1.appendChild(this._user.nickname.dom);
	//мобильный телефон пользователя
	el1 = document.createElement("DIV");
	el1.className = "usr-field mobile";
	el.appendChild(el1);
	this._user.mobile.dom = document.createElement("INPUT");
	this._user.mobile.dom.type = "text";
	this._user.mobile.dom.maxLength = 64;
	this._user.mobile.dom.value = this._user.mobile.valsrv;
	el1.appendChild(this._user.mobile.dom);
	//мобильный телефон пользователя
	el1 = document.createElement("DIV");
	el1.className = "usr-field email";
	el.appendChild(el1);
	this._user.email.dom = document.createElement("INPUT");
	this._user.email.dom.type = "text";
	this._user.email.dom.maxLength = 64;
	this._user.email.dom.value = this._user.email.valsrv;
	el1.appendChild(this._user.email.dom);
	//условия участия и кнопка отправки
	el1 = document.createElement("DIV");
	el1.className = "send-field";
	el.appendChild(el1);
	el2 = document.createElement("LABEL");
	el2.innerHTML = "я принимаю условия конкурса";
	if (!this._showTerms) el2.style.display = "none";
	this.plCore.eventAdd(el2, "click", this.fOnTerms);
	el1.appendChild(el2);
	this._user.terms.dom = document.createElement("INPUT");
	this._user.terms.dom.type = "checkbox";
	this._user.terms.dom.checked = this._showTerms ? false : true;
	el2.insertBefore(this._user.terms.dom, el2.childNodes[0]);
	/*
	this.plCore.eventAdd(this._user.terms.dom, "click", function(e){
		el = (e.target || e.srcElement);
		if (el) el.blur();
	});
	this.plCore.eventAdd(this._user.terms.dom, "change", this.fOnTerms);
	*/
	this.elFormBtnSend = document.createElement("INPUT");
	this.elFormBtnSend.type = "button";
	this.fOnFormBtnClick = this.onClickFormBtnSend.bind(this);
	this.plCore.eventAdd(this.elFormBtnSend, "click", this.fOnFormBtnClick);
	el1.appendChild(this.elFormBtnSend);
	this.elFormDataWaiter = document.createElement("DIV");
	this.elFormDataWaiter.className = "waiter";
	this.elFormDataWaiter.innerHTML = "сохранение...";
	el1.appendChild(this.elFormDataWaiter);
};
_photo_vzyatka.prototype.DOMGallery = function() {
	//слайдер
	this.elGallery = document.createElement("DIV");
	this.elGallery.id = this._name + "-gallery";
    this.elGallery.style.height = "540px";
    if (document.getElementById("thirdparty-galleria-default")) this.elGallery.style.display = "none";
	this.elMain.appendChild(this.elGallery);
};
_photo_vzyatka.prototype.DOMLast = function() {
	this.elLast = document.createElement("DIV");
	this.elLast.className = "last-items";
	this.elLast.style.display = "none";
	this.elMain.appendChild(this.elLast);
	var el = document.createElement("DIV");
	el.className = "last-title";
	el.innerHTML = "Последние";
	this.elLast.appendChild(el);
	this.elLastItems = document.createElement("DIV");
	this.elLastItems.className = "main-box clearfix box-7";
	this.elLast.appendChild(this.elLastItems);
	this.elLastMore = document.createElement("DIV");
	this.elLastMore.className = "last-more";
	this.elLast.appendChild(this.elLastMore);
	this.elLastMoreBtn = document.createElement("DIV");
	this.elLastMoreBtn.className = "btn";
	this.elLastMoreBtn.innerHTML = "еще фото";
	this.elLastMore.appendChild(this.elLastMoreBtn);
	this.plCore.eventAdd(this.elLastMoreBtn, "click", this.onClickBtnLastMore.bind(this));
	this.elLastMoreWait = document.createElement("DIV");
	this.elLastMoreWait.className = "waiter";
	this.elLastMoreWait.style.display = "none";
	this.elLastMore.appendChild(this.elLastMoreWait);
};
_photo_vzyatka.prototype.DOMLastItem = function(i, pos) {
	i.dom = document.createElement("DIV");
	i.dom.className = "column-item";
	var el = document.createElement("DIV");
	el.className = "push-component clearfix small mt-article";
	i.dom.appendChild(el);
	var a = document.createElement("A");
	a.href = "/konkurs/" + this._name_sub + "/?id=" + i.id;
	el.appendChild(a);
	var dim = document.createElement("DIV");
	a.appendChild(dim);
	var im = document.createElement("IMG");
	im.style.height = "100px";
	im.src = (i.img_thumb ? i.img_thumb : i.img);
	dim.appendChild(im);
	var h = document.createElement("H4");
	h.className = "title";
	a.appendChild(h);
	var s = document.createElement("SPAN");
	s.innerHTML = i.title;
	h.appendChild(s);
	var n = this.elLastItems.childNodes.length;
	if (!n || (pos == -1) || (pos > (n - 1))) {
		this.elLastItems.appendChild(i.dom);
		return;
	}
	this.elLastItems.insertBefore(i.dom, this.elLastItems.childNodes[pos]);
};
_photo_vzyatka.prototype.DOMRated = function(d) {
	if (typeof d == "undefined") d = false;
	this.elRated = document.createElement("DIV");
	this.elRated.className = this._config.ratedConf.mainClass;
	this.elRated.style.display = "none";
	if (d) d.appendChild(this.elRated);
	else this.elMain.appendChild(this.elRated);
	if (this._config.ratedConf.titleShow) {
		var el = document.createElement("DIV");
		el.className = this._config.ratedConf.titleClass;
		el.innerHTML = this._config.ratedConf.title;
		this.elRated.appendChild(el);
	}
	this.elRatedItems = document.createElement("DIV");
	this.elRatedItems.className = "main-box clearfix box-7";
	this.elRated.appendChild(this.elRatedItems);
};
_photo_vzyatka.prototype.DOMRatedSearch = function() {
	if (this._config.ratedConf.inblockSearchCnt >= 100) return;
	this._config.ratedConf.inblockSearchCnt++;
	var d = document.getElementById(this._config.ratedConf.inblockId);
	if (d) {
		this.DOMRated(d);
		this.actionListRated();
	} else {
		window.setTimeout(this._config.ratedConf.inblockSearchFunc, this._config.ratedConf.inblockSearchTm);
	}
};
_photo_vzyatka.prototype.DOMRatedItem = function(i, pos) {
	i.dom = document.createElement("DIV");
	i.dom.className = "column-item";
	var el = document.createElement("DIV");
	el.className = "rate-rel";
	i.dom.appendChild(el);
	i.domCount = document.createElement("DIV");
	i.domCount.className = "count";
	i.domCount.innerHTML = i.count;
	el.appendChild(i.domCount);
	el = document.createElement("DIV");
	el.className = this._config.ratedConf.pushClass;
	i.dom.appendChild(el);
	var a = document.createElement("A");
	a.href = "/konkurs/" + this._name_sub + "/?id=" + i.id;
	el.appendChild(a);
	var dim = document.createElement("DIV");
	a.appendChild(dim);
	var im = document.createElement("IMG");
	im.style.height = this._config.ratedConf.imgHeight;
	im.src = (i.img_thumb ? i.img_thumb : i.img);
	dim.appendChild(im);
	var h = document.createElement("H4");
	h.className = "title";
	a.appendChild(h);
	var s = document.createElement("SPAN");
	s.innerHTML = i.title;
	h.appendChild(s);
	var n = this.elRatedItems.childNodes.length;
	if (!n || (pos > (n - 1))) {
		this.elRatedItems.appendChild(i.dom);
		return;
	}
	this.elRatedItems.insertBefore(i.dom, this.elRatedItems.childNodes[pos]);
};
_photo_vzyatka.prototype.DOMSocBtns = function(i) {
	//кнопки голосования
	//VK
	i.btVotes = document.createElement("DIV");
	i.btVotes.className = "soc-votes";
	i.btVK = document.createElement("DIV");
	i.btVK.id = this._name + "-vk-" + i.id;
	i.btVotes.appendChild(i.btVK);
	//FB
	var uri = "";
	if (this.plCore._url.segments[0])
		uri = this.plCore._url.segments.join("/");
	uri += "?id=" + i.id;
	var html = "<div class=\"fb-like\" data-href=\"" + this.plCore._url.protocol + "://" + this.plCore._url.host + "/" + uri + "\" data-send=\"false\" data-layout=\"button_count\" data-width=\"100\" data-show-faces=\"true\" data-font=\"arial\"></div>";
	var el1 = document.createElement("DIV");
	el1.innerHTML = html;
	i.btFB = el1.childNodes[0];
	i.btVotes.appendChild(i.btFB);
};
_photo_vzyatka.prototype.formFieldsEmpty = function() {
	this.elFormDataPhoto.style.backgroundImage = "";
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c)) continue;
		if (c != "image") this._fields[c].dom.value = this._fields[c].valdef;
		if (c == "image") this._fields.image.loaded = false;
	}
};
_photo_vzyatka.prototype.formFieldsCheck = function() {
	for (var c in this._fields) {
		if (!this._fields.hasOwnProperty(c)) continue;
		if ((c != "image") && (!this._fields[c].dom.value || (this._fields[c].dom.value == this._fields[c].valdef))) {
			alert(this._fields[c].msg);
			this._fields[c].dom.focus();
			return false;
		}
		if ((c == "image") && !this._fields.image.loaded) {
			alert(this._fields.image.msg);
			return false;
		}
	}
	for (var c in this._user) {
		if (!this._user.hasOwnProperty(c)) continue;
		if ((this._user[c].dom.type != "checkbox") && !this._user[c].dom.value) {
			alert(this._user[c].msg);
			this._user[c].dom.focus();
			return false;
		}
		if ((this._user[c].dom.type == "checkbox") && !this._user[c].dom.checked) {
			alert(this._user[c].msg);
			return false;
		}
		if (c == "email" && !this.plCore.validEmail(this._user[c].dom.value)) {
			alert(this._user[c].msg);
			this._user[c].dom.focus();
			return false;
		}
	}
	return true;
};
_photo_vzyatka.prototype.formInpFileRecreate = function() {
	this._fields.image.dom = document.createElement("INPUT");
	this._fields.image.dom.type = "file";
	this.elFormDataFCont.appendChild(this._fields.image.dom);
	this.plCore.eventAdd(this._fields.image.dom, "change", this.fOnFormFileSelect);
};
_photo_vzyatka.prototype.listLastRepose = function() {
	for (var c in this._lastClrs) {
		if (!this._lastClrs.hasOwnProperty(c)) continue;
		this._lastClrs[c].parentNode.removeChild(this._lastClrs[c]);
	}
	this._lastClrs = [];
	var cnt = 1;
	for (var c in this._lastItems) {
		if (!this._lastItems.hasOwnProperty(c)) continue;
		this._lastItems[c].dom.className = "column-item" + (cnt > 1 ? (" need-margin p" + cnt) : "");
		cnt++;
		if (cnt == 5) {
			cnt = 1;
			var ord = 1 + parseInt(c, 10);
			if (typeof this._lastItems[ord] != "undefined") {
				var clr = document.createElement("DIV");
				clr.className = "row-clear";
				this.elLastItems.insertBefore(clr, this._lastItems[ord].dom);
				this._lastClrs.push(clr);
			}
		}
	}
};
_photo_vzyatka.prototype.listRatedRepose = function() {
	for (var c in this._retedClrs) {
		if (!this._ratedClrs.hasOwnProperty(c)) continue;
		this._ratedClrs[c].parentNode.removeChild(this._ratedClrs[c]);
	}
	this._ratedClrs = [];
	var cnt = 1;
	for (var c in this._ratedItems) {
		if (!this._ratedItems.hasOwnProperty(c)) continue;
		this._ratedItems[c].dom.className = "item" + (cnt > 1 ? (" need-margin p" + cnt) : "");
		cnt++;
		if (cnt > this._config.ratedConf.cols) {
			cnt = 1;
			var ord = 1 + parseInt(c, 10);
			if (typeof this._ratedItems[ord] != "undefined") {
				var clr = document.createElement("DIV");
				clr.className = "row-clear";
				this.elRatedItems.insertBefore(clr, this._ratedItems[ord].dom);
				this._ratedClrs.push(clr);
			}
		}
	}
};
_photo_vzyatka.prototype.onAction = function(req) {
	if ((typeof req != "object") || (typeof req.resp != "object")) {
		this.plCore.console(resp);
		alert("Ошибка: сервер вернул некорректный ответ!");
		return;
	}
	if (req.resp.msg) alert(req.resp.msg);
	switch (req.owner_store.action) {
		case "data-save":
			this.elFormDataFWait.style.display = "none";
			this.elFormDataWaiter.style.display = "none";
			this.elFormDataBlocker.style.display = "none";
			this.elFormDataFCont.style.display = "block";
			this.elFormBtnSend.style.display = "block";
			if (!req.resp.res) break;
			alert("Ваше фото успешно загружено!");
			this.formFieldsEmpty();
			this._lastItems.splice(0, 0, req.resp.item);
			this.DOMLastItem(req.resp.item, 0);
			this.listLastRepose();
			var uri = "";
			if (this.plCore._url.segments[0])
				uri = this.plCore._url.segments.join("/");
			uri += "?id=" + req.resp.item.id;
			this.plCore.historyWrite(this._name, uri, req.resp.item.title);
			//restarting Galleria
			this._listItems.splice(0, this._listItems.length);
			this._items.splice(0, this._items.length);
			this._listItems = req.resp.items;
			for (var c in this._listItems) {
				if (!this._listItems.hasOwnProperty(c)) continue;
				var i = this._listItems[c].img;
				var ib = (typeof this._listItems[c].img_big != "undefined") ? this._listItems[c].img_big : i;
				var it = (typeof this._listItems[c].img_thumb != "undefined") ? this._listItems[c].img_thumb : i;
				//кнопки голосования
				this.DOMSocBtns(this._listItems[c]);
				this._items.push({
					image: i,
					thumb: it,
					big: ib,
					title: this._listItems[c].title,
					description: this._listItems[c].descr,
					link: "",
					layer: this._listItems[c].btVotes
				});
			}
			if (this._items.length) {
				this.plGalleriaSlider.destroy();
				var self = this;
				Galleria.run("#" + this.elGallery.id, {dataSource: this._items, keepSource: true, extend: function(options) {
					self.onGalleriaInstance(this);
				}});
			}
			break;
		case "img-upload":
			this.elFormDataFWait.style.display = "none";
			this.elFormDataBlocker.style.display = "none";
			this.elFormDataFCont.style.display = "block";
			this.formInpFileRecreate(true);
			if (!req.resp.res) {
				this._fields.image.loaded = false;
				this.elFormDataPhoto.style.backgroundImage = "";
				break;
			}
			this._fields.image.loaded = true;
			this.elFormDataPhoto.style.backgroundImage = "url('" + req.resp.isrc + "?rand=" + this.plCore.seed() + "')";
			this._fields.image.isrc = req.resp.isrc;
			break;
		case "love-change":
			break;
		case "love-fb-save":
			break;
		case "list-initial":
			if (req.resp.res) {
				this._snVKappId = req.resp.snVKappId;
				if (typeof VK != "undefined" && VK) {
					VK.init({apiId: this._snVKappId, onlyWidgets: true});
				}
				this._listItems = req.resp.items;
				for (var c in this._listItems) {
					if (!this._listItems.hasOwnProperty(c)) continue;
					if (!this._galleriaStart && this._config.showLast) {
						this._lastItems.push(this._listItems[c]);
						this.DOMLastItem(this._listItems[c], c);
					}
					var i = this._listItems[c].img;
					var ib = (typeof this._listItems[c].img_big != "undefined") ? this._listItems[c].img_big : i;
					var it = (typeof this._listItems[c].img_thumb != "undefined") ? this._listItems[c].img_thumb : i;
					//кнопки голосования
					this.DOMSocBtns(this._listItems[c]);
					this._items.push({
						image: i,
						thumb: it,
						big: ib,
						title: this._listItems[c].title,
						description: this._listItems[c].descr,
						link: "",
						layer: this._listItems[c].btVotes
					});
				}
				if (this._lastItems.length) {
					this.elLast.style.display = "block";
					this.listLastRepose();
				}
				if (this._items.length) {
					if (this._galleriaReady) {
						var g = document.getElementById("thirdparty-galleria-default");
						if (g) {
							if (thirdpartyGalleriaDef) thirdpartyGalleriaDef.destroy();
							g.parentNode.parentNode.removeChild(g.parentNode);
							this.elGallery.style.display = "block";
						}
						var self = this;
						Galleria.run("#" + this.elGallery.id, {dataSource: this._items, keepSource: true, extend: function(options) {
							self.onGalleriaInstance(this);
						}});
					}
				}
			}
			break;
		case "list-last":
			if (req.resp.res) {
				if (!req.resp.more) this.elLastMore.style.display = "none";
				this._lastItems = req.resp.items;
				var cnt = 0;
				for (var c in this._lastItems) {
					if (!this._lastItems.hasOwnProperty(c)) continue;
					this.DOMLastItem(this._lastItems[c], c);
					cnt++;
				}
				if (cnt) {
					this.elLast.style.display = "block";
					this.listLastRepose();
				}
			} else this.elLastMore.style.display = "none";
			break;
		case "list-last-more":
			if (req.resp.res) {
				if (!req.resp.more) this.elLastMore.style.display = "none";
				var cnt = 0;
				for (var c in req.resp.items) {
					if (!req.resp.items.hasOwnProperty(c)) continue;
					this._lastItems.push(req.resp.items[c]);
					this.DOMLastItem(req.resp.items[c], -1);
					cnt++;
				}
				if (cnt) this.listLastRepose();
				this.elLastMoreWait.style.display = "none";
				this.elLastMoreBtn.style.display = "block";
			} else this.elLastMore.style.display = "none";
			break;
		case "list-next":
			this._loadingNext = false;
			if (req.resp.res) {
				if (!req.resp.items.length) {
					this._loadNext = false;
					break;
				}
				var ins = 0;
				var ind = this.plGalleriaSlider.getIndex();
				for (var c in req.resp.items) {
					if (!req.resp.items.hasOwnProperty(c)) continue;
					this._listItems.splice(ins, 0, req.resp.items[c]);
					var i = req.resp.items[c].img;
					var ib = (typeof req.resp.items[c].img_big != "undefined") ? req.resp.items[c].img_big : i;
					var it = (typeof req.resp.items[c].img_thumb != "undefined") ? req.resp.items[c].img_thumb : i;
					//кнопки голосования
					this.DOMSocBtns(req.resp.items[c]);
					this._items.splice(ins, 0, {image: i, thumb: it, big: ib, title: req.resp.items[c].title, description: req.resp.items[c].descr, link: "", layer: req.resp.items[c].btVotes});
					this.plGalleriaSlider.splice(ins, 0, this._items[ins]);
				}
				/*
				var self = this;
				var i = ind + req.resp.items.length;
				window.setTimeout(function(){
					//self.plGalleriaSlider.show(i);
					self.plGalleriaSlider.refreshImage();
				}, 100);
				*/
			}
			break;
		case "list-prev":
			this._loadingPrev = false;
			if (req.resp.res) {
				if (!req.resp.items.length) {
					this._loadPrev = false;
					break;
				}
				var ins = this._listItems.length;
				for (var c in req.resp.items) {
					if (!req.resp.items.hasOwnProperty(c)) continue;
					this._listItems.splice(ins, 0, req.resp.items[c]);
					var i = req.resp.items[c].img;
					var ib = (typeof req.resp.items[c].img_big != "undefined") ? req.resp.items[c].img_big : i;
					var it = (typeof req.resp.items[c].img_thumb != "undefined") ? req.resp.items[c].img_thumb : i;
					//кнопки голосования
					this.DOMSocBtns(req.resp.items[c]);
					this._items.splice(ins, 0, {image: i, thumb: it, big: ib, title: req.resp.items[c].title, description: req.resp.items[c].descr, link: "", layer: req.resp.items[c].btVotes});
					this.plGalleriaSlider.splice(ins, 0, this._items[ins]);
				}
			}
			break;
		case "list-rated":
			if (req.resp.res) {
				this._ratedItems = req.resp.items;
				var cnt = 0;
				for (var c in this._ratedItems) {
					if (!this._ratedItems.hasOwnProperty(c)) continue;
					this.DOMRatedItem(this._ratedItems[c], c);
					cnt++;
				}
				if (cnt) this.elRated.style.display = "block";
				this.listRatedRepose();
			}
			break;
		default:
			this.plCore.console(__name_script + " > " + this._name + ".onAction(): Сервер вернул неизвестные данные, [action: " + req.owner_store.action + "].");
			this.plCore.console(req.resp);
	}
};
_photo_vzyatka.prototype.onBlurFormField = function(i) {
	if (i.dom.value == "") i.dom.value = i.valdef;
};
_photo_vzyatka.prototype.onClickBtnLastMore = function() {
	this.elLastMoreBtn.style.display = "none";
	this.elLastMoreWait.style.display = "block";
	this.actionListLastMore();
};
_photo_vzyatka.prototype.onClickChbTerms = function() {
	if (this._pu === false) return;
	if (this._user.terms.dom.checked) {
		if (this._pu == -1) {
			var el;
			if (this._config.termsConf.loadFromBlock) {
				el = document.getElementById(this._config.termsConf.loadFromBlockId);
				if (el) {} else return;
			} else {
				el = document.createElement("DIV");
				el.innerHTML = this._config.termsConf.html;
			}
			this._pu = this.plPu.add({
				windowed: true,
				content: el,
				showcloser: true
			});
			if (this._pu == -1) {
				this._pu = false;
				return;
			}
		}
		this.plPu.show(this._pu);
	}
};
_photo_vzyatka.prototype.onClickFormBtnSend = function() {
	if (!this.formFieldsCheck()) return;
	this.actionDataSave();
	this.elFormDataFCont.style.display = "none";
	this.elFormBtnSend.style.display = "none";
	this.elFormDataFWait.innerHTML = "сохранение...";
	this.elFormDataFWait.style.display = "block";
	this.elFormDataWaiter.style.display = "block";
	this.elFormDataBlocker.style.display = "block";
};
_photo_vzyatka.prototype.onClickFormFileSelect = function() {
	var len = this._fields.image.dom.value.length;
	if (!len) return;
	var ext1 = this._fields.image.dom.value.substring(len - 3, len).toLowerCase();
	var ext2 = this._fields.image.dom.value.substring(len - 4, len).toLowerCase();
	if ((ext1 != "jpg") && (ext2 != "jpeg")) {
		alert("Фото должно иметь формат .jpg/jpeg!");
		return;
	}
	this.actionImgUpload();
	this.plCore.eventRemove(this._fields.image.dom, "change", this.fOnFormFileSelect);
	this.elFormDataFCont.style.display = "none";
	this.elFormDataFWait.innerHTML = "загрузка фото...";
	this.elFormDataFWait.style.display = "block";
	this.elFormDataBlocker.style.display = "block";
};
_photo_vzyatka.prototype.onFocusFormField = function(i) {
	if (i.dom.value == i.valdef) i.dom.value = "";
};
_photo_vzyatka.prototype.onGalleriaInstance = function(i) {
	this.plGalleriaSlider = i;
	var self = this;
	this.plGalleriaSlider.bind("image", function(e) {
		self.onPlayStop(e);
	});
};
_photo_vzyatka.prototype.onGalleriaReady = function() {
	this._galleriaReady = true;
	Galleria.configure({
		transition: "slide",
		initialTransition: "fade",
		imageCrop: "landscape",
		fullscreenCrop: false,
		clicknext: true,
		touchTransition: "slide",
		_locale: {
			show_captions: "Показать описание",
			hide_captions: "Убрать описание",
			play: "Запустить слайд-шоу",
			pause: "Приостановить слайд-шоу",
			enter_fullscreen: "Включить полноэкранный режим",
			exit_fullscreen: "Выключить полноэкранный режим",
			next: "Следующее фото",
			prev: "Предыдущее фото",
			showing_image: "Фото %s из %s"
		}
	});
	if (this._items.length) {
		var self = this;
		Galleria.run("#" + this.elGallery.id, {dataSource: this._items, keepSource: true, extend: function() {
			self.onGalleriaInstance(this);
		}});
	}
};
_photo_vzyatka.prototype.onGalleryVote = function() {
};
_photo_vzyatka.prototype.onPlayStop = function(e) {
	var uri = "";
	if (this.plCore._url.segments[0])
		uri = this.plCore._url.segments.join("/");
	uri += "?id=" + this._listItems[e.index].id;
	this.plCore.historyWrite(this._name, uri, this._listItems[e.index].title);
	if (!this._prevLoading && this._loadPrev) {
		if ((this._listItems.length - e.index) < this._loadingTreshold) this.actionListMore("prev");
	}
	if (!this._nextLoading && this._loadNext) {
		if (e.index < this._loadingTreshold) this.actionListMore("next");
	}
	if (typeof VK != "undefined") {
		if (typeof this._listItems[e.index].btVKParsed == "undefined") {
			this._listItems[e.index].btVKParsed = true;
			if (this._listItems[e.index].btVK)
				VK.Widgets.Like(this._listItems[e.index].btVK.id, {type: "mini", pageTitle: this._title + ", фото №" + this._listItems[e.index].id, pageDescription: this._listItems[e.index].title}, this._listItems[e.index].id);
		}
		if (this._listItems[e.index].vk_likes_check && !this._listItems[e.index].vk_likes_checked) {
			this._listItems[e.index].vk_likes_checked = true;
			VK.Api.call("likes.getList",{type:"sitepage", owner_id: this._snVKappId, item_id: this._listItems[e.index].id, page_url: window.location.href, count: 1}, this.onVKCount.bind(this, this._listItems[e.index].id));
		}
	}
	if (typeof FB != "undefined") {
		if (!this.fOnFBLiked) {
			this.fOnFBLiked = this.onFBLiked.bind(this);
			FB.Event.subscribe("edge.create", this.fOnFBLiked);
		}
		if (!this.fOnFBUnliked) {
			this.fOnFBUnliked = this.onFBUnliked.bind(this);
			FB.Event.subscribe("edge.remove", this.fOnFBUnliked);
		}
		if (typeof this._listItems[e.index].btFBParsed == "undefined") {
			this._listItems[e.index].btFBParsed = true;
			if (this._listItems[e.index].btFB)
				FB.XFBML.parse(this._listItems[e.index].btFB.parentNode);
		}
	}
};
_photo_vzyatka.prototype.onFBLiked = function(url) {
	var p = this.plCore.urlParse(url);
	if (typeof p.params["id"] != "undefined") {
		var id = parseInt(p.params["id"], 10);
		if (id) this.actionLoveChange(id);
	}
};
_photo_vzyatka.prototype.onFBUnliked = function(url) {
	var p = this.plCore.urlParse(url);
	if (typeof p.params["id"] != "undefined") {
		var id = parseInt(p.params["id"], 10);
		if (id) this.actionLoveChange(id, -1);
	}
};
_photo_vzyatka.prototype.onVKCount = function(id, r) {
	if (typeof id != "number") return;
	if ((typeof r != "object") || !r) return;
	if (typeof r.response != "object") return;
	if (typeof r.response.count != "number") return;
	this.actionLoveFbSave(id, r.response.count);
};
if (thirdparty_shared.core._loaded) {
	thirdparty_shared.core._obj.pluginReg(new _photo_vzyatka(), true);
} else {
	var w = {};
	w.init = true;
	w.obj = new _photo_vzyatka();
	thirdparty_shared.waiting.push(w);
}

})();