(function() {
    
    var statisticsUtil = {
        getScript: function(url, callback) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.charset = "utf-8";
            script.src = url;
            script.onload = script.onreadystatechange = function() {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    if (callback) {
                        callback();
                    }
                    script.onload = script.onreadystatechange = null;
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }
            };
            head.insertBefore(script, null);
        }
    };
    
    if (window.jQuery) {
        jQuery(dwSatistics);
    } else {
        statisticsUtil.getScript("http://assets.dwstatic.com/common/lib/jquery/1.11.3/jquery.min.js", function() {
            window.jQuery = window.$ = jQuery;
            jQuery(dwSatistics);
        });
    }
    
    function dwSatistics(){
        var url = 'http://daoliang.duowan.com/index.php?r=default/sum';
        //设置cookie
        var expireDate = new Date();
        var month = expireDate.getMonth() + 1;
        var date = expireDate.getDate();
        if( parseInt( month ) < 10 ){
            month = '0' + month;
        }
        if( parseInt( date ) < 10  ){
            date = '0' + date;
        }
        var cookieName = escape(expireDate.getFullYear()) + month + date + 'statistics';
        if ( -1 == document.cookie.indexOf(cookieName) ){
            var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
            var cookieValue = '';
            for(var  i=0;i<10;i++)  {
                cookieValue  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
            }
            var domain = '.duowan.com'; //域
            expireDate.setDate(expireDate.getDate()+1);//过期时间1天
            document.cookie = escape(cookieName) + '=' + escape(cookieValue) +';expires=' + expireDate.toGMTString() + ';domain=' + domain + ';path=/';
        }

        //链接的点击事件
        jQuery(document.body).on('click', 'a', function(){
            var href = jQuery(this).attr('href');
            if(typeof(href) == 'undefined'){
                return;
            }
            if( href.indexOf('http://') != -1 && href.indexOf('duowan.com') == -1 && href.indexOf('huanju.cn') == -1 && href.indexOf('dwstatic.com') == -1 ){
                var from = window.location.href;
                jQuery.getScript(url+'&fromUrl='+encodeURIComponent(from)+'&toUrl='+encodeURIComponent(href)+'&code='+(typeof _hiido_wid == "undefined" ? "" : _hiido_wid));
            }
        });
    }
    
})();