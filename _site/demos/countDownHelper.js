/**
 * @fileoverview 倒计时helper.
 * @author zhangjing.zj
 */
/**
 * KISSY.use('countDown',function(S,DateWithMePc){
*		new CountDownHelper(5,function(seconds){
             S.log(seconds);
         },function(){
             alert('完成');
         })
* });
 */
KISSY.add(function(S,Base) {
    /**
     *
     * @class CountDownHelper
     * @constructor
     * @extends Base
     */
    function CountDownHelper(countDownS,onTick,onComplete) {
        var self = this;
        var secondLeft = 0,
            interval;

        //调用父类构造函数
        CountDownHelper.superclass.constructor.call(self);
        var countDown = function(countDownS,onTick,onComplete){
            secondLeft = countDownS;
            var tick = function(){
                if(secondLeft > 0){
                    onTick(secondLeft);
                    secondLeft -= 1;
                }else{
                    clearInterval(interval);
                    onComplete();
                }
            };
            interval = setInterval(function(){
                 tick();
            },1000);
        };
        countDown(countDownS,onTick,onComplete);
        return {
            start:function(){
                clearInterval(interval);
                countDown(secondLeft,onTick,onComplete);
                return true;
            },
            stop:function(){
                clearInterval(interval);
                return true;
            },
            getTime:function(){
                return secondLeft;
            }
        }
    }


    S.extend(CountDownHelper, Base, /* @lends CountDownHelper.prototype */{



    },{
        ATTRS: {
        }
    });

    return CountDownHelper;

},{
    requires:['base']
});
