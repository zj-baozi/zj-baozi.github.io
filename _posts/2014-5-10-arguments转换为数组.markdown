---
layout: post
title:  arguments转换为数组
date:   2014-05-10 20:18:21

categories: 转载
---



Array.prototype.slice.call(arguments,0);



实际参数在函数中我们可以使用 arguments 对象获得 （注：形参可通过 arguments.callee获得），虽然 arguments 对象与数组形似，但仍不是真正意义上的数组。

值得庆幸的是，我们可以通过数组的 slice 方法将 arguments 对象转换成真正的数组：
```
var args = Array.prototype.slice.call(arguments, 0);
```

对于slice 方法，ECMAScript 262 中 15.4.4.10 Array.prototype.slice (start, end) 章节有备注：
The slice function is intentionally generic; it does not require that its this value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method. Whether the slice function can be applied successfully to a host object is implementation-dependent.
《Pro JavaScript Design Patterns》（《JavaScript 设计模式》）的作者 Dustin Diaz 曾指出：
instead of…

```
var args = Array.prototype.slice.call(arguments, 0); // 怿飞注：下称方法一
do this…
var args = [].slice.call(arguments, 0); // 怿飞注：下称方法二
```

但二者的性能差异真的存在吗？经过个人简单测试发现：
在 arguments.length 较小的时候，方法二性能上稍有一点点优势，而在arguments.length 较大的时候，方法一却又稍有优势。
2010年1月30日更新（测试地址http://www.planabc.net/demo/toarray/arguments.html  已打不开了）：几经验证，性能差异不大，反而第一张方法性能稍优势一点，或许由于第二种方法创建新数组产生开销。

最后附上方法三，最老土的方式：

```
var args = [];
for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
}
```
不过对于平常来说，个人建议使用第一种方法，但任何解决方案，没有最好的，只有最合适：
var args = Array.prototype.slice.call(arguments, 0); 
---
如何将 NodeList （比如：document.getElementsByTagName('div')）转换成数组呢？
解决方案简单如下：

```
function nodeListToArray(nodes){
    var arr, length;

    try {
        // works in every browser except IE
        arr = [].slice.call(nodes);
        return arr;
    } catch(err){
        // slower, but works in IE
        arr = [];
        length = nodes.length;

        for(var i = 0; i < length; i++){
             arr.push(nodes[i]);
         }  

        return arr;
    }
} 
```

为什么 IE 中 NodeList 不可以使用 [].slice.call(nodes) 方法转换呢？

**In Internet Explorer it throws an error that it can't run Array.prototype.slice.call(nodes) because a DOM NodeList is not a JavaScript object.**

转自：http://www.planabc.net/2010/01/06/arguments_to_array/
