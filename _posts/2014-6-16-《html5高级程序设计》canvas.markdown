---
layout: post
title:  canvas
date:   2014-05-25 11:35:21


categories: 笔记 html5高级程序设计
---

canvas

```
<canvas></canvas>
```
默认情况下是一个300*150的矩形区域。
##坐标
默认从左上角开始，x轴沿着水平方向向右延伸，y轴沿垂直方向向下延伸。 左上角坐标为x=0,y=0的点称作原点。

##canvas编程
1. 获取上下文（context）,在上下文中执行动作，最后将动作应用到上下文中。（getContext('2d')）
2. beginPath 创建一条路径
3. moveTo(x,y) 不绘制，只是将当前位置移到新的目标坐标(x,y)
4. lineTo(x,y) 移动到新的目标坐标，而且在两个坐标之间画一条直线。
5. stroke(绘制)/fill(填充)
6. save() 保存当前绘图状态
7. restore() 恢复原有的绘图状态
8. closePath() 闭合路径
9. 

## 变换
缩放，平移，旋转

变换
context.scale(2,2)
context.translate(100,100)

## 描边样式
1. context.lineWidth = 4; 加宽线条
2. context.lineJoin = 'round'; 平滑路径的接合点
3. context.strokeStyle = '#663300'; 将颜色改为棕色
4. context.lineCap = butt/square/round 指定线条未端的样式

## 填充样式
1. context.fillStyle = '#339900';
2. context.fill();
3. context.fillRect(-5,-50,10,50); 填充用作树干的矩形区域
4. strokeRect 基于给出的位置和坐标画出矩形的轮廓
5. clearRect 清除矩形区域内的所有内容并将它恢复到初始状态，即透明色。


只要调用context的fill函数就可以让canvas对当前图形中所有闭合路径内部的像素点进行填充。

## 绘制曲线
context.quadraticCurveTo(310,-250,410,-250)


## 在canvas中插入图片

```
var bark = new Image();
bark.src = 'bark.jpg';
//图片加载完后，显示在canvas上
bark.onload = function(){
   drawTrails();
}
```

## canvas 文本
fillText(text,x,y,maxwidth)
strokeText(text,x,y,maxwidth)

## 阴影
shadowColor
shadowOffsetX ＝ 像素值 正数，向右移动阴影；负数，向左移动阴影
shadowOffsetY = 像素值  正数，向下移动阴影；负数，向上移动阴影
shadowBlur      高斯模糊值  值越大，阴影边缘越模糊 


