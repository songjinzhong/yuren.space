---
title: '解决服务器 err incomplete chunked encoding 问题'
layout: post
comments: true
date: 2016-08-03 22:24:03
tags: [建站, 问题, chunked]
categories: 建站
description: 解决 服务器 err incomplete chunked encoding 问题
photos:
- http://ww1.sinaimg.cn/mw690/e3dde130gw1f8hkqbmatwj20zk0quabs.jpg
- http://ww1.sinaimg.cn/small/e3dde130gw1f8hkqbmatwj20zk0quabs.jpg
---

今天想把网站用非root用户启动，于是就修改了网站的启动用户，然后发现了当浏览器打开某些带有chunked网页的时候，会出现无响应的情况，通过调试，错误如下：

**net::ERR \_INCOMPLETE \_CHUNKED \_ENCODING**

<!--more-->

翻译过来就是错误不完整分块编码，分块编码是一种HTTP协议，处理较大的数据时，因不能确定数据大小，需要一部分一部分发送，这个时候就需要服务器进行处理。

因为只修改过服务器的用户权限，所有觉得应该是服务器的问题。然后就查看nginx的log日志：

![](/content/images/2016/08/nginx-error3.png)

可以看出是服务器权限出现问题,然后查看nginx目录：

![](/content/images/2016/08/nginx-error4.png)

有几个文件夹的所有者居然是nobody，nobody是什么鬼？解决办法就是：

**我先修改文件夹权限，发现运行时还是会变成nobody，估计是个bug，无奈之下，把nginx卸载，以当前用户重新安装，然后问题就解决了**。