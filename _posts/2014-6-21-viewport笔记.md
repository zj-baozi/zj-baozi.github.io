---
layout: default
title: about media query
category: viewport 跨终端
comments: true
---


对于准备做手机h5开发的同学来说，页面布局应该用多大，是困扰我们的第一个问题。
我们看到iphone5s的参数介绍里写着 **主屏分辨率: 1136x640像素** ，

这个分辨率能赶上很多PC机19寸显示器的分辨率了，但是按照这个分辨率来布局显然不行

有些同学看过资料，知道加上下面这句，手机上看网页内容会变得“正常”

```
<meta name="viewport" content="width=device-width,initial-scale=1">
```
那么这个设置到底做了哪些事情？

相关的介绍非常多，不过一直没仔细研究，很多问题都是一知半解。

这两天花了点时间梳理了一下，搞明白了一些概念。

以下是我的学习笔记：

## 一、主屏分辨率和主屏尺寸

主屏分辨率和主屏尺寸是我们最关注的手机pad等设备的参数，这两个参数是设备硬件参数。例如 IPHONE 5S ：

1. 主屏分辨率: 1136x640像素

2. 主屏尺寸: 4.0英寸

在PC显示器上，我们通常都是按照设备主屏的分辨率来做页面布局的。例如之前的主流分辨率是1024*768，我们基本上都采用定宽950px居中布局。

不过PC机的显示器是19英寸，如果在手机上也按照主屏分辨率布局，后果就是把以前19英寸上显示的内容缩小到4英寸的大小，显然我们无法看清显示的内容。

所以，首先我们得了解分辨率以及物理尺寸两个概念。

### 1.1 主屏分辨率
主屏分辨率也叫**设备分辨率（Device Resolution）**

我们通常说的分辨率就是指设备分辨率，这个分辨率是指每英寸的面积上可产生的像素点，分辨率越高代表可以将画面显示得更精细。

（有时候获取的显示器分辨率，其实是指桌面设定的分辨率，而不是显示器的物理分辨率。大多数情况下，我们设置的分辨率与物理分辨率一致，显示效果才最佳。）

度量单位 PPI（pixels per inch）

显示器的分辨率，我们一般都是按照例如1024*768这种说法，但其实分辨率是有自己的单位的。可能是大家觉得1024*768这种说法比PPI直观。

**换算也很简单：**

假设显示器的屏幕大小为14英寸，即对角线长度为14英寸，

纵横比为3:4，

则水平方向长度为 14*(4/5)=11.2英寸

从而显示分辨率为 1024/11.2 = 91.4 PPI。

所谓Retina屏，其实就是PPI高到人眼识别的极限，下面会简单讲一下。

**DPI和PPI的区别**

DPI（dots per inch）是一个专属于打印机的墨点级分辨率单位，其意指每英寸所打印的墨点的数目。打印机输出的每个像素都是由若干个不同颜色的墨点拼合而成的。可以认为墨点是更小的像素，称为子像素。

关于DPI与PPI的区别三两句也讲不清楚，有兴趣的可以搜索下相关资料。

### 设备分辨率

可以通过screen.width/screen.height来查看设备的分辨率。（上面提到过，在PC上获取的设备分辨率有可能是用户设置的桌面分辨率）

设备的分辨率与浏览器设置无关，比如我们进行了缩放。

手机的设备分辨率，与我们写页面布局，几乎没有什么关系。

某些场景下设备分辨率又被称为“设备像素”，下面还有一个关于“CSS像素”的概念

####1.2 屏幕尺寸

屏幕尺寸就是指屏幕的物理尺寸，一般都是以英寸为单位，也有以寸为单位的。

注意英寸和寸的区别：1英寸=0.762寸。记得以前很多奸商在这个单位上做文章，忽悠消费者。

屏幕尺寸根我们要讨论的页面布局几乎没有什么关系,所以不详细讨论。

####1.3 Retina
Retina显示屏（英文：Retina Display）具备足够高像素密度而使到人体肉眼无法分辨其中单独像素点的液晶屏，最初采用该种屏幕的产品iPhone 4由执行长史蒂夫·乔布斯于WWDC2010发布，其屏幕分辨率为960×640（每英寸像素数326ppi）。这种分辨率在正常观看距离下足以使人肉眼无法分辨其中的单独像素。

Retina的标准为：人眼看不到看不见单个物理像素点。

因为不同设备在使用状态下与人眼的距离不同，所以不同设备满足Retina标准的PPI也会不同。距离越小，PPI要求越高。

