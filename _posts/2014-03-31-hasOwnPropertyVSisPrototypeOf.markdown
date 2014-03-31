---
layout: post
title:  hasOwnProperty VS isPrototypeOf
date:   2014-03-31 14:18:21
categories: 笔记
---

<div class="entry">


                hasOwnProperty 确定某个对象是否具有带指定名称的属性。(是否是自己的属性而非从原型链上继承来的。)<br>
                参考地址： <br>
                <a href="http://msdn.microsoft.com/zh-cn/library/ie/328kyd6z(v=vs.94).aspx">http://msdn.microsoft.com/zh-cn/library/ie/328kyd6z(v=vs.94).aspx</a> <br>

                object.hasOwnProperty(proName) <br>

                参数：<br>
                object 必需。对象的实例。 <br>
                proName 必需。一个属性名称的字符串值。<br>

                如果object具有带指定名称的属性，则 hasOwnProperty方法返回true,否则返回false。此方法不会检查对象原型链中的属性；该属性必须是对象本身的一个成员。<br>
                IE8及更低版本的<a href="/2014/03/15/javascript模式/javascript-object.html">宿主对象</a>不支持该属性 <br>
                (什么是宿主对象？<br>
                就是执行JS脚本的环境提供的对象。对于嵌入到网页中的JS来说，其宿主对象就是浏览器提供的对象，所以又称为浏览器对象，如IE、Firefox等浏览器提供的对象。不同的浏览器提供的宿主对象可能不同，即使提供的对象相同，其实现方式也大相径庭！这会带来浏览器兼容问题，增加开发难度。浏览器对象有很多，如window和document等等。<br> )


                那在IE8该如何解决呢？ <br>
                使用Object.prototype.hasOwnProperty.call()   <br>

                参考地址：<a href="http://www.sbssw.com/msie8%E4%B8%AD%EF%BC%8Cdom%E4%B8%8D%E6%94%AF%E6%8C%81hasownproperty%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/">http://www.sbssw.com/msie8%E4%B8%AD%EF%BC%8Cdom%E4%B8%8D%E6%94%AF%E6%8C%81hasownproperty%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/</a>
                <br><br><br>
                <pre>
                    (function(){
                           Object.prototype.bar = 1;
                            var foo = {goo:undefined};
                            console.log(foo.bar); //
                            'bar' in foo;
                            foo.hasOwnProperty('bar'); //false
                            foo.hasOwnProperty('goo'); //true

                            //使用其它对象的hasOwnProperty，并将其上下文设置为foo
                            ({}).hasOwnProperty.call(foo,'bar');

                        })();
                    <script>
                        (function(){
                           Object.prototype.bar = 1;
                            var foo = {goo:undefined};
                            console.log(foo.bar); //
                            'bar' in foo;
                            foo.hasOwnProperty('bar'); //false
                            foo.hasOwnProperty('goo'); //true

                            //使用其它对象的hasOwnProperty，并将其上下文设置为foo
                            ({}).hasOwnProperty.call(foo,'bar');

                        })();
                    </script>
                </pre>
               isPrototypeOf 确定一个对象是否存在于另一个对象的原型链中（用来判断要检查其原型链的对象是否存在于指定对象实例中）。<br>
               object1.isPrototypeOf(object2) <br>
               object1 必需。对象原型 <br>
               object2 必需。另一个对象，将对其原型链进行检查。 <br>
               如果object2的原型链中具有object1，则isPrototypeOf方法返回true.原型链用于在同一个对象类型的不同实例之间共享功能。当object2不是对象或当object1没有出现在object2的原型链中时，isPrototypeOf方法返回false.<br>
                <pre>
                    (function(){


                        function Rectangle(){

                        }
                        var rec = new Rectangle();
                        console.log(Rectangle.prototype.isPrototypeOf(rec));

                        function SiteAdmin(nickName,siteName){
                            this.nickName = nickName;
                            this.siteName = siteName;
                        }
                        SiteAdmin.prototype.showAdmin = function(){
                            console.log(this.nickName + '是' + this.siteName +'的站长！');
                        };
                        SiteAdmin.prototype.showSite = function(siteUrl) {
                            this.siteUrl=siteUrl;
                            return this.siteName+"的地址是"+this.siteUrl;
                        };
                        var matou = new SiteAdmin('豹子','前端记录');
                        var matou2 = new SiteAdmin('test','前端记录2');
                        matou.age = '120';
                        console.log(matou.hasOwnProperty('nickName')); //
                        console.log(matou.hasOwnProperty('age')); //
                        console.log(matou.hasOwnProperty('showSite')); //
                        console.log(SiteAdmin.prototype.isPrototypeOf(matou)); //
                    })();
                </pre>
                <script>
                    (function(){


                        function Rectangle(){

                        }
                        var rec = new Rectangle();
                        console.log(Rectangle.prototype.isPrototypeOf(rec));

                        function SiteAdmin(nickName,siteName){
                            this.nickName = nickName;
                            this.siteName = siteName;
                        }
                        SiteAdmin.prototype.showAdmin = function(){
                            console.log(this.nickName + '是' + this.siteName +'的站长！');
                        };
                        SiteAdmin.prototype.showSite = function(siteUrl) {
                            this.siteUrl=siteUrl;
                            return this.siteName+"的地址是"+this.siteUrl;
                        };
                        var matou = new SiteAdmin('豹子','前端记录');
                        var matou2 = new SiteAdmin('test','前端记录2');
                        matou.age = '120';
                        console.log(matou.hasOwnProperty('nickName')); //
                        console.log(matou.hasOwnProperty('age')); //
                        console.log(matou.hasOwnProperty('showSite')); //
                        console.log(SiteAdmin.prototype.isPrototypeOf(matou)); //
                    })();
                </script>
            </div>