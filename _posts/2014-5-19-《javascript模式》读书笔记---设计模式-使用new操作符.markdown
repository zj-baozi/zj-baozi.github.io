---
layout: post
title:  《javascript模式》读书笔记---设计模式-使用new操作符
date:   2014-05-19 20:42:21

categories: 笔记 javasript设计模式
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

需要Universe构造函数缓存该对象实例this，以便当第二次调用该构造函数时能够创建并返回同一个对象
-

做法：

**1、使用全局变量来存储该实例。不推荐！**
**2、可以在构造函数的静态属性中缓存该实例。（可以使用类似Universe.instance的属性并将实例缓存在该属性中。很好的实现方法！缺点：instance属性是公开可访问的属性，在外部代码中可能会修改该属性，以至于丢失了该实例。）**

```
//静态属性中的实例
 function Universe(){
     //我们有一个现有的实例吗？
     if(typeof Universe.instance === 'object'){
         return Universe.instance;
     }
     //正常进行
     this.start_time = 0;
     this.bang = 'Big';

     //缓存
     Universe.instance = this;

     //隐式返回
     return this;
 }
   var  uni = new Universe();
   var  uni2 = new Universe();
    console.log(uni === uni2);
```

**3、可以将该实例包装在闭包中。（保证实例的私有性，带来了额外的闭包开销。）**

```
//闭包中的实例
function Universe2(){
    //缓存实例
    var instance = this;

    //正常进行
    this.start_time = 0;
    this.bang  = 'Big';

    //重写该构造函数
    Universe = function(){
        return instance;
    }
}
    var uni3 = new Universe();
    var uni4 = new Universe();
    console.log(uni3 === uni4);
```
这种实现实际上来自于第4章的自定义函数模式的另一个例子。缺点：主要在于重写构造函数【在本例中，也就是构造函数Universe()】会丢失所有在初始定义和重定义时刻之间的对象都不会存在指向由原始实现所创建实例的活动链接。
测试：

```
    Universe2.prototype.nothing = true;
    var uni3 = new Universe2();
    //在创建初始化对象之后，
    //再次向该原型添加属性
    Universe2.prototype.everything = true;
    var uni4 = new Universe2();
    console.log(uni3.nothing);//true
    console.log(uni4.nothing); //true
    console.log('everything:'+uni3.everything);//undefined
    console.log('everything:'+uni4.everything);//undefined
    //结果看上去是正确的
    uni3.constructor.name; //Universe2
    //但是很奇怪
    console.log(uni3.constructor === Universe2); //false


```
**之所以uni3.constructor不再与Universe2()构造函数相同，是因为uni3.constructor仍然指向了原始的构造函数，而不是重新定义的那个构造函数。**
如果需要使原型和构造函数指针按照预期的那样运行，那么：

```
function Universe3(){
        //缓存实例
        var instance;

        //重写构造函数
        Universe3 = function(){
            return instance;
        }

        //保留原型属性
        Universe3.prototype = this;

        //实例
        instance = new Universe3();

        //重置构造函数指针
        instance.constructor = Universe3;

        //所有功能
        instance.start_time =0;
        instance.bang = 'Big';
        return instance;
    }
 Universe3.prototype.nothing = true;
 var uni5 = new Universe3();
 Universe3.prototype.everything = true;
 var uni6 = new Universe3();
 console.log(uni5 === uni6);//true
 console.log('nothing:'+uni5.nothing);//true
 console.log('nothing:'+uni6.nothing);//true
 console.log('everything:'+uni5.everything);//true
 console.log('everything:'+uni6.everything);//true
 console.log(uni5.bang);//Big
 //但是很奇怪
 console.log(uni5.constructor === Universe3); //true
```
另一种解决方案是将构造函数和实例包装在即时函数中。在第一次调用构造函数时，它会创建一个对象，并且使得私有instance指向该对象。从第二次调用之后，该构造函数仅返回该私有变量。

```
var Universe;
 (function(){
   var instance;
     Universe = function Universe(){
       if(instance){
           return instance;
       }  
       instance = this;
         //所有功能
         this.start_name=0;
         this.name = 'Big';
     }
 }());
```