---
layout: default
title: about media query
category: 响应式 笔记
comments: true
---


About Media Queries
 

[http://lessframework.com/](http://lessframework.com/)

[http://bradfrost.github.io/this-is-responsive/patterns.html](http://bradfrost.github.io/this-is-responsive/patterns.html)

[http://alistapart.com/article/responsive-web-design](http://alistapart.com/article/responsive-web-design)

正如上面提到的几个link所展示的一样，当前的响应式排版实现基本都是基于media query这个css3 的feature。

##什么是Media Queries

A media query consists of a media type and at least one expression that limits the style sheets' scope by using media features, such as width, height, and color. Added in CSS3, media queries let the presentation of content be tailored to a specific range of output devices without having to change the content itself.
Media Queries是由一个 media type ,加上一个或多个 media feature 的表达式组成。这个组成会被浏览器解析出结果 True or False。如果当前终端的显示文档的type符合这个query指定的type或conditions,那么这个query里面所有的表达式都会被解析执行。

Media Queries可以指定为两种形式，一种是在一个 link element 里面，一种是用在 style sheet里面。比如：


```
<!-- CSS media query on a link element -->
< link rel="stylesheet" media="(max-width: 800px)" href="example.css" />

<!-- CSS media query within a style sheet -->
< style>
@media (max-width: 600px) {
  .facet_sidebar {
    display: none;
  }
}
</style>

```


当query为true的时候，里面的表达式都会以css层叠样式应有的方式apply到页面中。但是这其中有个猫腻，就是当media query应用到link element中的时候，即时这个query并没有match，这个link请求依然会被下载，只是content没有被解析执行而已。style sheet中的media query就更是如此。

Media type [Media]Logical operators Media features

Media queries的query包含标题如示几个部分，我们一个一个来说。

Media type
```
@media <media types> {
  /* media-specific rules */
}

/* for example */
@media (min-width: 700px), handheld and (orientation: landscape), not screen and (color) { ... }
```

可以指定的type

all 适配于所有设备

braille 用于支持盲文触摸反馈的设备

embossed 盲文分页打印设备

handheld 适配于手持设备，典型小屏+有限带宽

print 适配于可分页的文件或者材料在打印预览模式下的排版

projection 用于投影的显示，例如投影仪设备等

screen 主要用于彩色电脑屏幕

speech 用于语音合成，语音输出的设备读屏。【听觉样式表】

tty 用于使用固定间距的字符网格的媒体设备（比如，电传打字机，一些传真机，以及一些显示能力有限的便携设备，需要注意的是，在这种type下，不要使用px这种像素单位）

tv 用于电视设备，特指一些带声音输出的，分辨率低，颜色，有限的可滚动屏幕。

比如：

```
@media screen {
  body { font-size: 14px }
}
@media screen, print {
  body { line-height: 1.5 }
}
```

[Media]Local operators

**not** 易于理解，即表示‘非’的含义，注意的是not的作用范围只针对当前的query语句，不会影响逗号分隔的其他query语句。

@media not screen and (color), print and (color)

**and** 表示多个media查询组合，比如多个media type的组合，或者media type和media features间的组合。用and连接起来的query，需要全部match，整个表达式才生效。比如：
@media tv and (min-width: 700px) and (orientation: landscape) { ... }

**only** 顾名思义，只给支持的设备使用，阻止不支持某种features的设备去解析使用。

@media only screen 
and (min-device-width : 768px) 
and (max-device-width : 1024px)  { 
	.selector{}
}

comma-separated lists 即我们通常说的逗号, ，逗号的作用相对于 and 来说，更像是表达 ‘或’ 的含义，即用逗号分隔几条query，只要有其中任何一条match，那么整个表达式就生效。而且逗号分隔的query语句不相互影响。比如：

@media (min-width: 700px), handheld and (orientation: landscape) { ... }

**还有一点，逗号间隔的query语句虽然不相互影响。但是在match判断的时候依旧有先后顺序，亦即在前面的语句没有match上的时候，才会去匹配后面的语句。**

Media features

**color** 限制设备输出的颜色分量的bit数。如果非彩色设备，值为0。支持min,max这样的前缀。比如：

@media all and (color) { ... }

@media all and (min-color: 4) { ... }

**color-index** 限定设备所支持的颜色查找表中的条目数。支持min,max前缀

@media all and (min-color-index: 256) { }

**aspect-ratio** 限定设备显示区域的横纵显示比，约定的表达值由/分开，前一个数字表示横向比，后一个为纵向比。同样支持min,max前缀。同时还能替代landscape的表达，比如：

@media screen and (min-aspect-ratio: 1/1) { ... }

上面这条query语句含义其实就限制了只能是 方屏 或者 横屏 时，能match上

**device-aspect-ratio** 限定设备的宽高比，aspect-ratio的派生。

@media screen and (device-aspect-ratio: 16/9) {}

比如上面语句就限定设备宽高比为16：9时match。

**device-width** 顾名思义，设备宽，支持min,max前缀。

**device-height** 和device-width类似。例如

< link rel="stylesheet" media="screen and (max-device-width: 799px) and (device-height: 600px)" />

**width, height 和device-width, device-height类似，不同的地方在于加device-前缀的都是指设备级别的宽高，通常是整个屏幕。而不加device-的通常是表示渲染区域的宽高，比如document window一类。**

**比如以pc端为例，浏览器resize的时候，width,height的变化会触发，但是device-width, device-height就不会。**

@media only screen and (max-width: 768px) and (max-height: 480px) {}

**grid** 判定设备是 grid device 还是 bitmap device. 比如像一些TTY的终端或者蓝屏手机等设备就是 基于网格 grid-base 的显示设备。

注意通常和 grid 判定配合的时候，都不用px单位。

@media handheld and (grid) and (max-width: 15em) { ... }

**monochrome** 限定单色设备，以及单色设备的每像素的bit位。支持min,max前缀。非单色设备的monochrome值为0

@media all and (min-monochrome: 8) { ... }

**orientation** 判定设备状态是“横屏”或者“竖屏” landscape | portrait

@media screen and (orientation: landscape) { ... }

**resolution** 判定设备的像素密度，单位dpi，支持min, max前缀。比如

@media screen and (min-resolution: 325dpi) { ... }

上面的判定就匹配彩色显示屏像素密度大于325dpi的设备，比如Retina的iphone。

**scan** 特定用于media type 为 tv 的判别，用来限定tv设备的扫描过程，progressive | interlace ,渐进或者交错。

@media tv and (scan: progressive) { ... }

**此外还有一些没有规范的带浏览器厂商前缀的 Media features。比如带上 -webkit-, -moz- :**

images-in-menus
mac-graphite-theme
maemo-classic
**device-pixel-ratio**
scrollbar-end-backward
scrollbar-end-forward
scrollbar-start-backward
scrollbar-start-forward
scrollbar-thumb-proportional
touch-enabled
windows-classic
windows-compositor
windows-default-theme
windows-theme

**其中比较有用的如device-pixel-ratio。配合resolution侦探设备像素密度。**

```
@media (-webkit-min-device-pixel-ratio: 2), /* Webkit-based browsers */
       (min--moz-device-pixel-ratio: 2),    /* Older Firefox browsers (prior to Firefox 16) */
       (min-resolution: 2dppx),             /* The standard way */
       (min-resolution: 192dpi)             /* dppx fallback */ 
```
响应区间的约定

上面说了这么多，基本都是在说Media query怎么来用。有了这个基础，我们接下来谈谈利用Media Queries怎么来安排响应式的实现。 基本上从上面列出的features一个个数下来。重头戏一定落在
**
device-width**

**device-height**

**width**

**height
**
这几个上面。
从终端设备出发，当前主流终端 基本布局在 phone > pad > pc上，其中phone的尺寸按市场占有率最大规模的就是device-width 320px 和宽屏的 480px的phone。

现在的pad设备主流都在 1024x768, ipad mini 亦是如此。

再过渡到pc，先不论浏览器的resize，按全屏的device-width算，从原始的800开始，一直过渡到当今的1680宽屏，中间间隔了1024，1152， 1280， 1360 等主流屏宽。

至此，我们适配主流终端屏的区间分隔就大致出来了。

我比较赞同的是类似 less framework 那样的区间分隔。类似：

/*		Default Layout: 992px. 
		Leftover space for scrollbars @1024px: 32px.
-------------------------------------------------------------------------------
cols    1     2      3      4      5      6      7      8      9      10
px      68    160    252    344    436    528    620    712    804    896    */

body {
	-webkit-text-size-adjust: 100%; /* Stops Mobile Safari from auto-adjusting font-sizes */
}



/* WIDE DESKTOP LAYOUT
----------------------------------------------- */
@media only screen and (min-width: 1176px) {

}


/*		Tablet Layout: 768px.
		Inherits styles from: Default Layout.
-----------------------------------------------------------------
cols    1     2      3      4      5      6      7      8
px      68    160    252    344    436    528    620    712    */

@media only screen and (min-width: 768px) and (max-width: 991px) {
    
}



/*		Mobile Layout: 320px.
		Inherits styles from: Default Layout.
---------------------------------------------
cols    1     2      3
px      68    160    252    */

@media only screen and (max-width: 767px) {

}



/*		Wide Mobile Layout: 480px.
		Inherits styles from: Default Layout, Mobile Layout.
------------------------------------------------------------
cols    1     2      3      4      5
px      68    160    252    344    436    */

@media only screen and (min-width: 480px) and (max-width: 767px) {

}


/*	Retina media query.
	Overrides styles for devices with a 
	device-pixel-ratio of 2+, such as iPhone 4.
-----------------------------------------------    */

@media 
	only screen and (-webkit-min-device-pixel-ratio: 2),
	only screen and (min-device-pixel-ratio: 2) {
	
}
当然，PC端的屏宽粒度分隔可以再细化，但是个人觉得，如此几个区间，基本已够用。
至于为什么要按如此的思路来做样式的继承，我下面接着说。

区间之间样式的继承

为什么需要做上面继承关系的安排，首先我们需要考虑两个问题：

任何设备下的样式完整性
代码冗余度和关联度
样式完整性

我们要做一个 media width 从 320 过渡到1024 的响应式设计和实现。同样按照上面的区间分隔，假设这样做，有什么问题呢？

```
/* Default Layout */
...
/* Media */
@media only screen and (min-width: 1024px) {

}

@media only screen and (min-width: 768px) and (max-width: 1023px) {
    
}

@media only screen and (min-width: 480px) and (max-width: 767px) {

}

@media only screen and (min-width: 320px) and (max-width: 479px) {

}
```
如果这样做，320 之下的 样式就只能 来自 Default Layout, 也就不再是Mobile的Layout该有的样子了。
或许我们可以把最后一条改为：

```
@media only screen and (max-width: 479px) { }
```
让phone端样式分两套，480以上和以下来做。但是既然做到这一步了，为什么不再往前走一步。将Mobile端的 Defalut Layout抽离出来，首先 Mobile 的default layout直接定位于主流的320 layout，并且继承于 base 的default layout。然后 phone 的 pad的layout都继承 mobile 的layout。再次phone中，480的layout直接覆盖Mobile Layout中的部分样式，一点点扩展就能做出来。
至此，按上面的思路就是最开始代码的实现。


同时，将继承关系理顺之后你会发现一个好处，就是代码的冗余量会大大减少。

这也才是对于产品最直接的利益。

##最全的更多根据设备设置临界值参考


针对iphone&ipad：[http://stephen.io/mediaqueries/](http://stephen.io/mediaqueries/)

所有设备：[http://nmsdvid.com/snippets/](http://nmsdvid.com/snippets/)

## 响应式框架推荐

[MT-layout](https://github.com/chesihui/MT-Grid)：该框架基于 semantic 进行优化，底层基于 sass，易于定义你的栅格参数，扩展灵活；

[Mqa](http://gallery.kissyui.com/mqa/1.0/doc/index.html#!/guide/开始) : Mqa是一个简单媒体查询假名库, 是对浏览器原生的matchMedia做了一层简单的封装, 提供了更加方便简洁的事件接口以及媒体字符串的简写注册.目前作为KISSY Gallery的一个组件存在, 当然, 您只需做简单的修改就可以独立于KISSY运行(毕竟, 只用到了KISSY的Loader -.-!).

横竖屏的样式切换可以使用以下代码或写在style中来区分：

```
<link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css" />

<link rel="stylesheet" media="all and (orientation:landscape)" href="portrait.css" />

```
参考地址：[iPad Orientation CSS](http://www.qianduan.net/ipad-orientation-css.html)
