---
layout: post
title:  《javascript模式》读书笔记---基础知识
date:   2014-03-31 14:18:21
categories: 笔记 javascript基础
---

<div class="entry">       

<h3>基本技巧</h3>
<ul>
<li>1、尽量多使用对象的组合，而不是使用类的继承。（这句话的意思是通过已有的对象组合来获取新对象，是比通过很长的父 - 子继承来创建新的对象更好的一种方法。）</li>
<li>2、原型（Prototypes）<br/>

    原型是一个对象，并且创建的每一个对象都会自动获取一个Prototypes属性，该属性指象一个新的空对象。该对象几乎等同于采用对象字面量或Object()创建的对象，区别在于它的constructor属性指向了所创建的函数，而不是指向内置的Object()函数。
    <strong>总结：原型就是一个对象（不是一个类，也不是其他特殊的元素），每一个函数都有prototype属性。</strong>

</li>
<li>
    3、由于Javascript的两个特性，导致总是出乎意料地创建全局变量：
    <ol>
        <li>javascript可直接使用变量，甚至无需声明；</li>
        <li>javascript有个暗示全局变量（implied globals）的概念，即任何变量，如果未经声明，就为全局对象所有。</li>

    </ol>
</li>
    <li>
        <pre>
            function sum(x,y){
            //反例，result为暗示全局变量
            result = x+y;
            return result;
            }
        </pre>
    </li>
    <li>
        4、隐含全局变量和明确定义的全局变量的不同之处在于能否使用delete操作符撤销变量：
        <ol>
            <li>使用var 创建的全局变量不能被delete 删除</li>
            <li>不使用var创建的隐含全局变量可以删除。</li>
            <li><strong>（这表明隐含全局变量严格来讲不是真正的变量，而是全局对象的属性。属性可以通过delete操作符删除，但变量不可以。）</strong></li>
        </ol>
    </li>
    <li>
        5、访问全局对象
        <pre>
        var global = (function(){
             return this;
        }());
        </pre>
        <strong>按这种方式通常能获得全局对象，因为this在函数内部作为一个函数调用（而不是通过构造器new创建）时，往往指向该全局对象。</strong>
    </li>
    <li>6、单一var 模式
        <pre>
        var a,b,c;
        </pre>
        <strong>javascript允许在函数的任意地方声明多个变量，无论在哪里声明，效果都等同于在函数顶部进行声明。这就是所谓的提升。</strong>
        <pre>
        //反例
        myname = ‘global’;//全局变量
        function fund(){
             alert(myname); //未定义
             var myname = ‘local’;
             alert(myname); // 局部变量 local
        }
        </pre>
        <strong>原因是：所有的变量声明都会提升到函数的最顶层。</strong>

    </li>
    <li>
        7、当遍历对象属性来过滤遇到原型链属性时，使用hasOwnProperty（）方法是非常重要的。
        <pre>
        var man={
             hands:2,
             b:3,
             c:2
        }
        if(typeof Object.prototype.clone === ‘undefined’){
             Object.prototype.clone = function(){};
        }


        for(var i in man){
             if(man.hasOwnProperty(i)){
                  console.log(i,’:’,man[i]);
             }
        }
        </pre>
        <strong>如果不使用hasOwnProperty来进行过滤，将会显示出clone()</strong>
    </li>
    <li>
        8、另外一种使用hasOwnProperty()的模式是在Object.prototype中调用该函数：
        <pre>
        var i,hasOwn = Object.prototype.hasOwnProperty;

        for(var i in man){
             if(hasOwn.call(man,i)){
                  console.log(i,’:’,man[i]);
             }
        }
        </pre>
    </li>
    <li>
        9、不要增加内置原型（例如给Object(),Array和Function等增加内置构造函数），如下情形除外：
        <ol>
            <li>当未来的ECMAScript版本或javascript方法</li>
            <li>准确地用文档记录下来，并和团队交流清楚</li>
            <li>检查了自定义的属性和方法并未存在时。也许在其他地方已经实现了该方法，或者某个支持的浏览器中javasript引擎的一部分。</li>
        </ol>
    </li>
    <li>10、避免使用隐式类型转换，（即===来做对比）</li>
    <li>11、eval()是魔鬼，因为它会影响作用域链</li>
    <li>12、使用parseInt()的数值约定
        <pre>
            year = parseInt(year,10);
        </pre>
        在EC3中，0开始的字符串会被当做八进制处理，而在EC5中发生了改变。为了避免不一致性的未预期的结果，每次都具体指定进制参数：
        <pre>
        year = parseInt(year,10);
        </pre>
    </li>

