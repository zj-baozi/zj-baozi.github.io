---
layout: post
title:  《javascript模式》读书笔记---设计模式-迭代器模式
date:   2014-05-24 11:50:21

categories: 笔记
---


迭代器模式

**表现**

在迭代器模式中，通常有一个包含某种数据集合的对象。该数据可能存储在一个复杂数据结构内部，而要提供一种简单的方法能够访问数据结构中每个元素。对象的消费者并不需要知道如何组织数据，所有需要做的就是取出单个数据进行工作。

*在迭代器模式中，对象需要提供一个next()方法。依次调用next()必须返回下一个连续的元素。（下一个代表什么由程序决定）*


**用法**

```
var element;
while(element = agg.next()){
	//处理该元素
	console.log(element);
}
```
**实现示例：**

```
var agg =(function(){
            var index = 0,
                    data =[1,2,3,4,5],
                    length = data.length;
            return {
                next:function(){
                    var element;
                    if(!this.hasNext()){
                        return null;
                    }
                    element = data[index];
                    index = index+2;
                    return element;
                },
                hasNext:function(){
                    return index < length;
                },
                //返回当前元素
                current:function(){
                    return data[index];
                },
                //重置指针到初始位置
                rewind:function(){
                    index = 0;
                }
            }

        }());
```
使用方法：

```
(function(){
        //循环记录1，3，5
        while(agg.hasNext()){
            console.log(agg.next()); //1,3,5
        }
        agg.rewind();
        console.log(agg.current()); //1            
})();
```
**用途？？？**

