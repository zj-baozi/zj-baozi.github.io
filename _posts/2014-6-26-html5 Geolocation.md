---
layout: default
title: about media query
category: html5
comments: true
---

做h5开发，最经常用到的H5特性就是地理定位了，但一直用并没有仔细研究，周末有时间好好补了一下。
物理定位的应用场景很广，我能想到的有：

1. 显示当前位置，根据当前位位置进行一些推荐周边美食，旅游景点，等等。
2. 微信中好友的分享当前位置，便于迅速找到好友，或了解好友动态
3. 根据位置的移动计算移动的距离，从而计算运动距离，跟消耗的卡路里相结合就是健身软件了。
4. 还有很多。。。

## Geolocation Api的使用
1. 请求一个位置信息
2. 如果用户同意，浏览器就会返回位置信息，该信息通过支持h5地理定位功能的底层设备（笔记本，手机）提供给浏览器。
3. 位置信息由纬度、经度坐标和一些其他元数据组成。

**经纬度坐标分两种格式：**

1、十进制格式（39.17222）（h5 Geolocation API返回的为十进制格式）

2、DMS（Degree Minute Second，角度）格式（例如，39°11’20‘）

## 位置信息从何而来

**设备可以使用下列数据源：**

**IP地址**

优点：

1. 任何地方都可用
2. 在服务器端处理

缺点：

1. 不精确（经常出错，一般精确到城市级）

2. 运算代价大

**三维坐标**

优点：

1. 任何地方都可用
2. 在服务器端处理

缺点：

1. 不精确（经常出错，一般精确到城市级）

2. 运算代价大


**GPS（Global Positioning System，全球定位系统）
**

优点：

1. 很精确

缺点：

1. 定位时间长，用户耗电量大
2. 室内效果不好
3. 需要额外硬件设备




**从RFID、Wi-Fi和蓝牙到Wi-Fi的MAC地址（Wifi地理定位）
**

优点：

1. 精确
2. 可在室内使用
3. 可以简单，快捷定位

缺点：

1. 在乡村这些无线接入点较少的地区效果不好   
     
     
     
**GSM或CDMA手机的ID（手机地理定位）**

优点：

1. 相当准确
2. 可在室内使用
3. 可以简单、快捷定位
4. 

缺点：

1. 需要能够访问手机或其modem的设备

2. 在基站较少的偏远地区效果不好

**用户自定义数据**

优点：

1. 用户可以获得比程序定位服务更准确的位置数据
2. 允许地理定位服务的结果作为备用位置信息
3. 用户自行输入可能比自动检测更快

缺点：

1. 可能很不准确，特别是当用户位置变更后

## 检查浏览器支持性

```
function loadDemo(){
            if(navigator.geolocation){
                document.getElementById('support').innerHTML = 'Geolocation supported.';
            }else{
                document.getElementById('support').innerHTML = 'Geolocation is not supported.';
            }
        }
```
## 方法
**navigator.geolocation.getCurrentPosition(updateLocation,handleLocationError)**

navigator.geolocation.updateLocation

重要的位置数据都包含在了coords特性中：
latitude(纬度)
longitude(经度)
accuracy(准确度)

**错误编号设置在错误对象中，错误对象作为code参数传递给错误处理程序，而message特性可提供更详细的问题说明：**


PERMISSION_DENIED(错误编号1) -- 用户拒绝浏览器获得其位置信息。

POSITION_UNAVAILABLE（错误编号2）-- 尝试获取用户位置数据，但失败了

TIMEOUT(错误编号3）-- 设置了可选的timeout值。尝试确定用户位置的过程超时。

**navigator.geolocation.watchPosition**

重复更新

用于移动时不停的检测当前位置

**navigator.geolocation.clearWatch**

关闭更新

```
var watchId = navigator.geolocation.watchPosition(updateLocation,handleLocationError);

navigator.geolocation.clearWatch(watchId);
```
**可选的地理定位请求特性**

1. enableHighAccuracy（true/false）：通知浏览器启用html5 Geolocation服务的高精确度模式。（导致机器花费更多的时间和资源来确定位置，所以应谨慎使用）

2. timeout(ms)：告诉浏览器计算当前位置所允许的最长时间。如果在这个时间段内未完成计算，就会调用错误处理程序。

3. maximumAge(ms)：浏览器重新计算位置的时间间隔。

若浏览器没有在maximumAge设定时间之内更新过数据，它还是会重新获取数据。
这里的极限情况：如果将maximumAge设置为“0”则浏览器在每次请求时都需要获取数据，如果设置为Infinity则意味着不再重新获取数据。
