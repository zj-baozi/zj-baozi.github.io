function getRequestParam(param,uri){
    var value;
    uri = uri || window.location.href;
    uri = uri.match('#') ? uri.match('#')[1] : uri;
    value = uri.match(new RegExp('[\?\&]' + param + '=([^\&\#]*)([\&\#]?)', 'i'));
    return value ? decodeURIComponent(value[1]) : value;
}