---
title: 'JS 获得浏览器类型和版本'
layout: post
comments: true
date: 2016-11-20 10:09:41
tags: [JavaScript, 浏览器, 正则表达式]
categories: JavaScript
description: JS 浏览器 类型
photos:
- http://ww4.sinaimg.cn/mw690/e3dde130gw1f9ycsiw1xsj20zk0ns7iv.jpg
- http://ww4.sinaimg.cn/small/e3dde130gw1f9ycsiw1xsj20zk0ns7iv.jpg
---
最近碰到了一个问题，判断浏览器的类型，我们熟知的 IE, Firefox, Opera, Safari, Chrome 五款比较有名的浏览器，有时候需要考虑兼容性问题，当然，即使是同一款浏览器，不同的 version 也会带来很多麻烦。

<!--more-->

在 Chrome 没有出来之前，IE 一直都是浏览器行业的领袖和标准，但是 IE 的难用简直了。Chrome 的核心是 Webkit，它开源了一套浏览器引擎 chromium，然后现在好多浏览器都采用多核，这给判断浏览器的类型带来不少麻烦。

js 判断浏览器的类型，使用的是 JavaScript Navigator 对象的，说白了还是通过正则表达式去匹配字段。当然这里也有很多大牛总结的经验，[传送门1](https://segmentfault.com/a/1190000000502973)，[传送门2](http://keenwon.com/851.html)，[传送门3](http://www.xiariboke.com/design/2904.html)。

## 各大浏览器的 userAgent 值

首先需要知道 navigator 接口对象的值表示哪些意思，[Navigator MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator)。

作为一个前端，常备各种浏览器，用来调试浏览器的兼容。下面是各大浏览器输出 `navigator.userAgent` 的值：

1. **IE 8**：Mozilla/4.0 (compatible; **MSIE 8.0**; Windows NT 10.0; WOW64; Trident/8.0; .NET4.0C; .NET4.0E; InfoPath.3; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)
2. **IE 11**：Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.3; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; **rv:11.0) like Gecko**
3. **win EDGE**：Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 **Edge/12.10240**
4. **FireFox**：Mozilla/5.0 (Windows NT 10.0; WOW64; rv:49.0) Gecko/20100101 **Firefox/49.0**
5. **Chrome**：Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) **Chrome/54.0.2840.71** Safari/537.36
6. **Opera**：Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36 **OPR/41.0.2353.56**
7. **Safari**：mozilla/5.0 (windows; u; windows nt 5.1; zh-cn) applewebkit/533.16 (khtml, like gecko) version/5.0 **safari/533.16**
8. **360安全浏览器**：Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36
9. **QQ浏览器**：Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.1708.400 **QQBrowser/9.5.9635.400**

IE 11 版本比之前版本的 userAgent 发生很大的变化，你现在从网上搜的话，发现很多代码都无法支持 ie 11 的判断，上限是 ie 10。

下面针对列表中的浏览器，总结了一下：

1. IE 10 之前的版本，匹配关键字 `MSIE 8.0`；
2. IE 11 要通过 `rv:11.0) like Gecko` 来匹配；
3. EDGE 通过 `Edge/12.10240`；
4. Firefox 通过 `Firefox/49.0`；
5. Chrome 通过 `Chrome/54.0.2840.71`，但是会发现，后面的浏览器都是基于 Chrome 内核（safari 除外），但是 Chrome 又是基于 safari 内核的。。
6. Opera 通过 `OPR/41.0.2353.56`，但是网上普遍是通过 `opera` 字段，我这款浏览器没有 opera 字段，难道是盗版？
7. Safari 通过 `safari/533.16` 来匹配；
8. 360 和 QQ 都是基于 Chrome 内核的，当然 QQ 还能通过 `QQBrowser/9.5.9635.400`，如果你高兴去匹配的话。

## 获取浏览器类型和版本

介绍完浏览器的 userAgent 信息，下面就是写正则来判断了：

```javascript
function getExplore(){
  var Sys = {};  
  var ua = navigator.userAgent.toLowerCase();  
  var s;  
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
  (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :  
  (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
  (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :  
  (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :  
  (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :  
  (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;  
  // 根据关系进行判断
  if (Sys.ie) return ('IE: ' + Sys.ie);  
  if (Sys.edge) return ('EDGE: ' + Sys.edge);
  if (Sys.firefox) return ('Firefox: ' + Sys.firefox);  
  if (Sys.chrome) return ('Chrome: ' + Sys.chrome);  
  if (Sys.opera) return ('Opera: ' + Sys.opera);  
  if (Sys.safari) return ('Safari: ' + Sys.safari);
  return 'Unkonwn';
}
```

从关系判断中，我们会发现**判断的顺序很重要**，原因是很多浏览器都是多核的。

如果只是简单判断浏览器类型，不需要知道版本号，还可以通过下面的方法（此方法也可以用正则改成匹配版本号）：

```javascript
function getExploreName(){
  var userAgent = navigator.userAgent;
  if(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1){
    return 'Opera';
  }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1){
    return 'IE';
  }else if(userAgent.indexOf("Edge") > -1){
    return 'Edge';
  }else if(userAgent.indexOf("Firefox") > -1){
    return 'Firefox';
  }else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1){
    return 'Safari';
  }else if(userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1){
    return 'Chrome';
  }else if(!!window.ActiveXObject || "ActiveXObject" in window){
    return 'IE>=11';
  }else{
    return 'Unkonwn';
  }
}
```

同样，**判断顺序很重要**。

window 用户可以通过修改注册表来更改 userAgent 内容，会对判断造成影响，不知道还有没有其他的更好的方法来判断。

## 一些其他手段

如果只是单单判断是否是 IE 浏览器，那就好办了，可以通过一些特有函数来判断。

比如 `window.attachEvent` 在 IE<=10 是有定义的，其他浏览器是 underfined。

```javascript
if(window.attachEvent){
  console.log('IE <= 10');
}else{
  console.log('not IE or IE >=11');
}
```

## 总结

最近在弄一个非常有意思的烟花特效，基于 canvas，但是有一个非常严重的问题是在 Chrome 内核的浏览器下运行很流畅，在 Firefox 或 Safari 下面就很卡，IE 下面也是惨不忍睹，这让我对 Chrome 又有了一个新的认识。[项目地址](https://github.com/songjinzhong/fireworks)，[DEMO 地址](https://songjinzhong.github.io/fireworks/)。

## 参考

>[js/jquery判断浏览器的方法总结](https://segmentfault.com/a/1190000000502973)
[JavaScript判断浏览器类型及版本（新增IE11）](http://keenwon.com/851.html)
[JS判断浏览器类型的方法总结](http://www.xiariboke.com/design/2904.html)