</ul>
        <h3>二、字面量和构造函数</h3>
        <ul>
            <li>
                1、所谓的空对象即｛｝，实际在javascript中没有任何空对象，即使最简单的｛｝对象也具有从Object.prototype继承的属性和方法。空只表示没有自己的属性。
            </li>
            <li>当使用new操作符调用构造函数时，函数内部将会发生以下情况：
            <ol>
                <li>创建一个空对象并且this变量引用该对象，同时还继承了该函数的原型。</li>
                <li>属性和方法被加入到this引用的对象中。</li>
                <li>新创建的对象由this所引用，并且最后隐式地返回this（如果没有显式地返回其它对象。）</li>
            </ol>
                <pre>

var Person =function(name){
     this.name = name;
     this.say = function(){
          return ‘I am ‘ + this.name;
     }
}
                </pre>
            </li>
            <li>以上在后台的执行情况:
                <pre>

var Person =function(name){


     //使用对象字面量模式创建一个新对象
     var this ={};
     //向this添加属性和方法
     this.name = name;
     this.say = function(){
          return ‘I am ‘ + this.name;
     }
     //return this;
}
                </pre>
            </li>
            <li>将say()方法添加到this中。其造成的结果是在任何时候调用new Person()时都会在内存中创建一个新的函数。更好的选择应该是将方法添加到Person类的原型中。
            <pre>

Person.prototype.say=function(){
     return ‘I am ‘+this.name;
}
var Objectmaker = function(){
            //下面的’name‘属性将被忽略
            //这是因为构造函数决定改为返回另一个对象
            this.name = 'This is it';
            //创建并返回一个新对象
            var that ={};
            that.name = 'And that"s that';
            return that;
        };
        //测试
        var o = new Objectmaker();
        console.log(o.name);  // 'And that"s that'
            </pre>
            </li>
           <li>4、忘记了使用new操作符，从而导致构造函数中的this指向了全局对象（在浏览器中，this将会指向window）.
           <pre>
               //测试
            var o = new Objectmaker();
            console.log(o.name);

            function Waffle(){
                this.tastes = 'yummy';
            }
            //定义一个新对象
            var good_morning = new Waffle();
            console.log(typeof good_morning); //object
            console.log(good_morning.tastes); //yummy
            //反例
            var good_morning2 = Waffle();
            console.log(typeof good_morning2);// undefined
            console.log(window.tastes);  // yummy
           </pre>
           </li>
            <li>
                （PS:上面的意外行为在ECMAscript5中得到了解决，并且在严格模式中，this不会指向全局对象。如果不能使用ES5呢？下面有方法帮助我们解决）
            </li>
            <li>5、解决方案一：命名约定</li>
            <li>
                遵循命名约定一定程度上有助于避免上面忘记使用new所带来的问题，但命名约定也只是一种建议，并不能强制保证正确的行为。何为命名约定？即并不是将所有的成员添加到this中，而是将成员添加到that中，并且最后返回that.
                <pre>

function Waffle(){
     var that ={};
     that.tastes = ‘yummy’;
     return that;
}
//甚至省去that变量，直接返回对象
function Waffle(){
     return {
          tastes:’yummy'
     }
}
                </pre>
            </li>
            <li>
                使用上面任何一种Waffle()的实现方式都总是会返回一个对象，而无论它是如何被调用的：
                <pre>

var first = new Waffle(),
     second = Waffle();
console.log(first.tastes); // yummy
console.log(second.tastes) // yummy
                </pre>
                缺点： <br/>
                这种模式的问题在于它会丢失到原型的链接，因此任何您添加到Waffle()原型的成员，对于对象来说都是不可用的。
            </li>
            <li>6、解决方案二：自调用构造函数 <br />
                可以在构造函数中检查this是否为构造函数的一个实例，如果为否，构造函数可以再次调用自身，并且在这次调用中正确地使用new操作符；
                <pre>

