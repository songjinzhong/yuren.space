---
title: 'css中的 border'
layout: post
comments: true
date: 2016-10-15 12:02:05
tags: [CSS, border]
categories: CSS
description: css border top right bottom left
photos:
- http://ww3.sinaimg.cn/mw690/e3dde130gw1f8stqiah2wj20zk0qodv9.jpg
- http://ww3.sinaimg.cn/small/e3dde130gw1f8stqiah2wj20zk0qodv9.jpg
---
CSS 中的 border 属性，我想凡是了解一点 CSS 的都知道它是作用，可以在 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border) 上找到对它的详细介绍。

<!--more-->

## border

简单来说，就是我们常用的边框，一个非常基础的用法，就是

```
border: 1px solid black;
// 等价于
border-width: 1px;
border-style: solid;
border-color: black;
```
下面是演示的效果：

<div class="demo"><span style="border:1px solid black;padding:5px">我是文本</span></div>

当然还可以定义很多奇形怪状的边框类型，比如圆角(radius，可能兼容性不是很好)，椭圆(其实只要懂了椭圆，边框就可以随意绘制了)。

```
border 1px solid black;
border-radius: 50%;
```

<div class="demo"><span style="border:50px solid #a29e9e;border-radius: 50%;display: inline-block;"></span><span style="border:50px solid #a29e9e;border-radius: 50%;border-top-left-radius: 20px;display: inline-block;"></span><span style="border:50px solid #a29e9e;border-radius: 10px 150px 30px 150px;display: inline-block;"></span><span style="border:50px solid #a29e9e;border-top-right-radius: 50px 100px;display: inline-block;"></span></div>

## border-top,-right,-bottom,-left

看了这么多有意思的 DEMO，**那么对于边框，你真的了解了吗？**

最近碰到一个有意思的 CSS 样式，让我对于边框有了很深刻的了解。平时我们用边框，基本都要给边框一个宽度，`1px`，偶尔`2px`，并没有发现边框与元素之间的关系，当我们把 `border-width`换大一点的值，问题就来了。

```
border: 20px solid gray;
```

<div class="demo"><span style="display: inline-block;border: 20px solid #a29e9e;">我是文本</span></div>

并且，边框是可以单独设置 top，right，bottom，left 的值：

```
border: 20px solid gray;
border-top-width: 40px;
border-left-width: 40px;
```

<div class="demo"><span style="display: inline-block;border: 20px solid gray;border-top-width: 40px;border-left-width: 40px;">我是文本</span></div>

**边框与边框的交界处该如何来判断呢？**

了解这一点非常重要，如果你也发现了这个问题，那么下面有意思的东西就来了：

```
border: 20px solid;
border-top-color: black;
border-right-color: red;
border-bottom-color: gray;
border-left-color: blue;
```

<div class="demo"><span style="display: inline-block;border: 20px solid;border-top-color: black;border-right-color: red;border-bottom-color: gray;border-left-color: blue;">我是文本</span><span style="display: inline-block;border: 20px solid;border-top-color: black;border-right-color: red;border-bottom-color: gray;border-left-color: blue;border-top-width: 40px;border-left-width: 40px;">我是文本</span></div>

如果把元素的 `width` 和 `height` 都设置成 0，再加一个 radius：

```
width: 0;
height: 0;
border-radius: 50%;
```

<div class="demo"><span style="display: inline-block;border: 20px solid;border-top-color: black;border-right-color: red;border-bottom-color: gray;border-left-color: blue;"></span><span style="display: inline-block;border: 20px solid;border-top-color: black;border-right-color: yellow;border-bottom-color: black;border-left-color: yellow;border-radius: 50%;"></span></div>

前面 `border-radius` 的原理你也应该懂了吧!

## 用 border 实现箭头

知道了一些 border 的基本知识，我们就可以实现常见于对话框的箭头，像下面这种：

![](/content/images/2016/10/p3.png)

这个需要借助于 CSS 中的透明 `transparent` 来实现，比如我们需要一个向右的箭头，参考上面 width 和 height 为 0 时的例子，对应的边框大小 `15px,0px,15px,30px`，先看下面这个例子

```
border-width: 15px 0px 15px 30px;
border-color: black gray;
border-style: solid;
```

<div class="demo"><span style="display: inline-block;border-width: 15px 0px 15px 30px;border-color: black gray;border-style: solid;"></span></div>

这个时候需要把 border-top 和 border-bottom 的颜色设置成透明，

```
border-color: transparent gray;
```

<div class="demo"><span style="display: inline-block;border-width: 15px 0px 15px 30px;border-color: transparent gray;border-style: solid;"></span></div>

那么，对于的其他三个角度的箭头也可以以同样的方式设计出来：

<div class="demo"><span style="display: inline-block;border-width: 15px 0px 15px 30px;border-color: transparent gray;border-style: solid;"></span><span style="display: inline-block;border-width: 0px 15px 30px 15px;border-color: gray transparent;border-style: solid;"></span><span style="display: inline-block;border-width: 30px 15px 0px 15px;border-color: gray transparent;border-style: solid;"></span><span style="display: inline-block;border-width: 15px 20px 15px 0px;border-color: transparent gray;border-style: solid;"></span></div>

## 总结

看了这篇文章，是不是觉得 border 的功能非常强大，其实我们常见的一些气泡和形状都可以用 border 来实现，哈哈，非常鄙视那些用图片的同学。共勉。

### 参考

>[CSS Refreshers: Borders](https://code.tutsplus.com/tutorials/css-refreshers-borders--net-24655)