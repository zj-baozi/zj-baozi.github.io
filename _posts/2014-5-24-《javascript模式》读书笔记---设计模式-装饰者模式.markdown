---
layout: post
title:  《javascript模式》读书笔记---设计模式-装饰者模式
date:   2014-05-24 11:50:21

categories: 笔记
---


装饰者模式

**表现**

在装饰者模式中，可以在运行时动态添加附加功能到对象中。
*在迭代器模式中，对象需要提供一个next()方法。依次调用next()必须返回下一个连续的元素。（下一个代表什么由程序决定）*


**特征**

预期行为的可定制和可配置特性。
可以从仅具有一些基本功能的普通对象开始，然后从可用装饰资源池中选择需要用于增强普通对象的那些功能，并且按照顺序进行装饰，尤其是当装饰顺序很重要的时候。

**用法**

```
	var sale = new Sale(100);
    sale = sale.decorate('fedtax');//增加联邦税
    sale = sale.decorate('quebec');//增加省级税
    sale = sale.decorate('money');//格式化为美元货币形式
    sale.getPrice();
```
**实现**

实现装饰者模式的其中一种方法是使得每个装饰者成为一个对象，并且该对象包含了应该被重载的方法。每个装饰者实际上继承了目前已经被前一个装饰者进行增强后的对象。每个装饰方法在uber（继承的对象）上调用了同样的方法并获取其值，此外它还继续执行了一些操作。

```
function Sale(price){
       this.price = price || 100;

    }
    Sale.prototype.getPrice = function(){
        return this.price;
    };
    Sale.decorators ={};
    //uber是一个德国语，意思是向上，上一层，这等于在子对象上打开一条通道，可以直接调用父对象的方法。
    Sale.decorators.fedtax ={
        getPrice:function(){
            var price = this.uber.getPrice();
            price += price *5/100;
            return price;
        }
    };
    Sale.decorators.quebec = {
        getPrice:function(){
            var price = this.uber.getPrice();
            price += price * 7.5 /100;
            return price;
        }
    };
    Sale.decorators.money = {
        getPrice:function(){
            return '$'+ this.uber.getPrice().toFixed(2);
        }
    }
    Sale.decorators.cdn ={
        getPrice:function(){
            return "CDN$" + this.uber.getPrice().toFixed(2);
        }
    }
   
   
```
 decorate()最“神奇”方法，它可以将所有的块拼接在一起
 
 //sale = sale.decorate('fedtax');
 
 'fedtax'将对应于Sale.decorators.fedtax中实现的对象。新装饰的对象newobj将继承目前我们所拥有的对象（无论是原始对象，还是已经添加了最后的装饰者的对象），这也就是对象this。

为了完成继承部分的代码，我们使用了前一章中的临时构造函数模式。首先，我们也设置了newobj的uber属性，以便于子对象可以访问父对象。然后，我们从装饰者中将所有的额外属性复制到新装饰的对象newobj中。最后，返回newobj,而在我们具体的用法例子中，它实际上成为了更新的sale对象。

```
Sale.prototype.decorate = function(decorator){
       var F = function(){},
           overrides = this.constructor.decorators[decorator],
           i,newobj;
       //临时构造函数模式
       F.prototype = this;
       newobj = new F();
       newobj.uber = F.prototype;
       for(i in overrides){
           if(overrides.hasOwnProperty(i)){
               newobj[i] = overrides[i];
           }
       }
       return newobj;
   }
```
**第二种实现：使用列表实现**

```
function Sale(price){
        this.price = (price > 0) || 100;
        this.decorators_list =[];
    }
    Sale.decorators ={};
    
    Sale.decorators.fedtax ={
        getPrice:function(price){
            return price + price *5/100;
        }
    };
    Sale.decorators.quebec ={
        getPrice:function(price){
            return price + price * 7.5/100;
        }
    };
    Sale.decorators.money ={
        getPrice:function(price){
            return "$" + price.toFixed(2);
        }
    };
    //decorate()仅用于追加列表，而getPrice()却完成所有工作（遍历当前添加的装饰者以及调用每个装饰者的getPrice()方法、传递从前一个方法中获得的结果。）
    Sale.prototype.decorate = function(decorator){
        this.decorators_list.push(decorator);
    };
    Sale.prototype.getPrice = function(){
        var price = this.price,
            i,max = this.decorators_list.length,
            name;
        for(i = 0;i<max;i += 1){
            name = this.decorators_list[i];
            price = Sale.decorators[name].getPrice(price);
        }
        return price;
    };
```
**使用**

```
	var sale = new Sale(100);
    sale.decorate('fedtax');//增加联邦税
    sale.decorate('quebec');//增加省级税
    sale.decorate('money');//格式化为美元货币形式
    console.log(sale.getPrice());
```