function Waffle(){
                if(!(this instanceof Waffle)){
                    return new Waffle();
                }
                this.tastes = 'yummy';
            }
            Waffle.prototype.wantAnother = true;

            //测试调用
            var first = new Waffle(),
                second = Waffle();
            console.log(first.tastes); // yummy
            console.log(second.tastes);// yummy
                </pre>
                或者使用arguments.callee代替函数名，但ES5严格模式中并不支持arguments.callee属性
            </li>
            <li>
                7、数组字面量和构造函数的区别：<br />
                <pre>
                    // 具有一个元素的数组
            var a =[3];
            console.log(a.length); // 1
            console.log(a[0]); // 3
            //具有三个元素的数组
            var a = new Array(3);
            console.log(a.length); //3
            console.log(a[0]); // undefined
                </pre>
                <strong>newArray(3)创建一个长度为3的数组，但是该数组中并没有实际的元素</strong><br/>
                <pre>
                    //符点数的情况
            var a = [3.14];
            console.log(a[0]); //3.14
            var a = new Array(3.14); //RangeError:invalid array length(范围错误，不合法的数组长度。)
            console.log(typeof a); //undefined
                </pre>
                为了避免在运行创建动态数组可能产生的潜在错误，坚持使用数组字面量程序会更安全。
            </li>
            <li>
                <pre>

var white = new Array(256).join(‘ ‘);
console..log(white.length);  //255
                </pre>

                为什么是255个空白字符串而不是256个？ <br>
                先看下join()方法的定义：用于将数组中所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的。   <br>
                在两个元素之间插入指定字符串，而256个字符其中能插的就255个位置，所以length为255 <br>
                typeof 数组，返回的是’object’ ，如果需要检测某个值是否为数组，可以检查代码是否存在length或者数组的方法，比如slice()，以此来确定该值是否具有“数组性质”。但检查机制并不健壮。还可以使用instanceof Array来检查，但在某些IE浏览器版本中不同框架中运行并不正确。<br>
            </li>
            <li>ES5中定义了一个新方法Array.isArray()，该函数在参数为数组时返回true:
            <pre>

Array.isArray([]); //true
Array.isArray({
     length:1,
     ‘0’:1,
     slice:function(){

     }
}) //false
            </pre>
                如果无法使用新方法，可以通过调用Object.prototype.toString()方法对其进行检查。如果在数组上、下文环境中调用了toString的call()方法，它该返回字符串“[object Array]”，如果该上、下文是一个对象，则它应该返回“[object Object]”。<br>
                <pre>
                    if(typeof Array.isArray === 'undefined'){
                Array.isArray = function(arg){
                    return Object.prototype.toString.call(arg) === '[object Array]';
                }
 }
                </pre>
            </li>
            <li>
                8、JSON.parse() 将json字符串解析为json对象，比eval方法要安全很多。<br>JSON.stringify()将json对象解析为字符串
            </li>
            <li>9、基本对象
            <pre>
                var greet = 'Hello there';
            //为了使用split()方法，基本数据类型被转换成对象
            greet.split(' ')[0]; //Hello
            //试图增加一个原始数据类型并不导致错误
            greet.smile = true;
            //但是它并不实际运行
            typeof greet.smile; //undefined
            </pre>
            </li>
            <li>10、错误对象</li>
        </ul>
            </div>

非读书笔记
最近在做项目时无意中发现一个bug 
~location.search.indexOf('ks-debug') 这句前面的“~”是什么意思？是想转换为boolean类型？
那也应该是~~啊

```
var debug = ~location.search.indexOf('ks-debug');

if (debug !== true) {...}

```
此bug已存在很久了，就算是两个~~也代表是转换为数字类型的boolean值，值为1或0

**~~是一种利用符号进行类型转换，转换为数字类型的方式**

```
~~true == 1
~~false == 0
~~"" == 0
~~[] == 0

~~undefined ==0
~~!undefined == 1
~~null == 0
~~!null == 1
```