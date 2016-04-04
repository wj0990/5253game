var market_frame = null;
function market_count(adid, start, end) {
	var setcookie = function(sName, sValue) {
		var d = new Date();
		var year = d.getYear();
		var end = Date.parse(((year < 1900) ? (1900 + year) : year) + "/"
				+ (d.getMonth() + 1) + "/" + d.getDate() + " 23:59:59");
		var t_date = new Date(end);
		var expiresDate = t_date.toUTCString();
		document.cookie = sName + "=" + escape(sValue) + ";expires="
				+ expiresDate;
	};
	var getcookie = function(sName) {
		var aCookie = document.cookie.toString().split(";");
		for ( var i = 0; i < aCookie.length; i++) {
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0])
				return unescape(aCrumb[1]);
		}
	};
	var type = 0;
	start = start.replace(".0", "");
	end = end.replace(".0", "");
	var sdate = Date.parse(start.replace(/-/ig, "/"));
	var edate = Date.parse(end.replace(/-/ig, "/"));
	var id = adid + sdate + edate;
	if (getcookie(id) != "1") {
		setcookie(id, "1");
	} else {
		type = 1;
	}
	if (market_frame != null)
		document.body.removeChild(market_frame);
	market_frame = document.createElement("iframe");
	market_frame.style.display = "none";
	market_frame.height = "1px";
	market_frame.width = "1px";
	document.body.appendChild(market_frame);
	market_frame.src = 'http://mstat.duowan.com/stat.action?aid=' + adid;
}

function listenLoaded() {
	if (document.readyState)// IE
	{
		if (document.readyState == "loaded"
				|| document.readyState == "complete") {
			submitPvStat();
		} else {
			window.setTimeout(listenLoaded, 3000);
		}
	} else if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", submitPvStat, false);
	} else {
		alert("not defined borwer type!");
	}
}

function submitPvStat() {
	return;
	if (document.market_loadids == null || "" == document.market_loadids) {
		return;
	}
	var scriptBlock = document.createElement("script");
	var requrl = "http://mstat.duowan.com/pv.action?aid="
			+ document.market_loadids;
	scriptBlock.src = "";
	scriptBlock.src = requrl;
	scriptBlock.type = "text/javascript";
	scriptBlock.language = "javascript";
	document.getElementsByTagName("head")[0].appendChild(scriptBlock);
}

function market_pvstat(adid) {
	if (document.market_loadids == null)
		document.market_loadids = "";
	document.market_loadids += adid + ",";
}
listenLoaded();

// ----- adstats hiido -----
var adStat2Hiido = {
	ui : null,

	lp : encodeURIComponent(window.location.href),

	setCookie : function(name, value, expires, path, domain, secure) {
		var today = new Date();
		today.setTime(today.getTime());
		if (expires) {
			expires = expires * 1000 * 60 * 60 * 24;
		}
		var expires_date = new Date(today.getTime() + (expires));
		document.cookie = name + "="
				+ escape(value)
				+ ((expires) ? ";expires=" + expires_date.toGMTString() : "")
				+ // expires.toGMTString()
				((path) ? ";path=" + path : "")
				+ ((domain) ? ";domain=" + domain : "")
				+ ((secure) ? ";secure" : "");
	},

	getCookie : function(name) {
		var start = document.cookie.indexOf(name + "=");
		var len = start + name.length + 1;
		if ((!start) && (name != document.cookie.substring(0, name.length))) {
			return null;
		}
		if (start == -1) {
			return null;
		}
		var end = document.cookie.indexOf(";", len);
		if (end == -1) {
			end = document.cookie.length;
		}
		return unescape(document.cookie.substring(len, end));
	},

	topLevelDomain : function() {
		var host = window.location.host;
		var domains = new Array("duowan.com", "yy.com", "sc2.com", "5253.com",
				"99d.com", "bengou.com", "zzvv.com");
		for (x in domains) {
			if (host.match(domains[x]) != null)
				return domains[x]
		}
		return domains[0]
	},

	readAndWriteHiido_ui : function() {
		this.ui = this.getCookie("hiido_ui");
		if (this.ui == null || this.ui == '') {
			this.ui = Math.random();
			this.setCookie("hiido_ui", this.ui, 7, "/", "."
					+ this.topLevelDomain())
		}
	},

	webonload : function(adIds) {
		this.readAndWriteHiido_ui();
		var hiidoUrl = "http://ylog.hiido.com/c.gif?act=webadonload&aid="
				+ adIds + "&ui=" + this.ui + "&lp=" + this.lp;
		var img = new Image();
		img.src = hiidoUrl;
	},

	webadclick : function(adId) {
		var t = new Date();
		if (adId == this.adId) {
			if (this.runTime && (t - this.runTime) < 200) {
				return;
			}
		}
		this.adId = adId;
		this.runTime = t;
		this.readAndWriteHiido_ui();
		var hiidoUrl = "http://ylog.hiido.com/c.gif?act=webadclick&aid=" + adId
				+ "&ui=" + this.ui + "&lp=" + this.lp;
		var img = new Image();
		img.src = hiidoUrl;
	}

};
var flashadclick = function() {
	'object,embed'.replace(/[^,]+/g, function(key) {
		var objList = document.getElementsByTagName(key);
		for ( var i = 0, len = objList.length; i < len; i++) {
			var adid = objList[i].getAttribute('fadid');
			if (adid) {
				(function(adid) {
					var mouseDown = objList[i].onmousedown;
					objList[i].onmousedown = function(e) {
						if(typeof mouseDown == "function") mouseDown.call(this,arguments);
						e = e || event;
						var t = e.button;
						t = !+ [ 1, ] && t == 1 ? 0 : t;
						if (t == 0) {
							adStat2Hiido.webadclick(adid);
						}
						return true;
					}
				})(adid);
			}
		}
	});
};
var adclick = function() {
	if (typeof jQuery == 'undefined') {
		loadJq();
	} else {
		jQuery('[adid]').click(function() {
			adStat2Hiido.webadclick(jQuery(this).attr("adid"))
		});
	}
}

var loadJq = function() {
	var scriptBlock = document.createElement("script");
	scriptBlock.src = "";
	scriptBlock.src = "http://www.duowan.com/public/assets/sys/js/jquery-1.7.2.min.js";
	scriptBlock.onload = function() {
		adclick();
	}
	document.getElementsByTagName("head")[0].appendChild(scriptBlock);

}

if (typeof window.addEventListener != "undefined") {
	if (document.market_loadids != null && document.market_loadids != "") {
		window.addEventListener("load", function() {
			adStat2Hiido.webonload(document.market_loadids.replace(/,/g, "|"));
		});
	}
	window.addEventListener("load", flashadclick, false);
	window.addEventListener("load", adclick, false);
} else {
	//ie
	if (document.market_loadids != null && document.market_loadids != "") {
		window.attachEvent("onload", function() {
			adStat2Hiido.webonload(document.market_loadids.replace(/,/g, "|"));
		});
	}
	window.attachEvent("onload", flashadclick);
	window.attachEvent("onload", adclick);
}