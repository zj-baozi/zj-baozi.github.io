(function(win,libs){
    /*
     * 先设计API：
     * slideTo(idx) 滑动至第idx个区块
     * begin() 开始播放
     * end() 停止播放
     *
     * */

     //判断浏览器是否支持transform（仅webkit）
    var hasTranform = function(){
      var ret = ('WebkitTransform' in document.documentElement.style) ? true: false;
      return ret;
    };
    var has3d = function() { // 判断浏览器是否支持3d效果（仅webkit）
        var ret = false,
            div = document.createElement('div'),
            style = ['&#173;','<style id="smodernizr">', '@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', '</style>'].join(''),
            mStyle = document.documentElement.style;
        div.id = 'modernizr';
        div.innerHTML += style;
        document.body.appendChild(div);
        if ('WebkitPerspective' in mStyle && 'webkitPerspective' in mStyle) {
            ret = (div.offsetLeft === 9 && div.offsetHeight === 3);
        }
        div.parentNode.removeChild(div);
        return ret;
    }
    var gv1 = has3d ? 'translate3d(' : 'translate(';
    var gv2 = has3d ? ',0)' : ')';
    var css = function( el , props ){
        for( var key in props ){
            el.style[ key ] = props[ key ] ;
        }
    }
    var removeClass = function( el , cls ){
        el.className= el.className.replace( new RegExp(  "(?:^|\\s)" + cls + "(?:\\s|$)" , "ig") , " " ).trim() ;
    }
    var addClass = function( el , cls ){
        var reg =  new RegExp(  "(?:^|\\s)" + cls + "(?:\\s|$)" ) ;
        var ocls = el.className ;
        if( ! reg.test( ocls ) ){
            el.className = ocls + " " + cls
        }
    }
    /*
     *
     * 实现思路：
         1、touchstart，手指滑动开始时：
             1）、记录刚刚按下的时间
             2）、记录手指按下的坐标
             3）、清除偏移量

         2、手指滑动（touchmove）时改变图片所在区域的left值，这个left值，可以是通过position来实现，或者通过translate3d或translate来实现
             1）、计算手指的偏移量
             2）、修改dom中的css，以此实现滑动

         3、手指滑动结束时（touchend）
             1）、判断边界就翻页（移动的偏移量 大于 屏幕宽度/6）
             2）、记录手指抬起的时间值
             3）、当手指移动时间超过300ms的时候，按位移算，否则快速翻页
     *
     * */

    var TouchSlider = function(container,options){
        //构建函数
        this.wrap = document.getElementsByClassName('slider')[0];

        //屏幕宽度
        this.scaleW = window.innerWidth;
        this.sliderWrap = document.querySelector('.slider-wrap');
        this.items = this.sliderWrap.getElementsByTagName('li');
        this.itemsLen = this.items.length;
        this.startTime = 0;
        //设定初始值的index
        this.idx = 0;
        this.left = 0;
        this.steps = this.steps || this.wrap.clientWidth;
        this.sliderWrap.style.width =  this.items[0].offsetWidth *               this.itemsLen + 'px';
        this.bindEvent();
    };
    TouchSlider.prototype = Object.create({
        //
        bindEvent:function(){
            var self = this;
            this.wrap.addEventListener('touchstart',function(ev){
                self.startHandler(ev);
            },false);
            this.wrap.addEventListener('touchmove',function(ev){
                self.moveHandler(ev);
            },false);
            this.wrap.addEventListener('touchend',function(ev){

                self.endHandler(ev);
            },false);

        },

        startHandler:function(ev){
            var self = this;

            //记录刚刚按下的时间
            self.startTime = +new Date();

            //手指按下时坐标
            self.startX = ev.touches[0].pageX;
            //清除偏移量
            self.offsetX = 0;



        },
        moveHandler:function(ev){
            var self = this,
                sliderWrap = document.querySelector('.slider-wrap');
            //阻止默认事件
            ev.preventDefault();
            //如果是多指的话return
            if(ev.touches.length > 1 || (ev.scale && ev.scale !== 1)){

                return;
            }
            //计算手指的偏移量
            self.offsetX = ev.targetTouches[0].pageX - self.startX;
            console.log(self.idx);
            //console.log(self.steps);
            var tmsLeft = 0 - self.idx * self.steps + self.offsetX;


            //todo 判断手指是否是左右移动，而非上下

            console.log(tmsLeft);
            //self.offsetX = ev.targetTouches[0].pageX - self.startX;
            sliderWrap.style.webkitTransform = 'translate3d(' + tmsLeft + 'px,0,0)';





        },
        endHandler:function(ev){
            var self = this,
                scaleW = window.innerWidth;
            //debugger;
            ev.preventDefault();

            //边界值
            var boundary = scaleW/6;
            var distance = this.offsetX;

            if(distance < -10){
                this.forward();
            }else if(distance > 10){
                this.backward();
            }


            //判断边界就翻页（移动的偏移量 大于 屏幕宽度/6）


            /*if(self.offsetX >= boundary){


             }else if(self.offsetX < boundary){
             this.goIndex(self.idx + 1);
             self.idx = self.idx + 1;
             }else{
             this.goIndex(self.idx);
             }*/
        },
        forward:function(){
            var self = this;
            self.idx = self.idx +1;

            if(self.idx >= self.itemsLen){
                self.idx = 0;
            }
            this.slideTo(self.idx);


        },
        backward:function(){
            var self = this;
            self.idx -= 1;
            if(self.idx < 1){
                self.idx = 1;
            }
            this.slideTo(self.idx);
        },
        slideTo:function(idx){
            var self = this,
                sliderWrap = document.querySelector('.slider-wrap');

            //没有动画？加上下面的这段就可以了。
            sliderWrap.style.webkitTransition = '-webkit-transform 0.3s ease';

            sliderWrap.style.webkitTransform = 'translate3d(-' + self.scaleW * idx + 'px,0,0)';

            self.left = self.scaleW * idx;

        }

    });

    libs.Slider = TouchSlider;
})(window,window['libs']||(window['libs'] = {}));