---
title: 原生 JS 获取元素的尺寸和位置
layout: post
comments: true
date: 2016-11-23 18:59:23
tags: [JavaScript, CSS]
categories: JavaScript
description: 原生 JS 获取 元素 尺寸 位置
photos:
- http://ww3.sinaimg.cn/mw690/e3dde130gw1fa28x9suqqj20zk0nmgzt.jpg
- http://ww3.sinaimg.cn/small/e3dde130gw1fa28x9suqqj20zk0nmgzt.jpg
---
关于元素的尺寸和位置，这原本是 CSS 干的事，但更多的时候需要用 JavaScript 来获取这些参数，比如一个很好的例子 js 实现的图片瀑布流。

<!--more-->

在介绍 JS 中的例子之前，先来说明一下 css 中的元素尺寸。

## CSS 中的 width 和 height

先开个头吧，一个元素所占据的物理尺寸包括以下几个部分，由内到外分别是内容，padding，border，margin，这些值加到一起才算是一个元素真实尺寸。这里面并没有把滚动条的宽度算上，因为滚动条时占用 padding 的宽度的，如果 padding 宽度小于滚动条，那么滚动条多出来的部分将占用内容的宽度。[padding与滚动条关系](http://blog.csdn.net/huzhigenlaohu/article/details/49636041)。

比如下面的这个例子：

```
// html
<div class="test"></div>

// css style
.test{
    width:100px;
    height: 100px;
    padding:10px;
    border:2px solid black;
    margin: 5px;
}
```

![](/content/images/2016/11/t1.png)

上图是 chrome 调试下的 styles，所以 `.test` 的实际宽度应该是 100px + 20px + 4px + 10px = 134px，这里把 margin 也算进去，高度的计算同理。知道这一点很重要，当我们需要精确设定元素宽度的时候，就不会因为尺寸过大而把元素挤到下一行。

不过，这是入门级的 CSS。除此之外，还需要知道一个非常重要的 CSS 样式，即 `box-sizing`，可参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing) 上的介绍。

```
/* 关键字值 */
box-sizing: content-box;
box-sizing: border-box;
```

`box-sizing` 有两个关键字（据说还有一个 padding-box，反正我在 chrome 上测试不成功），content-box 是默认值，此时 width 只表示内容 content，border-box 表示元素的 width 等于 content + padding + border 三者之和。border-box 非常有用，尤其当我们在使用 100% 来规定宽高的时候，如果元素存在 border 或 padding，将直接导致元素的实际大小大于 100%，估计还有人记得 `calc` 带来的痛苦。

修改上面的例子：

```
.test{
  width:100px;
  height: 100px;
  padding:10px;
  border:2px solid black;
  margin: 5px;
  box-sizing: border-box;
}
```

![](/content/images/2016/11/t2.png)

`76 + 20 + 4 = 100px`，此时的 width 表示三者之和，而内容的宽度只有 76px 了。

## JS 获取元素尺寸

千万不要尝试用 element.style.width 或 element.style.height 来获得元素的高度和宽度，它们的默认值都是 0，除非你在 html 元素里面设置，否则 **js 是无法获得 css 的样式的**，必须要用其他的方法。比如下面这段代码 `element.style.width` 的值才是 100px：

```
<div class="test" style="width:100px"></div>
```

JS 中 element 对象提供 `offsetHeight`, `scrollHeight`, `clientHeight`(每个都对应 width)，其中：

**offsetHeight 可以用来计算元素的物理空间**，此空间包括内容，padding 和 border（还包括滚动条的宽度，但大多时候滚动条的宽度是计算到 padding 和内容中的）。

![](/content/images/2016/11/t2.png)

```
var test = document.getElementsByClassName('test')[0];
test.offsetHeight // 100
```

**scrollHeight 用来计算可滚动容器的大小，包括不可见的部分**，比如一个 300\*300 的容器放入一个 600\*600 的图片，此时 scrollHeight 为 600，当然，scrollHeight 的值需要加上 padding 的值。

**clientHeight 表示可视区域，包括内容和 padding ，如果有滚动条，还需要减去滚动条的宽度**。

举个例子，还是之前那个 test，加入 test2：

```
<div class="test">
    <div class="test2"></div>
</div>

//css
.test{
  overflow: auto; //新增
}
.test2{
    width: 150px;
    height: 150px;
    background-color: gray;
}
```

![](/content/images/2016/11/t3.png)

来看一看 test 的输出值是多少：

