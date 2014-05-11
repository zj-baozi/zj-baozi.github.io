/**
 * cookie get、del
 *
 */
KISSY.add(function(require, exports, module) {
    exports = {};

    exports.isCookieEnable=function(){

    };

    exports.getCookie=function(name){
      var name = name + '=',
          cookieLen = document.cookie.length,
          start,
          end;
      if(cookieLen > -1){
          start = document.cookie.indexOf(name);
          if(start > -1){
              start = start+ name.length; //获得cookie的起始部分
              end = document.cookie.indexOf(';',start);
              if(end ==- -1){
                  end = cookieLen;
              }
              return unescape(document.cookie.substring(start,end));
          }

      }
        return ''
    };
    /**
     * 将cookie设置到taobao域下
     */
    exports.setCookie=function(key,value){
        var expires = arguments.length >2 ?  arguments[2]:null;
        var host = window.location.host;
        var index =host.indexOf('.');
        var subDomain = host.substr(0,index);
        if(subDomain != 'waptest' && subDomain != 'wapa' && subDomain != 'm' && (host.indexOf("taobao") > -1 || host.indexOf("tmall") > -1)) {
            host = host.substr(index + 1);
        }
        if(expires === null){
            document.cookie = key + '=' + escape(value)+';path=/;domain='+host;
        }else{
            var expDate = new Date();
            expDate.setTime(expDate.getTime()+expires*1000);
            document.cookie = key +'=' + escape(value) + ';path=/;domain='+host+'expires='+expDate.toGMTString();
        }
    };
    exports.delCookie=function(){

    };
});
