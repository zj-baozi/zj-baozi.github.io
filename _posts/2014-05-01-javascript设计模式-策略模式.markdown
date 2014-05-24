---
layout: post
title:  《javascript模式》-策略模式
date:   2014-04-19 20:18:21
categories: 笔记
---


##策略模式的定义
**定义一组算法，将每个算法都封装起来，并且使他们之间可以互换。**

**使用策略模式的其中一个例子是解决表单验证的问题。可以创建一个具有validate()方法的验证器（validator）对象。无论表单的具体类型是什么，该方法都将会被调用，并且总是返回相同的结果，一个未经验证的数据列表以及任意的错误消息。**


参考地址：
http://www.kankanews.com/ICkengine/archives/100710.shtml

```
//validator是通用的，可以像这样将其保存下来以用于验证用例。增强validator对象的方法是添加更多的类型检查。
     var validator = {
         //所有可用的检查
         types:{},
         //错误信息
         messages:[],
         //验证类型
         config:{},
         //接口方法
         validate:function(data){
           var i,msg,type,checker,result_ok;
           //重置所有消息
           for(i in data){
               if(data.hasOwnProperty(i)){
                   type = this.config[i];
                   checker = this.types[type];
                   if(!type){
                       continue; //不需要验证
                   }
                   if(!checker){
                       throw {
                           name:'ValidationError',
                           message:'No handler to validate type ' + type
                       };
                   }
                   result_ok= checker.validate(data[i]);
                   if(!result_ok){
                       msg = 'Invalid value for * '+i + '*, '+checker.instructions;
                       this.messages.push(msg);
                   }
               }
           }
           return this.hasErrors();
         },
         hasErrors:function(){
             return this.messages.length !== 0;
         }
     };
     //非空值的检查
     validator.types.isNonEmpty = {
         validate:function(value){
           return value !== '';
         },
         instructions:'the value cannot be empty'
     };
     //检查值是否是一个数字
     validator.types.isNumber = {
         validate:function(value){
             return !isNaN(value);
         },
         instructions:'the value can only be a valid number,e.g. i,3.14 or 2010'
     };

     //检查该值是否只包含字母和数字
     validator.types.isAlphaNum={
         validate:function(value){
             return !/[^a-z0-9]/i.test(value);
         },
         instructions:'the value can only contain characters and numbers,no special symbols'
     }

     //应用
     var data ={
         first_name:'Super',
         last_name:'Man',
         age:'unknown',
         username:'o_O'
     };
     validator.config={
         first_name:'isNonEmpty',
         age:'isNumber',
         username:'isAlphaNum'
     }
     validator.validate(data);
     if(validator.hasErrors()){
         console.log(validator.messages.join('\n'));
     }
```



