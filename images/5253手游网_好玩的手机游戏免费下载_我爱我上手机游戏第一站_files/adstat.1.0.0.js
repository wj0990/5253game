if(!window._adstat_){
	window._adstat_={
		ya:null,
		loadScrit:function(src,cfun) {
			var s = document.createElement('script');
			s.type='text/javascript';
			s.src = src;
			if(!+[1,]){
				s.onreadystatechange = function() { 
					var r = s.readyState; 
					if (r === 'loaded' || r === 'complete') { 
						s.onreadystatechange = null; 
						cfun(); 
					} 
				}; 
			}else{
				s.onload=cfun;
			}
			document.getElementsByTagName('head')[0].appendChild(s);
		},
		listenEvent: function(node, event, func){
			if (typeof node.addEventListener != "undefined") {
				node.removeEventListener(event, func, false);
				node.addEventListener(event, func, false);
			} else {
				node.detachEvent('on'+event, func);
				node.attachEvent('on'+event, func);
			}
		},
		reportEvent:function(eid,rsid,adid){
			if(!_adstat_.ya){
				_adstat_.ya=new YA.report.YYAnalytics('resource');
			}
			_adstat_.ya.reportProductEvent({eid:eid+'/'+rsid,adid:adid});
		},
		traverse:function(node){
			if(node._lsf_) return;
			var adid=null, fadid=null, rsid=null;
			for(var j = 0; j < node.attributes.length && !((adid || fadid) && rsid); j++){
				var attr=node.attributes[j];
				if(attr.nodeName=='dw_adid' || attr.nodeName=='adid'){
					adid=attr.nodeValue;
				}else if(attr.nodeName=='dw_fadid' || attr.nodeName=='fadid'){
					fadid=attr.nodeValue;
				}else if(attr.nodeName=='dw_rsid' || attr.nodeName=='rsid'){
					rsid=attr.nodeValue;
				}
			}
			if(adid && rsid){
				_adstat_.reportEvent('load', rsid, adid);
				node._lsf_=node._lsf_||function(){_adstat_.reportEvent('click', rsid, adid);}
				_adstat_.listenEvent(node,'click',node._lsf_);
			}else if(fadid && rsid){
				_adstat_.reportEvent('load', rsid, fadid);
				node._lsf_=node._lsf_||function(){_adstat_.reportEvent('click', rsid, fadid);}
				_adstat_.listenEvent(node,'mousedown',node._lsf_);
			}else if(node.childNodes.length){
				for(var i = 0; i < node.childNodes.length; i++){
					var child = node.childNodes[i];
					if(child.nodeType==1) _adstat_.traverse(child);
				}
			}
		},
		init:function(){
			if(typeof(YA)=='undefined'){
				_adstat_.loadScrit('http://sz.duowan.com/s/ya/ya.1.3.2-min.js',_adstat_.init);
			}else{
				_adstat_.traverse(document.body);
			}
		}
	}
	window._lsf_=window._lsf_||function(){_adstat_.init();}
	_adstat_.listenEvent(window,'load',window._lsf_);
}