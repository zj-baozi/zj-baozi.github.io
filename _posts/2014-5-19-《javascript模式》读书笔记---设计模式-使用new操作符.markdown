---
layout: post
title:  《javascript模式》读书笔记---设计模式-使用new操作符
date:   2014-05-19 20:42:21

categories: 笔记
---


　　javascript中具有new语法可全名用构造函数来创建对象，而且有时可能需要使用这种语法的单体实现。
　　
　　**这种思想在于当使用同一个构造函数以new操作符来创建多个对象时，应该仅获得指向完全相同的对象的新指针。**

　　```
　　var uni = new Universe();
　　var uni2 = new Universe();
　　console.log(uni === uni2);  //结果为true
　　```
　　在上面的例子中，uni对象仅在第一次调用构造函数时被创建。在第二次（以及第三次。。。）创建时将会返回同一个uni对象。这就是为什么uni===uni2,因为它们本质上指向同一个对象的两个引用。
　　如何实现呢？
　　*需要Universe构造函数缓存该对象实例this，以便当第二次调用该构造函数时能够创建并返回同一个对象*
　　做法：
　　**1、**


