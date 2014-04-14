---
layout: post
title:  《javascript模式》读书笔记—代码复用模式（继承）
date:   2014-04-05 14:18:21
categories: 笔记
---


**在谈及代码复用的时候，首先想到的是代码的继承性。**
## 什么叫类式继承？
javascript没有类的概念，但有构造函数，并且new操作符的语法与那些使用类的编程语言在语法上有许多相处之处。 这种语法上的相似性导致了许多程序员按照类的方式考虑javascript，并产生了一些假定在类的基础上的开发思路和继承模式。我们将这种实现方式称之为“类式”继承模式。
实现类式继承的目标是通过构造函数Child()获取来自于另外一个构造函数Parent()的属性，从而创建对象。

 
``` js
var Person  = new Person();
```         

```

//父构造函数
function Parent(name){
   this.name = name || 'Adam';
}
//向该原型添加功能
Parent.prototype.say = function(){
    return this.name;
};
//空白的子构造函数
function Child(name){}

//继承的魔力在此发生
inherit(Child,Parent);
``` 
## 类式继承模式1 - 默认模式
**使用Parent()构造函数创建一个对象，并将该对象赋值给Child()的原型。**

```
function inherit(C,P){
	C.prototype = new P();
}

``` 
**需要记住：原型属性应该指向一个对象，而不是函数，即需要指向new出来的实例**

**优点：默认模式同时继承了自身的属性（添加到this的属性，如name），以及原型属性和方法(say())
**
**缺点：同时继承了两个对象的属性，即添加到this的属性以及原型属性。在绝大多数的时候，并不需要这些自身的属性，因为它们很可能是指向一个特定的实例，而不是复用。**

对于构造函数的一般经验法则是：应该将可复用的成员添加到原型中。
  
 **问题：不支持参数传递：将参数传递给子构造函数中，而子构造函数然后又将参数传递到父构造函数中。**
 
 ```
 var s = new Child('Seth');
 s.say(); // Adam
 ```

## 类式继承模式2 - 借用构造函数 
**借用了父构造函数，它传递子对象以绑定到this，并且还转发任意参数。
**   



 ```
 function Child(a,b,c,d){
 	Parent.apply(this,arguments);
 }
 ```
**优点：解决了从子构造函数到父构造函数的参数传递问题,可以获得父对象自身成员的真实副本，并且不会存在子对象意外覆盖父对象属性的风险。**

**缺点：只能继承在父构造函数中添加到this的属性，不能继承那些添加到原型中的成员。（如say()方法）**

```
//父构造函数
function Article(){
    this.tags = ['js','css'];
}
var article = new Article();
function BlogPost(){}
//默认模式
BlogPost.prototype = article;
var blog = new BlogPost();

//借用构造函数模式
function StaticPage(){
    Article.call(this);
}
var page = new StaticPage();
alert(article.hasOwnProperty('tags')); //true
alert(blog.hasOwnProperty('tags')); //false
alert(page.hasOwnProperty('tags')); // true
 ``` 
 
默认模式导致了blog对象通过原型以获得对tags属性的访问，因此blog对象中没有将article作为自身的属性，因此当调用hasOwnProperty()时会返回false.相反，page对象本身则具有一个tags属性，这是由于它在使用借用构造函数的时候，新对象会获得父对象中tags成员的副本（不是引用）。

```
//父构造函数
function Parent(name){
    this.name = name || 'Ann';
}
//向该原型添加功能
Parent.prototype.say = function(){
    return this.name;
};
//子构造函数
function Child(name){
    Parent.apply(this,arguments);
}
var kid = new Child('Patik');
console.log(kid.name); // Patik
console.log(typeof kid.say); //undefined
```
 **只复制了属性，原型链断开**

### 通过借用构造函数实现多重继承
 
```
function Cat(){
    this.legs = 4;
    this.say = function(){
        return 'meaowww';
    }
}
function Bird(){
    this.wings = 2;
    this.fly = true;
}
function CatWings(){
    Cat.apply(this);
    Bird.apply(this);
}
var jane = new  CatWings();
console.dir(jane);
```   
jane中包含legs，say(),wings,fly

## 类式继承模式2 - 借用和设置原型
**组合前两种模式，先借用构造函数，然后设置子构造函数的原型使其指向一个构造函数创建的新实例。**

```
function Child(a,b,c,d){
   Parent.apply(this,arguments);
}
Child.prototype = new Parent();
```
**优点：对象能够获得父对象本身的成员副本以及指向父对象中可复用功能（以原型成员方式实现的那些功能）的引用。同时，子对象也能够将做任意参数传递到父构造函数中。**
**缺点：父构造函数被调用了两次，导致了其效率低下的问题，自身的属性（如本例中的namen属性）会被继承两次。**

