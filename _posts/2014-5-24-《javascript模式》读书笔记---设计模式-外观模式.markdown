---
layout: post
title:  《javascript模式》读书笔记---设计模式-外观模式
date:   2014-05-24 21:50:21

categories: 笔记 javascript设计模式
---


外观模式

**表现**

一种简单的模式，为对象提供了一个可供选择的接口。
这是一种非常好的设计实践，可保持方法的简洁性并且不会使它们处理过多的工作。

通过创建一个外观方法从而同时调用处理流星器事件的两个方法：

```
var myevent ={
	stop:function(e){
		e.preventDefault();
		e.stopPropagation();
	}
}
``` 
外观模式也非常适合于浏览器脚本处理，据此可将浏览器之间的差异隐藏在外观之后。

```
var myevent={
    stop:function(e){
        if(typeof e.preventDefault === 'function'){
            e.preventDefault();
        }
        if(typeof e.stopPropagation === 'function'){
            e.stopPropagation();
        }
        //ie浏览器
        if(typeof e.returnValue === 'boolean'){
            e.returnValue = false;
        }
        if(typeof e.cancelBubble === 'boolean'){
            e.cancelBubble = true;
        }
    }
}
```
通过使用外观模式，可以首先考虑新对象的API，然后继续在原有对象的前面创建一个外观。这样，当您着手完全取代原有对象的时候，仅需修改更少的客户端代码，这是由于任何最新的客户端代码都已经使用了这个新API.
