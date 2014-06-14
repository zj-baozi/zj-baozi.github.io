---
layout: post
title:  《javascript模式》读书笔记—对象创建模式
date:   2014-04-05 14:18:21
categories: 笔记 javascript模式
---

<div class="entry">
    <h1>对象创建模式</h1>
   <p>本章中我们将看到命名空间，依赖说明、模块模式、沙箱模式。它们都可以帮助组织应用程序代码的结构，并且降低隐含的全局变量带来的后果。以及私有和特权成员、对象常量、链和一个启发类的方式以定义构造函数。</p>
   
   
    <h3>命名空间模式</h3>
    <ul>
        <li>命名空间（namespace）有助于减少程序中所需要的全局变量的数量，并且同时还有助于避免命名冲突或过长的名字前缀。</li>
        <li>实现：为应用程序或库创建一个（理想上最好只有一个）全局对象，然后将所有功能添加到该全局对象中，从而在具有大量函数、对象或其他变量的情况下并不会污染全局范围。</li>
        <li>
            <pre>
                //反例
                // 5个全局变量
                // 构造函数
                function Parent(){}
                function Child(){}
                //一个变量
                var some_var = 1;
                //一些对象
                var module1 = {};
                module1.data = {a:1,b:2};
                var module2 ={};
            </pre>
            <script>
                //反例
                // 5个全局变量
                // 构造函数
                function Parent(){}
                function Child(){}
                //一个变量
                var some_var = 1;
                //一些对象
                var module1 = {};
                module1.data = {a:1,b:2};
                var module2 ={};

            </script>
            <p>改善：通过创建全局对象MYAPP，改变所有函数和变量以使其成为全局对象的属性：</p>
            <pre>
               //一个全局变量
                var MYAPP ={ };
                MYAPP.Parent =function(){};
                MYAPP.Child = function(){};

                //一个变量
                MYAPP.some_var = 1;

                //一个对象容器
                MYAPP.modules = {};

                //一些对象
                MYAPP.modules.module1 = {};
                MYAPP.modules.module1.data = {a:1,b:2};
                MYAPP.modules.module2 ={};
            </pre>
            <script>
                //一个全局变量
                var MYAPP ={ };
                MYAPP.Parent =function(){};
                MYAPP.Child = function(){};

                //一个变量
                MYAPP.some_var = 1;

                //一个对象容器
                MYAPP.modules = {};

                //一些对象
                MYAPP.modules.module1 = {};
                MYAPP.modules.module1.data = {a:1,b:2};
                MYAPP.modules.module2 ={};

            </script>
        </li>
        <li>优点是避免了命名冲突，缺点：
            <ol>
                <li>需要输入更多的字符，每个变量和函数前都要附加前缀，总体上增加了需要下载的代码量。</li>
                <li>仅有一个全局实例意味着任何部分的代码都可以修改该全局实例，并且其余的功能能够获得更新后的状态。</li>
                <li>长嵌套名字意味着更长（更慢）的属性解析查询时间。</li>

            </ol>
            <strong class="c90">后面讨论的沙箱模式（sandbox pattern）可以解决以上缺点。</strong>
        </li>
    </ul>
    <h3>通用命名空间函数</h3>
    <ul>
        <li>在使用命名空间之前要先检查它是否已存在：</li>
        <li>
            <pre>
							//不安全的代码
                var MYAPP = {};
                //更好的代码风格
                if(typeof MYAPP === 'undefined'){
                    var MYAPP = {};
                }
                //或者用更短的语句
                var MYAPP = MYAPP || {};