```
function Parent(name){
    this.name = name || 'Ann';
}
//向该原型添加功能
Parent.prototype.say = function(){
    return this.name;
};
//子构造函数
function Child(name){
    Parent.apply(this,arguments);
}
Child.prototype = new Parent();
var kid = new Child('Patik');
console.log(kid.name); // Patik
console.log(kid.say()); //Patik
delete kid.name;
console.log(kid.name); // Ann
```

## 类式继承模式#4 共享原型
**本模式的经验法则：可复用成员应该转移到原型中而不是放置在this中。因此，出于继承的目的，任何值得继承的东西都应该放置在原型中实现。所以：仅将子对象的原型与父对象的原型设置为相同的即可。**

```
function inherit(C,P){
	C.prototype = P.prototype;
}
```
**缺点：如果在继承链下方的某处存在一个子对象或者孙子对象修改了原型，它将会影响到所有的父对象和祖先对象。**
## 类式继承模式#4 临时构造函数
**通过断开父对象与子对象的原型之间的直接链接关系，从而解决共享同一个原型所带来的问题，而且同时还能够继续受益于原型链带来的好处。**

```
function inherit(C,P){
	var F = function(){};
	F.prototype = P.prototype;
	C.prototype = new F();
}
```
函数F()充当父与子对象之间的代理。F()的prototype属性指向父对象的原型。子对象的原型则是一个空白函数实例。
### 存储超类
添加一个指向原始父对象的引用给属性uber(为什么叫uber？是因为“super”是保留的关键词。)
*以下为改进后的实现*

```
function inherit(C,P){
	var F = function(){};
	F.prototype = P.prototype;
	C.prototype = new F();
	* C.uber = P.prototype;
}
```
### 重置构造函数指针
**针对上面近乎完美的类式继承函数，还需要做的就是重置该构造函数的指针，以免在将来的某个时候还需要该构造函数。
如果不重置该构造函数的指针，那么所有子对象将会报告Parent()是它们的构造函数
**

```
var kid = new Child();
console.log(kid.constructor.name);  // Parent
console.log(kid.constructor === Parent); // true

```
*改进后（最后的圣杯版本）：*

```
function inherit(C,P){
	var F = function(){};
	F.prototype = P.prototype;
	C.prototype = new F();
	C.uber = P.prototype;
	* C.prototype.constructor = C;
}
```
**这种模式是适用于项目中的最佳方法，在开源YUI库及其他库中也存在一个与本函数相似的函数，并且它还在没有类的情况下实现了类式继承。**

**优化：常见优化是避免在每次需要继承时都创建临时（代理）构造函数。仅创建一次临时构造函数，并且修改它的原型。**

**具体实现方式：使用即时函数并且在闭包中存储代理函数。**

```
var  inherit = (function(){
   var F = function(){};
   return function(C,P){
       var F = function(){};
       F.prototype = P.prototype;
       C.prototype = new F();
       C.uber = P.prototype; 
       C.prototype.constructor = C; 
   } 
}());

```
## Klass
todo
## 原型继承
**不涉及类，这里的对象都是继承自其他对象。以这种模式考虑：有一个想要复用的对象，并且想创建的第二个对象需要从第一个对象中获取其功能。**

```
//要继承的对象
var parent ={
    name:'Papa'
};
//新对象
var child = object(parent);
//测试
alert(child.name); //Para

```
**如何定义该函数？使用空的临时构造函数F().然后将F()的原型属性设置为父对象。最后，返回一个临时构造函数的新实例。**

```
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
```
**在原型继承模式中，并不需要使用字面量符号来创建父对象（尽管这是一种比较常见的方式。）如下代码，可以使用构造函数创建父对象，需要注意：“自身”属性和构造函数的原型的属性都将被继承：**

```
//父构造函数
function Person(){
    this.name = 'Adam';
}
//添加到原型的属性
Person.prototype.getName = function(){
    return this.name;
}
//创建一个新的Person类对象
var papa = new Person();
//继承
var kid = object(papa);
//测试自身属性和继承的原型属性
console.log(kid.getName()); //Adam
```
**另外一个变化：可以选择仅继承现有构造函数的原型对象。对象继承自对象，而不论父对象是如何创建的。**

```
//父构造函数
function Person(){
    this.name = 'Adam';
}
//添加到原型的属性
Person.prototype.getName = function(){
    return this.name;
}

//继承
var kid = object(Person.prototype);
//测试自身属性和继承的原型属性
console.log(typeof kid.getName); //function ,在原型中
console.log(typeof kid.name);    //undefined ，只有原型是继承的
```
## 增加到ECMAScript 5中
**在ES5中，原型继承模式已经成为该语言的一部分，通过Object.create()来实现。不再需要推出与object()类似的函数**

