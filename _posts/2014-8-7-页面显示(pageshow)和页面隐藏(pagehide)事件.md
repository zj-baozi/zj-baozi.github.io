---
layout: default
title: 页面显示(pageshow)和页面隐藏(pagehide)事件
category: html5
comments: true
---

##bfcache
Firefox和Opera有一个新特性，名叫“往返缓存”（back-forward cache，或**bfcache**），可以在用户使用浏览器的“后退”和“前进”按钮时加快页面的转换速度。这个缓存中不仅保存着页面数据，还保存了DOM和JavaScript的状态；实际上是将整个页面都保存在了内存里。如果页面位于bfcache中，那么再次打开该页面就不会触发load事件。尽管由于内存中保存了整个页面的状态，不触发load事件也不应该会导致什么问题，但为了更形象地说明bfcache的行为，Firefox还是提供了一些新事件。

##pageshow

第一个事件就是pageshow，这个事件在页面显示时触发，无论页面是否来自bfcache。在重新加载页面中，pageshow会在load事件触发后触发；而对于bfcache中的页面，pageshow会在页面状态完全恢复的那一刻触发。另外要注意的是，虽然这个事件的目标是document，但必须将其事件处理程序添加到window。来看下面的例子：

```

var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};
(function () {
    var showCount = 0;
    EventUtil.addHandler(window, "load", function () {
        alert("Load fired");
    });
    EventUtil.addHandler(window, "pageshow", function (event) {
        showCount++;
        alert("Show has been fired " + showCount + " times.");
    });
})();
```

这个例子使用了私有作用域，以防止变量showCount进入全局作用域。当页面首次加载完成时，showCount的值为0。此后，每当触发pageshow事件，showCount的值就会递增并通过警告框显示出来。如果你在离开包含以上代码的页面之后，又单击“后退”按钮返回该页面，就会看到showCount每次递增的值。这是因为该变量的状态，乃至整个页面的状态，都保存在了内存中，当你返回这个页面时，它们的状态得到了恢复。如果你单击了浏览器的“刷新”按钮，那么showCount的值会被重置为0，因为页面已经完全重新加载了。
##persisted

除了通常的属性之外，pageshow事件的event对象还包含一个名为persisted的布尔值属性。如果页面中保存在了bfcache中，则这个属性的值为true；否则，这个属性的值为false。可以像下面这样在事件处理程序中检测这个属性：

```
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};
(function () {
    var showCount = 0;
    EventUtil.addHandler(window, "load", function () {
        alert("Load fired");
    });
    EventUtil.addHandler(window, "pageshow", function (event) {
        showCount++;
        alert("Show has been fired " + showCount + " times.Persisted? " + event.persisted);
    });
})();
```

通过检测persisted属性，就可以根据页面在bfcache中的状态来确定是否需要采取其它操作。

与pageshow事件对应的是pagehide事件，该事件会在浏览器卸载页面的时候触发，而且是在unload事件之前触发。与pageshow事件一样，pagehide在document上面触发，但其事件处理程序必须要添加到Windows对象。这个事件的event对象也包含persisted属性，不过其用途稍有不同，来看下面的例子：

```
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};
EventUtil.addHandler(window, "pagehide", function (event) {
    alert("Hiding. Persisted? " + event.persisted);
});
```

有时候，可能需要在pagehide事件触发时根据persisted的值采取不同的操作。对于pageshow事件，如果页面是从bfcache中加载的，那么persisted的值就是true；对于pagehide事件，如果页面在加载之后会保存在bfcache中，那么persisted的值也会被设置为ture。因此，当第一次触发pageshow时，persisted的值一定是false，而在第一次触发pagehide时，persisted就会变成true(除非页面不会保存在bfcache中)。

**(自注：经测试这个persisted似乎一直为true)**

指定了onunload事件处理程序的页面会被自动排除在bfcache之外，即使事件处理程序是空的。原因在于，onunload最常用于撤销在onload中所执行的操作，而跳过onload后再次显示页面很可能会导致页面不正常。