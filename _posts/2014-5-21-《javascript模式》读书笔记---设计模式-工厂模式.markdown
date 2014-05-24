---
layout: post
title:  《javascript模式》读书笔记---设计模式-工厂模式
date:   2014-05-19 20:42:21

categories: 笔记
---


设计工厂模式

**目的：**
为了创建对象。

**目标：**

1、当创建相似对象时执行重复操作

2、在编译时不知道具体类型（类）的情况下，为工厂客户提供一种创建对象的接口。

**实现示例：**

```
function CarMaker() {
        }
        CarMaker.prototype.drive = function () {
            return 'Vroom, I have ' + this.doors + 'doors';
        };
        CarMaker.factory = function (type) {
            var constr = type,
                    newcar;
            //如果构造函数不存在，则发生错误
            if (typeof CarMaker[constr] !== 'function') {
                throw{
                    name: 'Error',
                    message: constr + "does't exist"
                }
            }
            //在这里，构造函数是已知存在的
            //我们使得原型继承父类，但仅继承一次
            if(typeof CarMaker[constr].prototype.drive !== 'function'){
                CarMaker[constr].prototype = new CarMarker();
            }
            //创建一个新的实例
            newcar = new CarMaker[constr]();
            //可选择性的调用一些方法然后返回...
            return newcar;
        };
        //定义特定的汽车制造商
        CarMaker.Compact = function(){
            this.doors = 4;
        };
        CarMaker.Convertible = function(){
            this.doors = 2;
        };
        CarMaker.SUV = function(){
            this.doors = 24;
        }
```
使用方法：

```
(function(){
            var corolla = CarMaker.factory('Compact');
            var solstice = CarMaker.factory('Convertible');
            var cherokee = CarMaker.factory('SUV');
            console.log(corolla.drive());
            console.log(solstice.drive());
            console.log(cherokee.drive());
})();
```
