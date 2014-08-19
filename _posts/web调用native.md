---
layout: default
title: web调用Native
category: 跨终端
comments: true
---

## web调用Native

"Native调用web"本质上是Javascript脚本的动态执行，在“web调用Native”的场景下由于目前Native语言（Java和Objective-C）不容易像javascript那样便于动态执行，所以需要另辟蹊径。





### android中的调用方式

#### 1、重写WebViewClient.shouldOverrideUrlLoading
当页面内的url发生变化时，如点击链接、执行javascript(如location.href = 'http://*')等均会触发WebviewClient.shouldOverrideUrlLoading，通过将web调用Native的数据封装在URL，再由Native解析数据并执行响应Native方法。

```
class myWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            //ToDo 解析URL并触发Native代码
                        return true;
        }

    }

```

以下来自
[Hybrid应用中JS和Native互相调用的各种方式和原理
](http://www.atatech.org/articles/20637)

#### window.location
JS里设置window.location时，会被shouldOverrideUrlLoading（iOS是delegate的shouldStartLoadWithRequest）拦截到，可以处理后告诉WebView是不是真的变更url。
这个可以被利用和evaluateJavascript/

stringByEvaluatingJavaScriptFromString配合一下，让JS调用Native方法。

当JS需要调用一个Native方法的具体步骤如下：

a) js先把回调function挂在window下

b) js把window.location设置成一个和native层约定好的url，这个url包含本次调用的所有信息，比如方法名字，参数，挂在windows下的回调名字

c) native层在shouldOverrideUrlLoading/shouldStartLoadWithRequest会得到上一步js传过来的url，按照约定解析后执行，让WebView不要真的去加载这个url

d) native执行完后用1)里的方法，调用挂在window下的回调，并将返回值作为参数带给这个回调方法

e) 从window下摘掉回调function，释放资源

**PhoneGap, windvane等都是类似这种方式实现的。这种方式暴露给JS的方法都是异步的，如果想要同步调用，比如只是取个状态之类瞬间就能完成的调用，还要写回调，就太麻烦了。**

#### 2.重写WebChromeClient.onJsPrompt，或onJsConfirm，或onJsAlert，以WebChromeClient.onJsPrompt为例

```
aaa
```
**当执行“window.prompt({})” 这样的Javascript代码时，将会触发WebChromeClient.onJsPrompt.**

#### 3.WebView.addJavacriptInterface,这种方式和前两种都不同，通过将JavaObject(A)映射为Javascript Object (B),从而调用B.func1时将会自动触发A.func1,通过这种原生的方式实现了“web调用Native”

```
aaa
```

####结论：最常用的是方式2，方式2相比方式1有内置的队列支持，不会出现高频访问数据丢失的情况；方式3是原生方式，不灵活。

参考地址：
[http://www.myexception.cn/web/418930.html](http://www.myexception.cn/web/418930.html)
## ios中的调用方式
ios中可用的方式类似android中的WebViewClient.shouldOverrideUrlLoading，通过监控WebView的URL变化实现Web调用Native,

shouldStartLoadWithRequest

```
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType

{

NSString *urlString = [[request URL] absoluteString];

urlString = [urlString stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];// url decode

​

if([urlString hasPrefix:@"protocol://"]) {

// 业务逻辑，例如UIAlertView弹出，通过urlString进行参数获取

}

}


```