在iPad(3rd-Gen)发布会上，苹果给出了Retina设计标准的公式:
![](http://gtms01.alicdn.com/tps/i1/T1YNjYFf8dXXbrqnbb-146-51.png)
![](http://gtms01.alicdn.com/tps/i1/T1HCTUFfXdXXb5KEDE-684-532.png)

其中a代表人眼视角，h代表像素间距(pixel pitch)，其实就是一个像素的大小，d代表肉眼与屏幕的距离。符合以上条件的屏幕可以使肉眼看不见单个物理像素点。

而人眼视角小于或等于1角分(π/10800 弧度)的情况下，无法看见单个像素点。于是可得出Retina标准的PPT计算公式为：-

所以假如人眼与屏幕的尺寸为11英寸，那么通过公式可得PPI = 312，而实际上 iPhone 4/4S 的 PPI 是 330,符合retina的要求。

##二、像素、设备像素、CSS像素

要搞清楚文章最开始提出的问题，这个三个名词一定要弄明白。

hax写了一篇文章[像素（px）到底是个什么单位](http://hax.iteye.com/blog/374323)，非常有助于我们理解这三个名词，建议读一读。

下面我也按照我的理解分析一下。

###2.1 像素
引用[维基百科-像素](http://zh.wikipedia.org/wiki/%E5%83%8F%E7%B4%A0)

像素，又称画素，为图像显示的基本单位，译自英文“pixel”，pix是英语单词picture的常用简写，加上英语单词“元素”element，就得到pixel，故“像素”表示“图像元素”之意，有时亦被称为pel（picture element）。每个这样的信息元素不是一个点或者一个方块，而是一个抽象的采样。仔细处理的话，一幅图像中的像素可以在任何尺度上看起来都不像分离的点或者方块；但是在很多情况下，它们采用点或者方块显示。每个像素可有各自的颜色值，可采三原色显示，因而又分成红、绿、蓝三种子像素（RGB色域），或者青、品红、黄和黑（CMYK色域，印刷行业以及打印机中常见）。照片是一个个采样点的集合，故而单位面积内的像素越多代表分辨率越高，所显示的图像就会接近于真实物体。

###2.2 设备像素
设备像素其实就是指上面讲过的设备分辨率。之前听有些同学理解手机上的布局，说要以设备像素为准，其实是不对的，应该是visual viewport，后面会讲到。

###2.3 CSS像素
CSS像素就是指我们在写页面布局用得最多的单位（px）。

CSS像素是浏览器使用的抽象单位，用来在网页上绘制内容，CSS像素占的物理空间大小是不确定的。

在PC上，浏览器会给我们默认计算好1px占多少物理尺寸，以便让我们看得更舒服。
浏览器对页面进行缩放，其实是缩放CSS像素占的物理空间大小

另外，hax的文章中提到，有些同学不建议使用px作为布局单位其实存疑的，因为不同的设备、浏览器会计算好1px所占的物理空间大小，我们无需关心太多。

##三、viewport
###3.1 viewport

viewport产生的背景

几年前，我们做的网站都是为PC浏览器而设计的，几乎没考虑到手机屏幕，所以用手机浏览为PC定制的网站会出现问题。

固定宽度的网站，比如经典950的，网页会出现横向滚动条，这还好，至少可以浏览。

但如果是浏览流动布局的网页那情况会非常糟糕，设想一个宽度为 30% 的侧边栏对于 320px 手机屏幕而言也就 96px，只能容纳八个 12px 的汉字，可阅读性非常差。

为了让手机也能获得良好的网页浏览体验，Apple 找到了一个办法：在移动版的 Safari（iOS平台）中定义了 viewport meta 标签，它的作用就是创建一个虚拟的窗口（viewport），而且这个虚拟窗口的分辨率接近于桌面显示器，Apple 将其定位为 980px。

我们通常把这个虚拟的窗口叫，布局窗口（layout viewport）。
例如我们写一个宽度为100%的页面在iPhone5s上浏览，页面宽度是980px。

在Apple实现viewport后，其他浏览器也加入了对viewport meta的支持，但彼此间还是有些差异，差异最大的是layout viewport的大小上：

Safari iPhone: 980px

Opera: 850px

Android WebKit: 800px

IE: 974px

在没有viewport设置的情况下，我们很容易可以拿到布局窗口的值：

```
console.log(document.documentElement.clientWidth);

console.log(document.documentElement.clientHeight);
```
设置viewport

```

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
</head>
```

这个是最常见的一条 viewport meta 代码，将 viewport 定义为：宽度为设备宽度，初始缩放比例为 1 倍，禁止用户缩放。

viewport 全部属性如下：

```
width: viewport宽度

height: viewport高度

initial-scale: 初始缩放比例

maximum-scale: 最大缩放比例

minimum-scale: 最小缩放比例

user-scalable: 是否允许用户缩放
```
详细介绍可以看看 [Safari对viewport的实现](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW1)

虽然布局窗口（layout viewport）解决了手机浏览PC定制网页的问题，但是移动时代，很多网站就是为移动定制的。

所以，在无线时代，可视窗口（visual viewport）的大小才是我们真正关系的。

layout viewport (布局窗口) & visual viewport (可视窗口)

关于什么是layout viewport 什么是visual viewport，两个viewport的故事《[1](http://weizhifeng.net/viewports.html)》《[2](http://weizhifeng.net/viewports2.html)》 中有比较详细的介绍

引用他们的两个图，便于我们理解：
![](http://gtms01.alicdn.com/tps/i1/T17ScdFcddXXbE78n0-380-519.jpg)

顺便引用下他们的比如：

把layout viewport想像成为一张不会变更大小或者形状的大图。现在想像你有一个小一些的框架，你通过它来看这张大图。（译者：可以理解为「管中窥豹」）这个小框架的周围被不透明的材料所环绕，这掩盖了你所有的视线，只留这张大图的一部分给你。你通过这个框架所能看到的大图的部分就是visual viewport。当你保持框架（缩小）来看整个图片的时候，你可以不用管大图，或者你可以靠近一些（放大）只看局部。你也可以改变框架的方向，但是大图（layout viewport）的大小和形状永远不会变。

layout viewport 和 visual viewport 是我们理解viewport的关键。但是看了各种文章，也都没给他们一个确切的定义，而且都比较绕。

我是这么理解这两个概念的：

在没有viewport这个概念之前，页面布局只有visual viewport这一个概念，无论是手机还是PC机。PC上的visual viewport通常是1280这么大的分辨率，但是由于手机屏幕比较小，通常只有320。为了在PC上定制的网页在手机上浏览有比较好的体验，于是引用了layout viewport这个概念。

##四、width=device-width
字面意思是设置宽度（布局宽度）等于设备宽度，但在实际中大多数浏览器都给出了个定值320px；

这句话里面有三个关键词：

大多数： 大多数包括safari，老一点android上的chrome，随着4,5寸屏的市场份额增加，这个值也在变大。

320px： 为什么是320px呢，据说这个值源于 Apple，因为早期 iPhone 的分辨率为 320px × 480px，大量为 iPhone 量身定制的网站都设置了width=device-width，并且按照宽度 320px 来设计制作，所以其他浏览器加入 viewport 支持时为了兼容性也将 device-width 定义为了 320px。

浏览器： 最开始我以为device-width就是设备的某个值，至少同一个设备这个值是滚动的，测试后发现，同一个设备不同的浏览器这个值竟然不同。比如我的三星E120L（刷了小米系统），原生浏览器是320px，但是UC,QQ都是360px;

**不同型号的手机这么多，浏览器也很多，意味着device-width的值也会很多，手机页面到底应该按照什么宽度来设计呢？**

估计很多同学只关心这个问题的**结论**，说下我的观点吧：

我觉得这和PC时代的思路是一样的，只是我们又走了一次这个轮回。
记得最早PC显示器的分辨率是800*600，于是多数网页是按照760的定宽来设计的
后来1024*768成了主流，于是950定宽成了设计标准。

现在手机主流就是320px,如果做定宽的设计，320px这个取值没错。

不过遇到更大分辨率的手机，比如480px，大家似乎不太能接受固定320px然后居中对齐，所以我们通常是100%宽度来布局的。

大家似乎也都是这么做的！

终于整理完了，虽然自己读起来感觉也不是那么通顺，不过如果大家决定彻底弄懂相关的概念，我的大纲到是可以参考下。

转自：[
转自：http://www.atatech.org/article/detail/12233/786](http://www.atatech.org/article/detail/12233/786)

参考资料：
[http://i-skool.co.uk/mobile-development/web-design-for-mobiles-and-tablets-viewport-sizes/](http://i-skool.co.uk/mobile-development/web-design-for-mobiles-and-tablets-viewport-sizes/)

[两个viewport的故事 一](http://weizhifeng.net/viewports.html)
[两个viewport的故事 二](http://weizhifeng.net/viewports2.html)
(这两篇文章讲得真好，需要再好好看看。)