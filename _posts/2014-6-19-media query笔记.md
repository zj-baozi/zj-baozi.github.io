---
layout: default
title: media query笔记
category: 响应式 笔记
comments: true
---


Media query是由一个media type，加上一个或多个media feature的表达式组成。

##两种形式
1、link element里面
<link rel="stylesheet" media="(max-width:800px)" href="example.css" />

2、


```
< style>
@media (max-width:600px){
	.sidebar{
		display:none;
	}
}
</style>
```
##格式
```

@media <media types>{

}
//example
@media (min-width:800px),handheld and (orientation:landscape),not screen and (color){
...
}
```
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
not，作用域只针对当前query语句，不影响逗号分隔的其他字符。

aspect-ratio 限定设备显示区域的横纵显示比，以/分隔
@media screen and (min-aspect-radio:1/1){...}

device-aspect-ratio 限定设备的宽高比
@media screen and (device-aspect-ratio:16/9){...}

device-width 设备宽
device-height 设备高
width 屏幕宽
height 屏幕高

orientation 判定设备状态是“横屏”或者“竖屏” （landscape || portrait）
resolution 判定设备的像素密度，单位dpi
@media screen and (min-resolution:325dpi){...}
上面的判定匹配显示屏像素密度大于325dpi的设备，比如retina 的iphone
device-pixel-ratio 配合 resolution 侦探设备的像素密度。

**我们要做一个 media width 从 320 过渡到1024 的响应式设计和实现。同样按照上面的区间分隔，假设这样做，有什么问题呢？**

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

@media only screen and (max-width: 479px) { }
让phone端样式分两套，480以上和以下来做。但是既然做到这一步了，为什么不再往前走一步。将Mobile端的 Defalut Layout抽离出来，首先 Mobile 的default layout直接定位于主流的320 layout，并且继承于 base 的default layout。然后 phone 的 pad的layout都继承 mobile 的layout。再次phone中，480的layout直接覆盖Mobile Layout中的部分样式，一点点扩展就能做出来。
至此，按上面的思路就是最开始代码的实现。

同时，将继承关系理顺之后你会发现一个好处，就是代码的冗余量会大大减少。

这也才是对于产品最直接的利益。