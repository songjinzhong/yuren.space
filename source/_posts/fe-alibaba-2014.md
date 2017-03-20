---
title: 阿里 14 年前端实习生招聘在线笔试题
layout: post
comments: true
hot: false
date: 2017-03-20 21:51:03
tags: [面试, JavaScript, CSS]
categories: 面试
description: 阿里 14 前端 实习生 招聘 在线 笔试题
photos:
- http://wx2.sinaimg.cn/mw690/e3dde130gy1fdtngqqrzjj20zk0njdlt.jpg
- http://wx2.sinaimg.cn/small/e3dde130gy1fdtngqqrzjj20zk0njdlt.jpg
---
我自己做的前端笔试题，虽然未在指定的时间答题，也未在规定的时间内完成，也不是独立完成。

校招内推的笔试快要开始了，最近陆续收到笔试的通知，尽管内推还在进行中。。（2017.3.18）

感觉是时候准备一下笔试的东西，虽然之前内推二面的时候让我用白纸手撸算法（冒泡）和正则表达式，我也是迫不及防呀。
<!--more-->
以下面试题均来自互联网，我会尽量贴上链接的。

## 2014 阿里巴巴前端实习招聘

先来 [2014真题](http://www.cnblogs.com/ayqy/p/4376465.html)。

ps：以下均为个人解法，正误未知，请谨慎！

### 1

>请在触摸屏下实现一个按钮，当按快速触碰按钮并放开手时，立刻弹出“成功”二字的提示框。

首先，看到触屏端，我是懵逼的，自己没有写过触屏端的点击事件，而且还是**快速触碰，并放开手**，难道不是用 click？？

貌似用的 `touchend`：

```html
<button id="btn">Click Me</button>

<script type="text/javascript">
var btn = document.getElementById("btn");
btn.addEventListener("touchend", function(){
  alert("成功");
}, false)
</script>
```

### 2

>请封装一个名叫 Counter 的计数器 Class，只有两个公有成员：完成计数动作，输出计数总数

如果让我来实现的话，有两种实现方式吧，一种是 es5，另一种是 es6，如果有时间和能力，都写吧！！

```javascript
//es5
function Counter(){
  this.c = 0;
}
Counter.prototype.add = function(){
  this.c ++;
}
Counter.prototype.print = function(){
  console.log(this.c);
}

// test
var counter = new Counter()
counter.print(); //0
counter.add();
counter.print(); //1
```

es6 看起来更方便些，但是本质都是一样的：

```javascript
//es6
class Counter{
  constructor(){
    this.id = 0;
  }
  add(){
    this.id ++;
  }
  print(){
    console.log(this.id);
  }
}

// test
var counter = new Counter();
counter.print(); //0
counter.add();
counter.print(); //1
```

### 3

>谈谈你对前端工程化/集成开发环境的理解和实践，借助前端工程化你还可以优化前端开发过程中的哪些环节？

这又是个啥问题呀，我不懂什么叫前端工程化呀，如果非要回答，我会把前几年前端行业比较火的，和最近今年前端比较火的框架、工具大致说一下，不知道这是不是答案。

[前端工程——基础篇](https://github.com/fouber/blog/issues/10)。

好吧，下一题！

### 4

>使用原生 JavaScript 给下面列表中的结点绑定点击事件，点击时创建一个 Object 对象，兼容 IE 和标准浏览器。

HTML:

```html
<ul id = “nav”>
  <li><a href=”http://ju.taobao.com/tg/brand.htm”>品牌团</a></li>
  <li><a href=”http://ju.taobao.com/tg/point_list.htm”>整点聚</a></li>
  <li><a href=”http://ju.taobao.com/jusp/jiazhuang/tp.htm”>聚家装</a></li>
  <li><a href=”http://ju.taobao.com/jusp/liangfan/tp.htm”>量贩团</a></li>
</ul>
Object:
{
“index” : 1, // 序号
“name” : “品牌团”,
“link” :“http://ju.taobao.com/tg/brand.htm”
}
```

当时看到这个题目的时候，我首先想到的是用事件委托来做，尤其当子元素的数量很大的时候，免去很多监听。但是又觉得不妥，因为输出来看的话，需要获得 index、name 和 likn，如果用委托，这是不好获取的，索性贴了两种代码，大家取舍。**注意兼容性！**

```html
// 委托
<script type="text/javascript">
(function(){
  function addEvent(ele, event, listener){
    if(ele.addEventListener){
      ele.addEventListener(event, listener, false);
    }else if(ele.attachEvent){
      ele.attachEvent('on' + event, listener);
    }else{
      ele['on' + event] = listener;
    }
  }

  var nav = document.getElementById('on');
  addEvent(nav, 'click', callbacks);

  function callbacks(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    var list_a = nav.getElementsByTagName('a'); // a 集合

    // 把 target 指向 a 标签
    if(target.nodeName.toLowerCase() == 'li'){
      target = target.children[0];
    }

    var ret = {};
    ret.index = [].indexOf.call(list_a, target) + 1;
    ret.name = target.textContent.replace(/^\s+|\s+$/g, '');
    ret.link = target.getAttribute('href');
    console.log(JSON.stringify(ret, null, 4));

    // 阻止默认事件
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }
})()
</script>
```

可以看到事件委托的，会发现找到当前点击的那个 li 很麻烦，不过当 li 很多的时候，对于整个页面是有很大优化的。

```html
<script type="text/javascript">
(function(){
  // 闭包
  addEvent // 同上
  var lis = document.getElementById('nav').getElementsByTagName('li');
  for(var i = 0; i < lis.length; i++){
    (function(x){
      addEvent(lis[x], 'click', function(e){
        e = e || window.event;
        var ret = {};

        ret.index = x + 1;
        ret.name = lis[x].children[0].textContent.replace(/^\s+|\s+$/g, '');
        ret.link = lis[x].children[0].getAttribute('href');

        console.log(ret);

        e.preventDefault ? e.preventDefault() : e.returnValue = false;
      })
    })(i)
  }
})()
</script>
```

相对来说，闭包要简单一些，但是必须要对闭包有很好的理解。

**我觉得这个题目出的还是相对较好的**。

### 5

>图片分析，请编写JS代码获取下图中“红框”的位置（“红框”的颜色为“FF0000”）

这个题目貌似 canvas 来实现，了解过，但没深入研究，这里一篇解答挺不错的。[阿里2014实习笔试题及答案整理](http://www.qdfuns.com/notes/16653/e71b13853934e9f28b3286bb70ca1e3a)。

### 6

>请实现下面浮层demo：

>这是一个盖在页面上的浮层，上下左右居中；

>浮层展示时，页面不可滚动；

>浏览器窗口缩小时，浮层跟着缩小，最小（320px）；

>窗口放大，浮层跟着放大，最大（650px）；

>尽可能用HTML5/CSS3方式写，可以不支持IE。

好吧，这题要让写 css 和 html，但我猜想，应该是让写一个 button，点击 button，显示悬浮窗。（这个题目是今年 2017 阿里校招暑假实习的在线编程题，用于简历评估的，让 30 分钟搞定）

```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
  <style type="text/css">
*{padding: 0; margin: 0;}
body{width: 100%; height: 100%;}
#layer{ position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 100; background: rgba(0,0,0,0.3); display: none; }
#layer .box{width: 60%; height: 400px; position: absolute; left: 0; right: 0; top: 0; bottom: 0; max-width: 650px; min-width: 320px; margin: auto; background: white}
#layer.show{display: block;}
</style>
</head>
<body>
  <button id="open">open</button>
  <div id="layer">
    <div class="box">
      <h2>悬浮窗</h2>
      <p>testtesttesttesttesttesttesttesttest</p>
      <button id="close">close</button>
    </div>
  </div>
  <script type="text/javascript">
var open = document.getElementById('open'),
  close = document.getElementById('close'),
  layer = document.getElementById('layer');
open.addEventListener('click', function(){
  layer.className = 'show';
}, false)
close.addEventListener('click', function(){
  layer.className = '';
}, false)
  </script>
</body>
</html>
```

可能原作者的配图有问题，这题还是按照自己的理解来写吧，随便写了，没有经过测试。。(打开浏览器测试了下，也没啥大问题)

### 7

>有一个int型数组，里面有若干数字。要求统计出一共有多少种不同的数字？每种数字出现的频率从少到多排列，频率相同则从小到大排列。

我的解决思路：

```html
<script type="text/javascript">
var sortArray = (function(){
  function sortArray(arr){
    if(!Array.isArray(arr)){
      return false;
    }

    var hash = {},
      ret = [];
    arr.forEach(function(v){
      hash[v] ? hash[v].num ++ : hash[v] = {num : 1};
    })

    for(var i in hash){
      ret.push({
        value: i,
        num: hash[i].num
      })
    }

    ret.sort(function(a, b){
      return a.num == b.num ?
        parseInt(a.value) - parseInt(b.value) :
        a.num - b.num;
    })

    console.log('共有 ' + ret.length + ' 种不同数字');
    ret.forEach(function(v){
      console.log(v.value);
    })
  }
  return sortArray;
})()
</script>
```

### 8

>HTTP协议是无状态的，为了保持用户会话状态使用了什么技术方案弥补；该技术方案在用户禁用了cookie之后，还有什么方式实现（可不考虑安全性）

关于 HTTP 协议的无状态，指的是每次客户端向服务器请求，都是独立的，互不干扰的，如果请求资源是同步的，那麻烦就大了。所以，有时候会把一些状态信息放到 cookie 中，这样服务器就知道是谁发起了本次请求。

除了 cookie，session 也可以实现，两者实现机理是一样的，保存位置不同。貌似还有 hidden 表单和 QueryString 来实现。网上找了[一篇文章](https://my.oschina.net/sunmin/blog/535892)看的，不知道对不对。

### 9

>现有一个字符串richText，是一段富文本，需要显示在页面上。有个要求，需要给其中只包含一个img元素的p标签增加一个叫pic的class。请编写代码实现。可以使用jQuery或KISSY。

还是看不懂这个题目是什么意思，大概是让实现插入一段富文本，但是富文本是一种什么样的格式呢，和 markdown 一样？到底什么是富文本，第二个问题和这个有联系？

```html
<div class="container"></div>
<button id="btn">Insert</button>
<p><img src=""></p>

<script type="text/javascript">
// jquery
(function(){
  // richText
  var richText = 'test';
  $('#btn').on('click', function(){
    $('.container').html(richText);
    $('p').filter(function(){
      return $('img', this).length == 1;
    }).addClass('pic');
  })
})()
</script>
```

不知道这个题目什么意思。。

### 10

>题目：实现一个简单的返回顶部组件的功能。要求：

>当页面向下滚动距顶部一定距离（如100px）时出现，向上回滚距顶部低于同样距离时隐藏，点击返回顶部组件时页面滚动到顶部；

>请写出HTML、CSS和JavaScript；

>要求支持IE6以上、Chrome、Firefox

看到支持 IE6，就知道这是一个变态题目，鬼知道 IE6 不知道哪些函数。。IE 去死吧。

```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
  <style type="text/css">
*{padding: 0; margin: 0;}
#top{padding: 10px; position: fixed; bottom: 10px; right: 10px; background: black; color:white; cursor: pointer; transition: 0.5s;}
.none{transform: translateY(100px);}
</style>
</head>
<body>
  <div style="width: 100%; height: 3000px"></div>
  <div id="top" class="none">
    <a>Top</a>
  </div>
  <script type="text/javascript">
(function(){
  function addEvent(ele, event, listener){
    if(ele.addEventListener){
      ele.addEventListener(event, listener, false);
    }else if(ele.attachEvent){
      ele.attachEvent('on' + event, listener);
    }else{
      ele['on' + event] = listener;
    }
  }

  var top = document.getElementById('top');
  addEvent(top, 'click', function(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    top.setAttribute('class', 'none');
  })

  function handleTop(){
    var st = document.body.scrollTop || document.documentElement.scrollTop;
    var className = st > 300 ? '' : 'none';
    top.setAttribute('class', className);
  }

  //判断是非为 IE 浏览器
  if(window.attachEvent){
    addEvent(window, 'scroll', handleTop);
  }else{
    addEvent(document, 'scroll', handleTop);
  }
})()
  </script>
</body>
</html>
```

IE6 支持 [attachEvent](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop) 和 [getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute)。

如果对于 IE 浏览器，需要对 window 监听，对 document 监听是没用的。当然，也可以写成只对 window 监听，貌似这样更好一些，就不用判断了。

除此之外，如果不用 scroll，还有一个比较好的实现办法，就是用 id 来实现：

```html
<!DOCTYPE html>
<html>
<head>
  <title></title>
  <style type="text/css">
*{padding: 0; margin: 0;}
#top{padding: 10px; position: fixed; bottom: 10px; right: 10px; background: black; color:white; cursor: pointer; transition: 0.5s;}
#top a{color: white;}
.none{transform: translateY(100px);}
</style>
</head>
<body>
  <div id="header" style="height: 0;"></div>
  <div style="width: 100%; height: 3000px"></div>
  <div id="top" class="none">
    <a href="#header">Top</a>
  </div>
  <script type="text/javascript">
(function(){
  function addEvent(ele, event, listener){
    if(ele.addEventListener){
      ele.addEventListener(event, listener, false);
    }else if(ele.attachEvent){
      ele.attachEvent('on' + event, listener);
    }else{
      ele['on' + event] = listener;
    }
  }

  var top = document.getElementById('top');

  function handleTop(){
    var st = document.body.scrollTop || document.documentElement.scrollTop;
    var className = st > 300 ? '' : 'none';
    top.setAttribute('class', className);
  }

  //判断是非为 IE 浏览器
  if(window.attachEvent){
    addEvent(window, 'scroll', handleTop);
  }else{
    addEvent(document, 'scroll', handleTop);
  }
})()
  </script>
</body>
</html>
```

只需要考虑 top 按钮的显示和隐藏就 ok 了，这种方法也经常有人使用的。

## 总结

说实话，这十个题目，做下来，如果能在 60 分钟全做完的，先不论答案的对错，只要每题基本思路都能到位，我是非常佩服的。涉及的面比较广也比较基础，总而言之，这套题目没看起来的那么简单。

## 参考

>[阿里巴巴2014实习生前端招聘在线笔试题](http://www.cnblogs.com/ayqy/p/4376465.html)
>[阿里2014实习笔试题及答案整理](http://www.qdfuns.com/notes/16653/e71b13853934e9f28b3286bb70ca1e3a)