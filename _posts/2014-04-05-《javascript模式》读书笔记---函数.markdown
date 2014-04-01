---
layout: post
title:  《javascript模式》读书笔记---函数
date:   2014-04-05 14:18:21
categories: 笔记
---

<div class="entry">
      <h3><strong>四、函数</strong></h3>
   <ul>
   <li>
       <h3>1、函数就是对象，其表现如下：</h3>
       <ol>
           <li>函数可以在运行时动态创建，还可以在程序执行过程中创建。</li>
           <li>函数可以分配给变量，可以将它们的引用复制到其他变量，可以被扩展，此外，除少数特殊情况外，函数还可以被删除。</li>
           <li>可以作为参数传递给其他函数，并且还可以由其他函数返回。</li>
           <li>函数可以有自己的属性和方法。</li>
       </ol>
   </li>
   <li><h3>2、函数表达式，又名匿名函数</h3>
            <pre>

var add = function(a,b){
     return a+b;
};
            </pre>

   </li>
   <li>
       <h3> 2、函数的提升<br></h3>
       变量提升：对于所有的变量，无论在函数体的何处进行声明，都会在后台被提升到函数顶部。而这对于函数同样适用，其原因在于函数只是分配给变量的对象。唯一“明白”的地方在于当使用函数声明时，函数定义也被提升，而不仅仅是函数声明被提升。<br>
                 <pre>
           function foo(){
               alert('global foo');

           }
           function bar(){
               alert('global bar');
           }
           function hoistMe(){
               console.log(typeof foo); //function
               console.log(typeof bar); // undefined
               foo();//local foo
               bar(); // TypeError:bar is not a function

               //函数声明
               //变量foo以及其实现者被提升
               function foo(){
                   alert('local foo');
               }

               //函数表达式
               //仅变量’bar‘被提升
               //函数实现并未被提升
               var bar = function(){
                   alert('local bar');
               }

           }
           hoistMe();
                 </pre>
   </li>
   <li>
       <h3>3、回调模式<br></h3>
                <pre>
           var findNodes = function(){
                var i = 10000,//大而繁重的循环
                    nodes=[], //存储该结果
                    found;//找到了下一个节点
                while(i){
                    i -=1;
                    //复杂逻辑
                    nodes.push(found);
                }
                return nodes;
            }
            var hide = function(nodes){
                var i = 0,max=nodes.length;
                for(i=0;i<max;i+=1){
                    nodes[i].style.display = 'none';
                }
            }
            //执行该函数
            hide(findNodes());
                </pre>
       
   </li>
	<li>以上这个实现是低效的，因为hide()必须再次循环遍历由findNodes()所返回的数组节点，如果能避免这种循环，并且只要在findNodes()中选择便可隐藏节点，那么这将是更高效的实现方式：采用回调模式，将节点隐藏逻辑以回调函数方式传递给findNodes()并委托其执行。</li>
   <li>
       <h3> 4、回调与作用域 <br></h3>
                <pre>
                    //回调与作用域
            var myapp ={};
            myapp.color='green';
            myapp.paint = function(node){
              node.style.color = this.color;
            }
            var findNodes = function(callback){
                //内容同上
                if(typeof callback === 'function'){
                    callback(found);
                }
            }
            findNodes(myapp.paint)
                </pre>

       它不会按照预期的那样运行，这是由于this.color没有被定义，由于findNodes()是一个全局函数，因此，对象this引用了全局对象。类似的，如果findNodes()是一个名为dom的对象的方法（dom.findNodes()），那么回调内部的this将指向dom，而不是预期的myapp.<br>
       解决方案是：传递回调函数，并且另外还传递该回调函数所属的对象： <br>
                <pre>
                    findNodes(myapp.paint,myapp);
                </pre>
       修改findNodes()以绑定所传递进入的对象：
                <pre>

var findNodes = function(callback,callback_obj){
     if(typeof callback === ‘function’){
          callback.call(callback_obj,found);
     }
}

                </pre>
   </li>
   <li>
       2）、传递一个对象和一个方法以用做回调函数的另一种选择是，将其中的方法作为字符串来传递，因此无需重复两次输入该对象的名称，即：
                <pre>

findNodes(myapp.paint,myapp);

改为：findNodes(‘paint’,myapp);

