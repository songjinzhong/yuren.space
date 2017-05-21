---
title: '处理 Http 协议中的 chunked 数据错位问题'
layout: post
comments: true
date: 2016-08-01 20:16:32
tags: [Http协议, chunked]
categories: Http协议
description: 处理 Http 协议 chunked 数据 错位 问题
photos:
- https://ww3.sinaimg.cn/mw690/e3dde130gw1f8hjhe6x6yj20zk0p47au.jpg
- https://ww3.sinaimg.cn/small/e3dde130gw1f8hjhe6x6yj20zk0p47au.jpg
---

**问题**

>由于`网页数据`编码和`python`编辑器默认编码不同导致数据处理错位。

<!--more-->

先来介绍一下分块传输编码。

### 分块传输编码

分块传输编码（Chunked transfer encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许HTTP由网页服务器发送给客户端应用（ 通常是网页浏览器）的数据可以分成多个部分。分块传输编码只在HTTP协议1.1版本（HTTP/1.1）中提供。

通常，HTTP应答消息中发送的数据是整个发送的，**Content-Length**消息头字段表示数据的长度。数据的长度很重要，因为客户端需要知道哪里是应答消息的结束，以及后续应答消息的开始。**然而，使用分块传输编码，数据分解成一系列数据块，并以一个或多个块发送，这样服务器可以发送数据而不需要预先知道发送内容的总大小。**通常数据块的大小是一致的，但也不总是这种情况。

### 原理

HTTP 1.1引入分块传输编码提供了以下几点好处：

* HTTP分块传输编码允许服务器为动态生成的内容维持HTTP持久链接。通常，持久链接需要服务器在开始发送消息体前发送Content-Length消息头字段，但是对于动态生成的内容来说，在内容创建完之前是不可知的。
* 分块传输编码允许服务器在最后发送消息头字段。对于那些头字段值在内容被生成之前无法知道的情形非常重要，例如消息的内容要使用散列进行签名，散列的结果通过HTTP消息头字段进行传输。没有分块传输编码时，服务器必须缓冲内容直到完成后计算头字段的值并在发送内容前发送这些头字段的值。
* HTTP服务器有时使用压缩 （gzip或deflate）以缩短传输花费的时间。分块传输编码可以用来分隔压缩对象的多个部分。**在这种情况下，块不是分别压缩的，而是整个负载进行压缩，压缩的输出使用本文描述的方案进行分块传输。**在压缩的情形中，分块编码有利于一边进行压缩一边发送数据，而不是先完成压缩过程以得知压缩后数据的大小。

### 格式

如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。

每一个非空的块都以该块包含数据的字节数（字节数以十六进制表示）开始，跟随一个CRLF（回车及换行），然后是数据本身，最后块CRLF结束。在一些实现中，块大小和CRLF之间填充有白空格（0x20）。

最后一块是单行，由块大小（0），一些可选的填充白空格，以及CRLF。最后一块不再包含任何数据，但是可以发送可选的尾部，包括消息头字段。

消息最后以CRLF结尾。例如下面就是一个chunked格式的响应体。

```
HTTP/1.1 200 OK
Date: Wed, 06 Jul 2016 06:59:55 GMT
Server: Apache
Accept-Ranges: bytes
Transfer-Encoding: chunked
Content-Type: text/html
Content-Encoding: gzip
Age: 35
X-Via: 1.1 daodianxinxiazai58:88 (Cdn Cache Server V2.0), 1.1 yzdx147:1 (Cdn Cache Server V2.0)
Connection: keep-alive

a
....k.|W..
166
..OO.0...&~..;........]..(F=V.A3.X..~z...-.l8......y....).?....,....j..h .6....s.~.>..mZ .8/..,.)B.G.`"Dq.P].f=0..Q..d.....h......8....F..y......q.....4{F..M.A.*..a.rAra.... .n>.D
..o@.`^.....!@ $...p...%a\D..K.. .d{2...UnF,C[....T.....c....V...."%.`U......?D....#..K..<.....D.e....IFK0.<...)]K.V/eK.Qz...^....t...S6...m...^..CK.XRU?m...........Z..#Uik......
```

从响应体中可以看到，数据分为两部分，第一部分的头长度是16进制的`a`，表示`10`个字节，内容为`....k.|W..`。第二部分长度为`166`，换算成16进制是256+96+6=`358`个字节。

### 代码实现

从前面的介绍可以知道，response-body部分其实由length(1) \r\n data(1) \r\n length(2) \r\n data(2)……循环组成，通过下面的函数进行处理，再根据压缩类型解压出最终的数据。
处理的过程如下：

```
unchunked = b''
pos = 0
while pos <= len(data):
  chunkNumLen = data.find(b'\r\n', pos)-pos
  //从第一个元素开始，发现第一个\r\n，计算length长度
  chunkLen=int(data[pos:pos+chunkNumLen], 16)
  //把length的长度转换成int
  if chunkLen == 0:
    break
    //如果长度为0，则说明到结尾
  chunk = data[pos+chunkNumLen+len('\r\n'):pos+chunkNumLen+len('\r\n')+chunkLen]
  unchunked += chunk
  //将压缩数据拼接
  pos += chunkNumLen+len('\r\n')+chunkLen+len('\r\n')
  //同时pos位置向后移动

return unchunked
//unchunked就是普通的压缩数据，可以用解压函数进行解压
```

### New Problem

今天在又碰到了一个问题，就是在处理部分数据包的时候，有的网页编码是`utf-8`，服务器在压缩数据的时候，被压缩数据的类型也就是`utf-8`，如果python编辑器的代码没有把`data`编码成encode(‘’utf-8)，长度显然就会报错，此时代码需要做稍微改动，在头部加入下面这句话：

```
data=data.encode('utf-8')
//这里的utf-8要根据实际情况而定，如果网页的编码是gbk，需要encode(‘gbk’)
```

当然，如果数据还要以其他编码进行后续处理，在最后还要加上`data=data.encode("需要的编码")`。

至于如何判断数据包的编码方式，可以通过网页的Head部分：

```
<meta http-equiv="Content-Type" content="text/HTML; charset=utf-8">
```

数据包形式多种多样，实际处理的时候，要根据具体情况而定。