```
var child = Object.create(parent);
```
**Object.create()接受一个额外的参数，即一个对象。这个额外对象的属性将会被添加到新对象中，以此作为新对象自身的属性，然后Object.create()返回该新对象。这提供了很大的方便，仅采用一个方法调用即可实现继承并在此基础上构造子对象。**
```
var child = Object.create(parent,{
	age:{value:2}
});
child.hasOwnProperty('age'); // true
```
可能还会发现一些js类已经实现了原型继承模式，例如，YUI3中的Y.Object()方法
## 通过复制属性实现继承
**通过复制属性实现继承，对象将从另外一个对象中获取功能，其方法是仅需将其复制即可。**

```
function extend(parent,child){
    var i;
    child = child || {};
    for(i in parent){
      if(parent.hasOwnProperty(i)){
          child[i] = parent[i];
      }
    }
    return child;
}
```
**上面是简单实现，它仅遍历父对象的成员并将其复制出来。child可选**
**上面给出的是浅复制对象，深度复制意味着属性检查，如果即将复制的属性是一个对象或者一个数组，这样的话，它将会递归遍历该属性并且还会将该属性中的元素复制出来。在使用浅复制（由于对象是通过引用传递的），如果改变了子对象的属性，并且该属性恰 好是一个对象，那么这种操作表示也正在修改父对象。当处理对象或数组时，可能导致意外发生**

```
var dad = {
    counts:[1,2,3],
    reds:{paper:true}
};
var kid = extend(dad);
kid.counts.push(4);
console.log(dad.counts.toString()); //1,2,3,4
console.log(dad.reds === kid.reds);//true(引用)
   
```
**修改extend()以实现深度复制，需要做的是检查某个属性的类型是否为对象，如果是，递归复制出该对象的属性，另外，检查该对象是否为一个真实对象或者一个数组。**

```
//深复制
function extendDeep(parent,child){
    var i,
        toStr = Object.prototype.toString,
            astr = '[object Array]';
    child = child || {};
    for(i in parent){
        if(parent.hasOwnProperty(i)){
            if(typeof parent[i] === 'object'){
                child[i] = (toStr.call(parent[i]) === astr)? [] :{};
                extendDeep(parent[i],child[i]);
            } else{
                child[i] = parent[i];
            }
        }
    }
    return child;
}
var dad = {
    counts:[1,2,3],
    reds:{paper:true}
};
var kid2 = extendDeep(dad);
kid2.counts.push(4);
console.log(kid2.counts.toString());  //1,2,3,4
console.log(dad.counts.toString());   //1,2,3
console.log(dad.reds === kid2.reds);  //false
```
## 混入

**mix-in（混入）模式并不是复制一个完整的对象，而是从多个对象中复制出任意的成员并将这些成员组合成一个新的对象。**
**具体实现：遍历每个参数，并且复制出传递给该函数的每个对象中的每个属性。**

```
function mix(){
    var arg,prop,child = {};
    for(arg = 0;arg <arguments.length;arg += 1){
        for(prop in arguments[arg]){
            if(arguments[arg].hasOwnProperty(prop)){
                child[prop] = arguments[arg][prop];
            }
        }
    }
    return child;
}
var cake = mix(
        {eggs:2,large:true},
        {butter:1,salted:true},
        {flour:'3 aaaa'},
        {sugar:{aa:'ee'}
        }
)
console.dir(cake);
```
## 借用方法
```
function f(){
	var args = [].slice.call(arguements,1,3);
	return args;
}
```
**以上为借用数组方法，arguments借用数组的方法，如slice()转化为数组**
**创建一个空数组的原因只是为了使用数组的方法。此外，能够实现同功能的是直接从Array的原型中借用方法，即：Array.prototype.slice.call()，字符较长，却可以节省创建一个空数组的工作。**

```
function bind(o,m){
	return function(){
		return m.apply(o,[].slice.call(arguments));
	}
}
```
**奢侈的拥有绑定所需要付出的代价就是额外闭包的开销。**
## Function.prototype.bind()
**ES5中将bind()方法添加到Function.prototype，使得bind()就像apply()和call()一样简单易用。**
```
if(typeof Function.prototype.bind === 'undefined'){
	Function.prototype.bind = function(thisArg){
		var fn = this,
			slice = Array.prototype.slice,
			args = slice.call(arguments,1);
		return function(){
			return fn.apply(thisArg,args.concat(slice.call(arguments)));
		}	
	}
}
```