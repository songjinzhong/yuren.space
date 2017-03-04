---
title: 给 Hexo 添加带滚动监听的文章目录
layout: post
comments: true
date: 2017-03-04 13:38:18
tags: [JavaScript, jQuery, 建站]
categories: JavaScript
description: 给 Hexo 添加 滚动 监听 文章 目录
photos:
- http://wx1.sinaimg.cn/mw690/e3dde130gy1fdarwi0zjtj20zk0qo7ch.jpg
- http://wx1.sinaimg.cn/small/e3dde130gy1fdarwi0zjtj20zk0qo7ch.jpg
---
我自己的 Hexo 博客，本来是没有文章目录的，使用的时候，总觉得会很别扭，主要还是怕别人读你文章的时候，get 不到重点，而且文章目录也能快速定位。
<!--more-->
每次使用 segmentfault 的时候，感觉它的文章目录做的挺好的，[SF 文章目录](https://segmentfault.com/a/1190000008494176)。

其实 Hexo 是支持文章目录的，[这篇文章](http://www.jianshu.com/p/ac853e1afedb)就对如何添加目录进行了介绍。

大概几周之前，我把文章目录添加到了博客样式中，随后又添加了滚动监听。最近看面试题的时候，发现原来还可以消除抖动，又涨了见识，并且运用到自己的博客中。

## 添加 Hexo toc 模块

看了 Hexo 的官网教程，发现原来 toc 已经被 Hexo 默认支持了，只需要在模版文件中引入即可，比如像下面：

```
<div id="toc">
  <div class="toc-header">
    <i class="toc-icon"></i>
    文章目录
  </div>
  // 添加目录模块
  {{ toc(page.content) }}
</div>
```

`toc` 这个函数，它可以把 `page.content` 中可以作为目录（一级二级三级）元素都提取出来，然后按照一定的格式，生成与 content 相对应的文章目录。下面这个格式就是上面生成的结下：

![](http://wx3.sinaimg.cn/mw690/e3dde130gy1fdasnzxz88j20o80dojug.jpg)

光这样还不行，还需要添加对应的样式，下面是我在 stylus 文件中的样式：

```
#toc{
  position fixed
  top 0px
  left 50%
  padding 10px 0 10px 0
  z-index 2
  margin-left 400px
  margin-top 8px
  line-height 1.5
  background-color rgba(242, 243, 241, 0.6)
  padding-right 5px
  width 160px
  & .toc-icon{
    font-size 14px
    position absolute
    cursor pointer
    right 0px
    top 0px
    padding 10px
  }
  & .toc-header{
    font-weight 700;
    border none;
    padding 8px 12px;
    font-size 20px;
    position relative
  }
  & .close{
    display none
  }
  & .toc{
    list-style none
    position relative
    font-size 16px
    padding-left 8px
    overflow-x hidden;
    & a{
      color #4a75b5
      &:hover{
        color #ef593e
        text-decoration none
      }
    }
    & ol, & ul{
      list-style-type disc
    }
    & .toc-child{
      padding-left 20px
      font-size 12px
      display none
      & span.toc-number{
        display none
      }
    }
    & .active~.toc-child{
      display block
    }
    & .toc-child.toc-show{
      display block
    }
    & .toc-link{
      white-space nowrap
    }
    & .toc-link.active{
      color #ef593e
    }
    &:before{
      content '';
      display block;
      position absolute;
      background #eee;
      width 3px;
      top 0;
      bottom 0;
      border-radius 5px;
      left 0;
    }
  }
  @media (max-width: 1100px){
    display none
  }
}
```

效果如下：

![](http://wx1.sinaimg.cn/mw690/e3dde130gy1fdassz15eoj20am0cawf5.jpg)

关于点击关闭按钮，文章目录就必会的功能就不在此阐述了。

## 实现滚动监听

光添加了目录，还远远是不够的，一个做得很棒的目录，都会有监听滚动并且目录会随着改变。

看了 Bootstrap 提供的 [scrollspy](http://www.tutorialspoint.com/bootstrap/bootstrap_scrollspy_plugin.htm) 库，有监听功能，貌似效果还不错的样子。因为我博客中包含了 jQuery 库，所以就尝试用 jQuery 自己实现了一个。

介绍实现之前，需要对 Hexo 博客的板块特点进行介绍。

在 post content 中，最终会将 markdown 生成对应的 html，对于一般的 H 标题，生成的格式一般如下：

```
<h2 id="添加-Hexo-toc-模块">
  <a href="#添加-Hexo-toc-模块" class="headerlink" title="添加 Hexo toc 模块"></a>
  添加 Hexo toc 模块
</h2>
```

在正式的标题之前，一般都会有一个空的 a 标签，它的 class 为 `headerlink`，可以借助这个来生成一个 `$('.headerlink')` jQuery 对象。然后配合 `$('.toc-link')`，这两个 jQuery 对象就**一一对应了**。

大致的思路就是首先获取每个 headerlink 距离 top 的高度，存储在数组 `headerlinkTop` 里，然后监听浏览器的 scroll，当滚动到 headerlinkTop 的某一个元素时，将 toc 按照 i 的位置设置 active：

```javascript
var $w = $(window);
// 修正响应不及时的问题
var HEADFIX = 30;

var $toclink = $('.toc-link'),
  $headerlink = $('.headerlink'),
  $tocchild = $('.toc-child');

// 用来获取 top 数组
var headerlinkTop = [];
headerlinkTop = $.map($headerlink, function(link) {
  return $(link.parentNode).offset().top - HEADFIX;
});

// 修正参数，将第一个元素置为 -1
headerlinkTop[0] = -1;
// 最后添加一个 无穷大
headerlinkTop.push(Infinity);

var pos = 0;
var getActive = function(s_top){
  for(var i = 0; i < $toclink.length; i++){
    var currentTop = headerlinkTop[i];
    var nextTop = headerlinkTop[i+1];

    if(s_top > currentTop && s_top <= nextTop){
      $toclink.removeClass('active');
      $tocchild.removeClass('toc-show');
      pos = i;
      var nowlink = $toclink[i];
      $(nowlink).addClass('active');
      while($(nowlink.parentNode.parentNode).hasClass('toc-child')){
        nowlink = nowlink.parentNode.parentNode;
        $(nowlink).addClass('toc-show');
      }
      break;
    }
  }
}
getActive($w.scrollTop());

// 修复 image load bug
// 由于网页已经加载，而图片还未加载完成，导致数组的高度有偏差
var link_length = $headerlink.length;
var $link_last = link_length > 1 ? $($headerlink[$headerlink.length - 1].parentNode) : null;
var fixLoading = function(){
  if(link_length > 1 ){
    if(($link_last.offset().top - HEADFIX) - headerlinkTop[link_length - 1] != 0){
      headerlinkTop = $.map($headerlink, function(link) {
        return $(link.parentNode).offset().top - HEADFIX;
      });
      // 修正参数
      headerlinkTop[0] = -1;
      headerlinkTop.push(Infinity);
      console.log('fix loading bug!');
    }
  }
}

// callback
var cb = function(){
  var scrollTop = $w.scrollTop();
  fixLoading();
  if(scrollTop > headerlinkTop[pos + 1] || scrollTop <= headerlinkTop[pos]){
    getActive(scrollTop);
    console.log('jump!');
  }
}

if(!this.doScroll){
  this.doScroll = true;
  // 监听浏览器滚动
  $w.scroll(cb);
}
```

主要还是依靠 hexo 的特性来加以改造，实现了监听。

## 防抖动

关于防抖动函数，可以去看下这个介绍 [问题 #3: 函数防抖](http://www.css88.com/archives/7059)。

我自己试了一下 scroll 函数，发现随便滚动一下就是是好几百的函数调用：

```javascript
var cb = function(){
  console.log('scroll!');//随便一滚动就好几百个 log
  var scrollTop = $w.scrollTop();
  fixLoading();
  if(scrollTop > headerlinkTop[pos + 1] || scrollTop <= headerlinkTop[pos]){
    getActive(scrollTop);
    console.log('jump!');
  }
}
```

把抖动函数拿了过来，实现起来也比较简单，就是利用 `setTimeout` 函数的特性，如果频率过快的时候，就把上一个定时器给清除，涉及到闭包和定时器的概念，原理很简单：

```javascript
function debounce(fn, delay){
  var timer = null,
    self = this;
  return function(){
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(self, arguments);
    }, delay)
  }
}
```

运用：

```javascript
this.debounce = debounce;
// delay 为 50 毫秒，效果还行
$w.scroll(this.debounce(cb, 50));
// log 日志很少
```

## 参考

>[为Hexo博客添加目录](http://www.jianshu.com/p/ac853e1afedb)
>[Bootstrap - Scroll spy Plugin](http://www.tutorialspoint.com/bootstrap/bootstrap_scrollspy_plugin.htm)
>[3个经常被问到的 JavaScript 面试题](http://www.css88.com/archives/7059)