```
var test = document.getElementsByClassName('test')[0];
test.offsetHeight // 100
test.scrollHeight // 170
test.clientHeight // 79
```

此时滚动条的宽度是 17px，根据前面的介绍，滚动条时占用 padding 和 content 宽度的，而 17px 大于 padding 的 10px，故还有 7px 会占据 content。

分析一下，offsetHeight 的值是 100，padding 10px，滚动条虽然存在，但是占了 padding 和内容的空间，offsetHeight 的值是 4+20+76 = 100px。scrollHeight 的值是可滚动的范围加上padding 值，同样不包括滚动条，即 150+20 = 170px。clientHeight 的值是可见区域，但是不包括滚动条的值（滚动条。。。），所以20+76-17 = 79px。

其实也不是非常复杂。这个时候可以得出滚动条宽度的计算：offsetHeight 减去 border 和 clientHeight 的和就是滚动条宽度。

## 获取元素内容的尺寸

刚说了半天，还是无法获得元素内容的尺寸，最接近内容宽度的是 clientHeight，在没有滚动条的情况下，减去 padding 值就是内容的尺寸。

**如何获取元素的真实尺寸呢？**

通过 getComputedStyle （IE 下 currentStyle），[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) 介绍。

getComputedStyle 这个函数主要提供给我们元素 border 和 padding 宽度在内的一系列值（仍然不要妄想通过 element.style.border-width 获得），加上原先的 offsetHeight，就可以减去 border 和 padding 的值获得元素的真实尺寸。

```
// 考虑 IE 的兼容性
function getStyle(el) { 
  if(window.getComputedStyle) { 
    return window.getComputedStyle(el, null); 
  }else{ 
    return el.currentStyle; 
  } 
} 
function getWH(el, name) { 
  var val = name === "width" ? el.offsetWidth : el.offsetHeight, 
  which = name === "width" ? ['Left', 'Right'] : ['Top', 'Bottom']; 
  // display is none 
  if(val === 0) { 
    return 0; 
  } 
  var style = getStyle(el);
  // 左右或上下两边的都减去
  for(var i = 0, a; a = which[i++];) { 
    val -= parseFloat( style["border" + a + "Width"]) || 0; 
    val -= parseFloat( style["padding" + a ] ) || 0; 
  } 
  return val; 
}
// 测试，正确
getWH(test, 'width'); // 76
```

## 获取元素的位置

在这里先隆重推出一个重量级嘉宾函数，即 `getBoundingClientRect`，贴上 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 链接。

`element.getBoundingClientRect()` 会返回一个数组，比如：

```
test.getBoundingClientRect();
  bottom:108
  height:100
  left:13
  right:113
  top:8
  width:100
```

其中，width 和 height 跟 element.offset 的值是一致的，left bottom 等值则表示距离浏览器窗口的距离，如果要获得元素的位置，只需要得到 left 和 top 的值即可，

```
var X= test.getBoundingClientRect().left;
var Y =test.getBoundingClientRect().top;
//再加上滚动距离，就可以得到绝对位置
var X= test.getBoundingClientRect().left+document.body.scrollLeft;
var Y =test.getBoundingClientRect().top+document.body.scrollTop;
```

此方法之外，还有其他方法。比如每个元素都有 offsetTop 和 offsetLeft 属性，表示距离父容器左、上角的边距，offsetParent 表示父容器，先得到距离父容器的距离，依次累加，得到绝对位置。

![](/content/images/2016/11/t4.png)

```javascript
function getPosition(element, name){
  name = name.toLowerCase().replace("left", "Left").replace("top", "Top");
  var offset = 'offset' + name;
  var actualLeft = element[offset];
  var current = element.offsetParent;
  while (current !== null){
    actualLeft += current[offset];
    current = current.offsetParent;
  }
  return actualLeft;
}
getPosition(test,'left') // 13
getPosition(test,'top') // 8
```

结果和 getBoundingClientRect() 值一样，有时候需要考虑是相对于屏幕的位置还是绝对位置，然后再做进一步的计算。

## 总结

感觉最近的文章越来越水，主要是因为最近都在抓基础，学习 nodejs 和 ES6 的基本语法，没时间去看一下比较流行的框架。白天又特别忙，学校里又一大堆事情，各种烦躁。共勉！

## 参考

>[用Javascript获取页面元素的位置](http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html)
[关于元素的尺寸(dimensions) 说明](http://m.jb51.net/article/28278.htm)
[height、clientHeight、scrollHeight、offsetHeight区别](http://www.cnblogs.com/yuteng/articles/1894578.html)