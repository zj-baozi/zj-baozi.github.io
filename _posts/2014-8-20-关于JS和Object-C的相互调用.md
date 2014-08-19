---
layout: default
title: 关于JS和Object-C的相互调用
category: 跨终端
comments: true
---
为了更便捷的进行无线开发，很多时候都是H5和Native进行混合使用，

那么他们之间的相互调用是怎么进行的呢，以下是简单的Demo示例：

 
![](http://110.75.40.31/app/h5native.swf)
 

首先，我们在创建一些JS的测试方法


```
< script type="text/javascript">
  function test1() {
    setTimeout('window.location.href = "http://www.163.com"', 3000);
  }
 
  function test2(number){
    alert(number);
  }
 
  // 中文加入encodeURI
  var url = encodeURI("protocol://来个消息提醒|:|咋就不出汉字呢，oh my god");
  document.location = url;
</script>

 ```
 
其中test1是3秒后跳转至网易首页，test2是进行值传递测试，用于object-c调用js方法；

最后用于js调用object-c方法。
 
其次，我们看看ios中的方法

/* 创建一个webview，简单测试的页面文件呢，
可以直接下载tomcat7，在example的文件里改改就好了，js代码如上所示 */

```
UIWebView *webView = [[UIWebView alloc] initWithFrame:frame];

webView.delegate = self; // 代理方法，这个是调用的关键

[self.view addSubview:webView];

    

NSURL *url =[NSURL URLWithString:@"http://10.68.176.129:8080/examples/servlets/helloworld.html"];

NSURLRequest *request =[NSURLRequest requestWithURL:url];

[webView loadRequest:request];

 ```

使用代理方法，用于捕捉document.location，进行object-c的逻辑处理

```
​- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType

{

NSString *urlString = [[request URL] absoluteString];

urlString = [urlString stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];// url decode

​

if([urlString hasPrefix:@"protocol://"]) {

// 业务逻辑，例如UIAlertView弹出，通过urlString进行参数获取

}

}
```

使用代理方法，用于调用js的方法，页面加载完成后执行

```

- (void)webViewDidFinishLoad:(UIWebView *)webView

{

[webView stringByEvaluatingJavaScriptFromString:@"test2(112233);"];

[webView stringByEvaluatingJavaScriptFromString:@"test1();"];

​}
```
