(function() {
	if (typeof window.thirdparty_shared == "undefined") {
		window.thirdparty_shared = {};
		var ts = window.thirdparty_shared;
		ts.core = {};
		ts.core._loaded = false;
		ts.core._obj = null;
		ts.waiting = [];
		ts.waitingProtos = [];
		ts.waitingInstances = [];
	}
	var	s, seq = [],
		h = document.getElementsByTagName("HEAD")[0],
		r = h.childNodes.length ? h.childNodes[0] : false;
	seq.push("/thirdparty-v2/_core/core.js?ver=1.0.38");
	//seq.push("/thirdparty-v2/_core/adriver.core.2.js");
	seq.push("/thirdparty-v2/_plugins/iptogeo/iptogeo.js?ver=1.0.11");
	seq.push("/thirdparty-v2/_plugins/wibads_tmhack/wibads-tmhack.js?ver=1.0.4b2");
	for (var c = 0; c < seq.length; c++) {
		s = document.createElement("SCRIPT");
		s.type = "text/javascript";
		s.async = true;
		if (!r) h.appendChild(s);
		else h.insertBefore(s, r);
	}
})();
