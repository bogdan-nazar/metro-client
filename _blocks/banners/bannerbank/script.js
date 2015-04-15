ar_bnum = window.ar_bnum || 1;
function ar_rnd_rep(s) {
	return s.replace(/!\[rnd\]/g,RndNum4NoCash);
}
function ar_sendPix(s, b, i) {
	if (typeof s == "undefined") {
		s = unescape(window.ar_pass || "");
	}
	if (!s) return;
	var d = parent.document;
	s = ar_rnd_rep(s.replace(/!\[ref\]/, escape(d.referrer||"unknown")));
	if (b = d.body) {
		i = d.createElement("IMG");
		i.style.position = "absolute";
		i.style.width = i.style.height = "0px";
		i.onload = i.onerror = function(){
			b.removeChild(i);
			i = b = null;
		};
		i.src = s;
		b.insertBefore(i, b.firstChild);
	} else new Image().src = s;
	return true;
}
function ar_c(s) {
	return !s||(/^http(s|):\/\/|^\/\//i).test(s)?s:CompPath+s;
}
if (parent && (parent.ar_sendPix == "undefined")) {
	parent.ar_sendPix = ar_sendPix;
}
var loc = "";
try {loc = escape(top.location.href);} catch(e) {;}
var userid = 174942328;
var page = 1;
var rndnum = Math.round(Math.random() * 999111);
var c = document.createElement("DIV");
c.style.textAlign = "center";
c.style.width = "240px";
c.onclick = ar_sendPix;
var f = document.createElement("IFRAME");
f.style.border = "0";
f.style.padding = "0";
f.style.margin = "0";
f.style.outline = "0";
f.style.width = "240px";
f.style.height = "400px";
f.style.overflow = "hidden";
f.setAttribute("vspace", "0");
f.setAttribute("hspace", "0");
f.setAttribute("width", "240");
f.setAttribute("height", "400");
f.setAttribute("frameborder", "0");
f.setAttribute("scrolling", "no");
f.setAttribute("marginwidth", "no");
f.setAttribute("marginheight", "no");
f.src = "http://ad3.bannerbank.ru/bb.cgi?cmd=ad&hreftarget=_blank&pubid=" + userid + "&pg=" + page + "&vbn=1982&w=240&h=400&num=1&r=ssi&ssi=nofillers&r=ssi&nocache=" + rndnum + "&ref=" + escape(document.referrer) + "&loc=" + loc;
f.onclick = ar_sendPix;
c.appendChild(f);
var ad_fr = parent.document.getElementById("ad_ph_" + ar_bnum);
if ((self != parent) && ad_fr) {
	ad_fr.appendChild(c);
	ad_fr.style.display = "block";
}