</pre>
            <script>
                //不安全的代码
                var MYAPP = {};
                //更好的代码风格
                if(typeof MYAPP === 'undefined'){
                    var MYAPP = {};
                }
                //或者用更短的语句
                var MYAPP = MYAPP || {};

            </script>
        </li>
        <li>重复的检查，我们需要一个namespace()函数来帮助 我们方便地处理命名空间的细节，做成一个可重用的函数：
        <p>调用方式：</p>
            <pre>
                MYAPP.namespace('MYAPP.modules.module2');
                //相当于以下代码
                var MYAPP = {
                    modules :{
                        module2:{}
                    }
                }
            </pre>
        </li>
        <li>函数实现：（如果已经存在则不会重新创建它）
            <pre>
							var MYAPP = MYAPP || {};
                MYAPP.namespace = function(ns_string){
                    var parts = ns_string.split('.'),
                        parent = MYAPP,
                        i;
                    //剥离最前面的冗余全局变量
                    if(parts[0] === 'MYAPP'){
                        parts = parts.splice(1);
                    }
                    for(i=0;i< parts.length;i++){
                        //如果属性不存在则创建
                        if(typeof parent[parts[i]] === 'undefined'){
                            parent[parts[i]]={};
                        }
                        parent = parent[parts[i]];
                    }
                    return parent;

                }
                var module2 = MYAPP.namespace('MYAPP.modules.module2');
                MYAPP.namespace('modules.module52');

            </pre>
            <script>
                var MYAPP = MYAPP || {};
                MYAPP.namespace = function(ns_string){
                    var parts = ns_string.split('.'),
                        parent = MYAPP,
                        i;
                    //剥离最前面的冗余全局变量
                    if(parts[0] === 'MYAPP'){
                        parts = parts.splice(1);
                    }
                    for(i=0;i< parts.length;i++){
                        //如果属性不存在则创建
                        if(typeof parent[parts[i]] === 'undefined'){
                            parent[parts[i]]={};
                        }
                        parent = parent[parts[i]];
                    }
                    return parent;

                }
                var module2 = MYAPP.namespace('MYAPP.modules.module2');
                MYAPP.namespace('modules.module52');
            </script>
        </li>
    </ul>
    <h3>声明依赖关系</h3>
    <ul>
        <li>在函数或模块顶部声明代码所依赖的模块是一个非常好的主意。
            <pre>
                var myFunction = function(){
                    //依赖
                    var event = YAHOO.util.Event,
                            dom = YAHOO.util.dom;

                    //使用事件或DOM变量
                    //and so on
                }
            </pre>
            <script>
                var myFunction = function(){
                    //依赖
                    var event = YAHOO.util.Event,
                            dom = YAHOO.util.dom;

                    //使用事件或DOM变量
                    //and so on
                }
            </script>
        </li>
        <li>极其简单的模式，却有很多优点：
            <ol>
                <li>显示的依赖声明了他们确定需要的特定脚本文件已经包含在该页面中。</li>
                <li>在函数顶部的前期声明可以使您很容易地发现并解析依赖。</li>
                <li>解析局部变量（比如DOM）的速度总是要比解析全局变量（比如YAHOO）要快，甚至比使用全局变量的嵌套属性（比如YAHOO.util.Dom）还要快，这导致了更好的性能。</li>
                <li>类似于YUICompressor或goole闭包编译器的这些高级小工具可以重命名局部变量（因此，event有可能变成一个字符，比如A），这导致了更小的代码量，但是这些工具从不会对全局变量进行重命名，因为这样做不安全。</li>
                <li>
                    <pre>
                       function test1(){
                            alert(MYAPP.modules.m1);
                            alert(MYAPP.modules.m2);
                            alert(MYAPP.modules.m3);
                        }
                        /*缩减的test1主体*/
                        alert(MYAPP.modules.m1);alert(MYAPP.modules.m2);alert(MYAPP.modules.m3);
                        function test2(){
                            var modules =MYAPP.modules;
                            alert(modules.m1);
                            alert(modules.m2);
                            alert(modules.m3);
                        }
                        /*缩减的test2主体*/
                        var a =MYAPP.modules;alert(a.m1);alert(a.m2);alert(a.m3);
                    </pre>

                </li>
            </ol>
        </li>
    </ul>
    <h3>私有属性和方法</h3>
    <ul>
        <li>javascript没有特殊语法来表示私有、保护、或公共属性和方法，所有对象的成员是公共的：
        <pre>
           var myobj = {
                myprop:1,
                getProp:function(){
                    return this.myprop;
                }
            };
            console.log(myobj.myprop); //公有可访问
            console.log(myobj.getProp());//公有可访问
        </pre>
            <script>
                var myobj = {
                    myprop:1,
                    getProp:function(){
                        return this.myprop;
                    }
                };
                console.log(myobj.myprop); //公有可访问
                console.log(myobj.getProp());//公有可访问

            </script>
        </li>

    </ul>
    <h3>私有成员</h3>
    <ul>
        <li>
            <pre>
               function Gadget(){
                    //私有成员
                    var name = 'ipod';
                    //公有函数
                    this.getName = function(){
                        return name;
                    };
                }
                var toy = new Gadget();
                //name是私有的，不可访问
                console.log(toy.name); //undefined
                console.log(toy.getName()); //ipod
            </pre>
            <script>
                function Gadget(){
                    //私有成员
                    var name = 'ipod';
                    //公有函数
                    this.getName = function(){
                        return name;
                    };
                }
                var toy = new Gadget();
                //name是私有的，不可访问
                console.log(toy.name); //undefined
                console.log(toy.getName()); //ipod
            </script>
            <p>很容易在javascript实现私有性。需要做的只是在函数中将需要保持为私有属性的数据包装起来，确保其为局部变量，则外部函数不可访问。</p>
        </li>
    </ul>
    <h3>特权方法</h3>
    <ul>
        <li>只是一个名称而已：指那些可以访问私有成员的公共方法</li>
    </ul>
    <h3>对象字面量以及私有性</h3>
    <ul>
        <li>可以使用一个额外的匿名即时函数创建闭包来实现私有性：
            <pre>
               var myobj; //这将会是对象
                (function(){
                    //私有成员
                    var name = 'my,oh my';

                    //实现公有部分，没有var
                    myobj = {
                        //特权方法
                        getName:function(){
                            return name;
                        }
                    }
                })();
                myobj.getName(); // my...
            </pre>
            <script>
                var myobj; //这将会是对象
                (function(){
                    //私有成员
                    var name = 'my,oh my';

                    //实现公有部分，没有var
                    myobj = {
                        //特权方法
                        getName:function(){
                            return name;
                        }
                    }
                })();
                myobj.getName(); // my...

            </script>
        </li>
        <li>
            下面的例子与上面有相同的思想，只是在实现上略有不同：
            <pre>
                var myobj = (function(){
                    //私有成员
                    var name = 'my,oh my';

                    //实现公有部分
                    return {
                        getName:function(){
                            return name;
                        }
                    }
                }());
                myobj.getName(); // my...
            </pre>
            <script>
                var myobj = (function(){
                    //私有成员
                    var name = 'my,oh my';

                    //实现公有部分
                    return {
                        getName:function(){
                            return name;
                        }
                    }
                }());
                myobj.getName(); // my...
            </script>
            <strong class="c90">这个例子也是称之为“模块模式”的基础框架</strong>
        </li>
    </ul>
    <h3>原型和私有性</h3>
    <ul>
        <li>
            <p class="c90">当私有成员与构造函数一起使用时，其中的一个缺点在于每次调用构造函数以创建对象时，这些私有成员都会被重新创建。构造函数中添加到this中的任何成员都实际上面临以上问题。为了避免复制工作和节省内存，可以将常用属性和方法添加到构造函数的prototype属性中。这样，通过同一个构造函数创建的多个实例可以共享常见的部分数据。以及共享隐藏的私有成员</p>
            <pre>
               function Gadget(){
                    //私有成员
                    var name = 'ipod';
                    //公有函数
                    this.getName = function(){
                        return name;
                    };
                }
                Gadget.prototype = (function(){
                   //私有成员
                   var brower = 'Mobile Webkit';
                   //公有原型成员
                    return {
                        getBrower:function(){
                            return brower;
                        }
                    }
                }());
                var toy = new Gadget();
                console.log(toy.getName()); //特权'own'方法
                console.log(toy.getBrower());//特权原型方法
            </pre>
            <script>
                function Gadget(){
                    //私有成员
                    var name = 'ipod';
                    //公有函数
                    this.getName = function(){
                        return name;
                    };
                }
                Gadget.prototype = (function(){
                   //私有成员
                   var brower = 'Mobile Webkit';
                   //公有原型成员
                    return {
                        getBrower:function(){
                            return brower;
                        }
                    }
                }());
                var toy = new Gadget();
                console.log(toy.getName()); //特权'own'方法
                console.log(toy.getBrower());//特权原型方法
            </script>

        </li>
    </ul>
    <h3>将私有方法揭示为公有方法</h3>
    <ul>
        <li>揭示模式可用于将私有方法暴露成为公共方法。</li>
        <li>以下例子建立在其中一种私有模式之上，即对象字面量中的私有成员：
            <pre>
              var myarray;
                (function(){
                  var astr = '[object Array]',
                      toString = Object.prototype.toString;
                  function isArray(a){
                      return toString.call(a) === astr;
                  }
                  function indexOf(haystack,needle){
                      var i= 0,
                              max = haystack.length;
                      for(;i<max;i+=1){
                          if(haystack[i] === needle){
                              return i;
                          }
                      }
                      return -1;
                  }
                  myarray = {
                      isArray:isArray,
                      indexOf:indexOf,
                      inArray:indexOf
                  }
                }());
            </pre>
            <script>
                var myarray;
                (function(){
                  var astr = '[object Array]',
                      toString = Object.prototype.toString;
                  function isArray(a){
                      return toString.call(a) === astr;
                  }
                  function indexOf(haystack,needle){
                      var i= 0,
                              max = haystack.length;
                      for(;i<max;i+=1){
                          if(haystack[i] === needle){
                              return i;
                          }
                      }
                      return -1;
                  }
                  myarray = {
                      isArray:isArray,
                      indexOf:indexOf,
                      inArray:indexOf
                  }
                }());
            </script>
        </li>

    </ul>
    <h3>模块模式</h3>
    <ul>
        <li>
            <p class="c90">
                模块模式是本书中迄今为止介绍过的多种模式的组合，也就是到下模式的组合：
                命名空间<br>
                即时函数 <br>
                私有和特权成员<br>
                声明依赖 <br>
            </p>
        </li>
        <li>
            <pre>

            </pre>
            <script>
                MYAPP.namespace('MYAPP.utilities.array');
                MYAPP.utilities.array = (function(){
                    //依赖
                    var uobj = MYAPP.utilities.object,
                        ulang = MYAPP.utilities.lang,
                        //私有属性
                        array_string = '[object Array]',
                        ops = Object.prototype.toString;

                    //私有方法
                    //...
                    // var 变量定义结束

                    //公有API
                   return{
                       inArray:function(){
                          //...
                       },
                       isArray:function(){
                           //...
                       }
                   }
                }());
            </script>
        </li>
    </ul>
    <h3>揭示模式</h3>
    <ul>
        <li>
            <pre>
               MYAPP.utilities.array = (function(){
                    //依赖
                    var uobj = MYAPP.utilities.object,
                            ulang = MYAPP.utilities.lang,
                    //私有属性
                            array_string = '[object Array]',
                            ops = Object.prototype.toString,

                    //私有方法
                    isArray = function(){

                    },
                    inArray = function(){

                    };


                    //揭示公有API
                    return{
                        inArray:inArray,
                        isArray:isArray
                    }
                }());
            </pre>
            <script>
                MYAPP.utilities.array = (function(){
                    //依赖
                    var uobj = MYAPP.utilities.object,
                            ulang = MYAPP.utilities.lang,
                    //私有属性
                            array_string = '[object Array]',
                            ops = Object.prototype.toString,

                    //私有方法
                    isArray = function(){

                    },
                    inArray = function(){

                    };


                    //揭示公有API
                    return{
                        inArray:inArray,
                        isArray:isArray
                    }
                }());
            </script>
        </li>
    </ul>
    <h3>将全局变量导入到模块中</h3>
    <ul>
        <li>在常见的变化模式中，可以将参数传递到包装了模块的即时函数中。导入全局变量有助于加速即时函数中的全局符号解析的速度，因为这些导入的变量成为了该函数的局部变量。
        <pre>
MYAPP.utilities.module = (function(app,global){
   //引用全局对象
   //以及现在被转换成局部变量的全局应用程序命名空间对象
}(MYAPP,this));
        </pre>
            <script>
                MYAPP.utilities.module = (function(app,global){
                  //引用全局对象
                  //以及现在被转换成局部变量的全局应用程序命名空间对象
                }(MYAPP,this));
            </script>
        </li>

    </ul>
    <h3>沙箱模式</h3>
    <strong class="c90">
        提供了一个可用于模块运行的环境，且不会对其他模块和个人沙箱造成任何影响。<br>
        沙箱模式解决了命名空间模式的如下几个缺点：
    </strong>
    <ul>
        <li>对单个全局变量的依赖变成了对应用程序的全局变量依赖。</li>
        <li>对这种以点分割的名字来说，需要输入更长的字符，并且在运行时需要解析更长的时间，比如MYAPP.utilites.array</li>
    </ul>
    未完待续。。。
</div>
