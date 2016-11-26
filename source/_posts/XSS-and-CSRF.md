---
title: XSS 和 CSRF 两种跨站攻击
layout: post
comments: true
date: 2016-11-26 19:17:15
tags: [Web安全]
categories: Web安全
description: XSS CSRF 两种 跨站 攻击
photos:
- http://ww4.sinaimg.cn/mw690/e3dde130gw1fa5qff0d0gj20zk0npk1e.jpg
- http://ww4.sinaimg.cn/small/e3dde130gw1fa5qff0d0gj20zk0npk1e.jpg
---
差不多刚开始接触前端的时候，经常能看到一些早几年入行大牛们的简历，几乎所有人都会在简历中带上这么一句话：具备基本的 Web 安全知识（XSS / CSRF）。显然这已经成为前端人员的必备知识。

<!--more-->

非常怀念那个 SQL 注入还没有被普遍认可的年代，虽然这么多年过去了，SQL 注入并没有消失，仍然是最危险的漏洞。关于 SQL 注入的原理，可以看我之前写的文章[SQL 注入详解](http://yuren.space/blog/2016/10/01/SQL%E6%B3%A8%E5%85%A5%E8%AF%A6%E8%A7%A3/)。今天是主题是 Web 安全的另外两大杀手，XSS 和 CSRF。