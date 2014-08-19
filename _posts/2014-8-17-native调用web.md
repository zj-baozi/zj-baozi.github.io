---
layout: default
title: Native调用web
category: 跨终端
comments: true
---

## Native调用web

无论是android还是ios,Native调用web(javascript)都有很好的原生支持





### android中的调用方式

**webview是Webview的实例**

注意开启js支持


```
webView.getSettings().setJavaScriptEnabled(true);
// 从assets目录下面的加载html  
contentWebView.loadUrl("file:///android_asset/wst.html");  

//js调用
webview.loadUrl('javascript:(function(){alert('ok');})');

//aa是js的函数test()的参数
webView.loadUrl("javascript:test('" + aa+ "')"); 
```


### ios中的调用方式

**UIWebView是ios系统中用来嵌入html、doc等文件的组件，主要用于在native app中嵌入网页，适用于经常需要升级、改版的应用，比如淘宝客户端。**

uiWebView中提供了stringByEvaluatingJavascriptFromString方法，它将javascript代码嵌入到页面中运行，并将运行结果返回。


```
[webview stringByEvaluatingJavascriptFromString: @"alert ('ok')"];
```

执行上面的代码，页面的javascript会执行alert ('ok')，并返回给UIWebView。

目前ios 为 Html5 提供一些API以便调用系统组件功能，如ios6中 Mobile safari支持调用摄像头，只需要插入如下代码：

```
<input type="file" capture="camera" accept="image/*" id="cameraInput">
```
这些API随着系统更新不断补充、完善、淘汰。而这些API的实现，我猜测也是基于以上的原理，只不过系统替开发者封装好了通信的部分，具体如何有待研究。

ios 的safari 不只基于UIWebView，还有apple 私有的uiwebbrowserview组件，这个组件对第三方浏览器来说是不能使用的，所以在ios上相对于safari，其他浏览器实现一些功能的时候需要用javascript实现。

参考地址

[挺帅的移动开发专栏](http://blog.csdn.net/wangtingshuai/article/details/8631835)