var findNodes = function(callback,callback_obj){
     if(typeof callback === ’string’){
          callback = callback_obj[calback];
     }
     if(typeof callback === ‘function’){
          callback.call(callback_obj,found);
     }

}
                </pre>
   </li>
   <li>
       <h3>5、异步事件监听器</h3>
   </li>
   <li>
					<pre>
					//自定义函数
            var scareMe = function(){
                alert('Boo');
                scareMe = function(){
                    alert('Double boo!');
                };
            };
            scareMe(); //Boo
            scareMe(); //double boo!
            //即时函数,jslint推荐的做法
            (function(){
               alert('watch out');
            }());
            //第二种做法
            (function(){
              alert('watch out');
            })();


            //返回函数
            var setup = function(){
                alert(1);
                return function(){
                    alert(2);
                };
            };
            //使用setup函数
            var my = setup(); //1
            my();        //2*/

            //即时对象模式
            ({
                //在这里配置常数
                maxWidth:600,
                maxHeight:400,
                //还可以定义一些实用的方法
                gimmeMax:function(){
                    return this.maxWidth + 'x'+this.maxHeight;
                },
                init:function(){
                    console.log(this.gimmeMax());
                    //更多初始化任务...
                }
            }).init();

            //初始化时分支
            //之前
            var utils = {
                addListener:function(el,type,fn){
                    if(typeof window.addEventListener === 'function'){
                        el.addEventListener(type,fn,false);
                    }else if(typeof document.attachEvent === 'funciton'){ //IE
                        el.attachEvent('on'+type,fn);
                    }else{  //更早版本的浏览器
                        el['on' + type] = fn;
                    }
                },
                removeListener:function(){
                    //几乎同上
                    //removeEventListener,detachEvent
                }
            }
            //之后
            var util={
                addEventListener:null,
                removeListener:null
            };
            if(typeof window.addEventListener === 'function'){
                util.addEventListener = function(el,type,fn){
                    el.addEventListener(type,fn,false);
                };
                util.removeEventListener = function(el,type,fn){
                    el.removeEventListener(type,fn,false);
                };
            }else if(typeof document.attachEvent === 'funciton'){ //IE
                util.addEventListener = function(el,type,fn){
                    el.attachEvent('on'+type,fn);
                };
                util.removeEventListener = function(el,type,fn){
                    el.detachEvent('on'+type,fn);
                };
            }else{  //更早版本的浏览器
                util.addEventListener = function(el,type,fn){
                    el['on' + type] = fn;
                };
                util.removeEventListener = function(el,type,fn){
                    el['on' + type] = null;
                };
            }


            //缓存存储
            var myFunc = function(param){
                if(!myFunc.cache[param]){
                    var result ={};
                    //开销很大的操作
                    myFunc.cache[param] = result;
                }
                return myFunc.cache[param];
            }
            //缓存存储
            myFunc.cache = {};
            //如果param有很多，或者很复杂，对此的通用解决方案是将它们序列化。
            var myFunc = function(param){
                var cachekey = JSON.stringify(Array.prototype.slice.call(arguments)),
                        result;
                if(!myFunc.cache[cachekey]){
                    result = {};
                    //开销很大的操作
                    myFunc.cache[param] = result;
                }
                return myFunc.cache[param];
            }

            //函数应用
            var sayHi = function(who){
                return console.log('Hello' + (who ? ','+who : '') + '!');
            };
            //调用函数
            sayHi(); // Hello
            sayHi('world'); //Hello,world!
            sayHi.apply(null,['hello']); // Hello,hello!
            var alien = {
                sayHi:function(who){
                    return console.log('Hello hi' + (who ? ','+who : '') + '!');
                }
            };
            alien.sayHi('world');
            sayHi.apply(alien,['humans']);

            //第二种更有效率，节省了一个数组
            sayHi.apply(alien,['humans']);
            sayHi.call(alien,'humans');

            //curry化的add()函数
            //接受部分参数列表
            function add(x,y){
                var oldx = x,oldy = y;

                if(typeof oldy === 'undefined'){  //部分
                    return function(newy){
                        return oldx + newy;
                    }
                }
                //完全应用
                return x+y;
            }
            //测试
            console.log(typeof add(5)); //function
            console.log(add(3)(4)); //7
            //创建并存储一个新函数
            var add2000 = add(2000);
            console.log(add2000(10));//2010

            //通用curry化函数的示例
            function schonfinkelize(fn){
              var slice = Array.prototype.slice,
                  stored_args = slice.call(arguments,1);
              return function(){
                  var new_args = slice.call(arguments),
                      args = stored_args.concat(new_args);
                  return fn.apply(null,args);
              }
            }
            //curry化测试
            function add(x,y){
                return x+y;
            }
            //将一个函数curry化以获得一个新的函数
            var newadd = schonfinkelize(add,5);
            newadd(4); //9
            //另一种选择---直接调用新函数
            schonfinkelize(add,6)(7); // 13
				</pre>
       借用Array.prototype中的slice()方法可以帮助我们将arguments变成一个数组，并且使用该数组工作更加方便。

       <h3>何时使用Curry化</h3>
       当发现正在调用同一个函数，并且传递的参数绝大多数都是相同的，那么该函数可能是用于Curry化的一个很好的候选参数。
   </li>
   </ul>
                    </div>

