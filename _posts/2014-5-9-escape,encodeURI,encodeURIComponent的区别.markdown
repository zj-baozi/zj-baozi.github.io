---
layout: post
title:  escape,encodeURI和encodeURIComponent的区别
date:   2014-05-9 20:18:21

categories: 转载
---


今天听到一篇关于编码的分享，对于escape,encodeURI,encodeURIComponent的区别确实没仔细研究过，于是上网查一些资料，以记录。


一、escape和它们不是同一类
**简单来说，escape是对字符串(string)进行编码(而另外两种是对URL)，作用是让它们在所有电脑上可读。
编码之后的效果是%XX或者%uXXXX这种形式。
其中 ASCII字母 数字 @*/+ 这几个字符不会被编码，其余的都会。**
最关键的是，当你需要对URL编码时，请忘记这个方法，这个方法是针对字符串使用的，不适用于URL。
二、最常用的encodeURI和encodeURIComponent

对URL编码是常见的事，所以这两个方法应该是实际中要特别注意的。
它们都是编码URL，唯一区别就是编码的字符范围，其中
encodeURI方法不会对下列字符编码 ASCII字母 数字 ~!@#$&*()=:/,;?+'
encodeURIComponent方法不会对下列字符编码 ASCII字母 数字 ~!*()'
所以encodeURIComponent比encodeURI编码的范围更大。
实际例子来说，encodeURIComponent会把 http:// 编码成 http%3A%2F%2F 而encodeURI却不会。

总结：

**escape对0-255以外的unicode值进行编码时输出%u****格式，其它情况下escape，encodeURI，encodeURIComponent编码结果相同。**

**escape不编码字符有69个：*，+，-，.，/，@，_，0-9，a-z，A-Z**

**encodeURI不编码字符有82个：!，#，$，&，'，(，)，*，+，,，-，.，/，:，;，=，?，@，_，~，0-9，a-z，A-Z **

**encodeURIComponent不编码字符有71个：!， '，(，)，*，-，.，_，~，0-9，a-z，A-Z**



三、最重要的，什么场合应该用什么方法

1、如果只是编码字符串，不和URL有半毛钱关系，那么用escape。


2、如果你需要编码整个URL，然后需要使用这个URL，那么用encodeURI。
比如
encodeURI("http://www.cnblogs.com/season-huang/some other thing");

编码后会变为
"http://www.cnblogs.com/season-huang/some%20other%20thing";

其中，空格被编码成了%20。但是如果你用了encodeURIComponent，那么结果变为

"http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2Fsome%20other%20thing"

看到了区别吗，连 "/" 都被编码了，整个URL已经没法用了。
3、当你需要编码URL中的参数的时候，那么encodeURIComponent是最好方法。

var param = "http://www.cnblogs.com/season-huang/"; //param为参数
param = encodeURIComponent(param);
var url = "http://www.cnblogs.com?next=" + param;
console.log(url) //"http://www.cnblogs.com?next=http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2F"

看到了把，参数中的 "/" 可以编码，如果用encodeURI肯定要出问题，因为后面的/是需要编码的。

参考地址：

http://www.zhihu.com/question/21861899/answer/20300871
http://blog.csdn.net/swc493197713/article/details/7589772
http://www.92csz.com/03/986.html
