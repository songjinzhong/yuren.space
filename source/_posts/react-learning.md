---
title: React 入门实战
layout: post
comments: true
date: 2016-12-24 16:03:19
tags: [React相关, JavaScript]
categories: React相关
description: React 入门 实战
photos:
- http://ww3.sinaimg.cn/mw690/e3dde130gw1fb1yfspqqkj20zk0qo46t.jpg
- http://ww3.sinaimg.cn/small/e3dde130gw1fb1yfspqqkj20zk0qo46t.jpg
---
学习 React 不是一蹴而就的事情，需要一步一步来，长期积累。毫无疑问，现在前端框架最火的 Angular、React 和 VUE。我作为一个小白，其实几个月之前就已经接触到 React，不过那时候只是简单的实现了几个小 [Demo](https://github.com/songjinzhong/react-learning)。

<!--more-->

React 给我最大的吸引，就是虚拟DOM 和组件化开发，它起源于 Facebook 内部项目，在 2013 年 5 月开源。这套 MVC 框架性能和代码逻辑都有很大的优势，越来越多的人开始关注。

## 原理和背景

现在的 Web 开发，就是将实时变化的数据渲染到 UI 上，对 DOM 进行操作，JQuery 为什么这么火，就是它提供了一系列方便的 DOM 操作，容易选择，无需考虑浏览器兼容等等问题。

复杂的 DOM 操作通常是性能瓶颈产生的原因，React 引入了一套 Virtual DOM，在浏览器端的 JavaScript 实现了一套 DOM API。现在的开发变得简单，开发者编写虚拟 DOM，**每当数据变化时，React 会重新绘制整个虚拟 DOM 树，然后采用高效的 Diff 算法，只把需要变化的部分渲染到浏览器中**。

在以前，渲染数据都是直接使用 `innerHTMl`，使用很方便，但是带来的弊端就是一些没有改变的数据也要重新渲染。在更古老的浏览器时代，那个时候后台的数据稍有变化，直接都说重新渲染整个 HTML，相当于重新打开一次页面。

## 参考

>[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
>[一看就懂的ReactJs入门教程（精华版）](http://www.cocoachina.com/webapp/20150721/12692.html)
>[React虚拟DOM浅析](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/)
>[http://reactjs.cn/react/docs/tutorial.html](http://reactjs.cn/react/docs/tutorial.html)