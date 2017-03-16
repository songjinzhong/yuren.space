---
title: HTTP协议中你必须知道的三种数据格式
layout: post
comments: true
date: 2016-10-22 18:19:08
tags: [Http协议, Python, chunked]
categories: Http协议
description: HTTP 协议 知道 三种 数据 格式
hot: true
photos:
- http://ww1.sinaimg.cn/mw690/e3dde130gw1f91fq0x79gj20zk0fuq92.jpg
- http://ww1.sinaimg.cn/small/e3dde130gw1f91fq0x79gj20zk0fuq92.jpg
---
实习中的一个主要工作就是分析 HTTP 中的协议，自己也用 Python 写过正则表达式对 HTTP 请求和响应的内容进行匹配，然后把关键字段抽离出来放到一个字典中以备使用(可以稍微改造一下就是一个爬虫工具)。

<!--more-->

HTTP 协议中的很多坑，自己都遇到过，我就针对自己遇到的几种 HTTP 常见的数据格式，来做一个总结。

## Zlib 压缩数据

对于 Zlib，一点也不陌生，我们平时用它来压缩文件，常见类型有 zip、rar 和 7z 等。Zlib 是一种流行的文件压缩算法，应用十分广泛，尤其是在 Linux 平台。**当应用 Zlib 压缩到一个纯文本文件时，效果是非常明显的，大约可以减少70％以上的文件大小,这取决于文件中的内容。**

Zlib 也适用于 Web 数据传输，比如利用 Apache 中的 Gzip (后面会提到，一种压缩算法) 模块，我们可以使用 Gzip 压缩算法来对 Apache 服务器发布的网页内容进行压缩后再传输到客户端浏览器。这样经过压缩后实际上降低了网络传输的字节数，最明显的好处就是可以加快网页加载的速度。

网页加载速度加快的好处不言而喻，节省流量，改善用户的浏览体验。而这些好处并不仅仅限于静态内容，PHP 动态页面和其他动态生成的内容均可以通过使用 Apache 压缩模块压缩，加上其他的性能调整机制和相应的服务器端 缓存规则，这可以大大提高网站的性能。因此，对于部署在 Linux 服务器上的 PHP 程序，在服务器支持的情况下，建议你开启使用 Gzip Web 压缩。

### Gzip 压缩两种类型

压缩算法不同，可以产生不同的压缩数据(目的都是为了减小文件大小)。目前 Web 端流行的压缩格式有两种，分别是 Gzip 和 Defalte。

Apache 中的就是 Gzip 模块，Deflate 是同时使用了 LZ77 算法与哈夫曼编码（Huffman Coding）的一个无损数据压缩算法。Deflate 压缩与解压的源代码可以在自由、通用的压缩库 zlib 上找到。

更高压缩率的 Deflate 是 7-zip 所实现的。AdvanceCOMP 也使用这种实现，它可以对 gzip、PNG、MNG 以及 ZIP 文件进行压缩从而得到比 zlib 更小的文件大小。在 Ken Silverman的 KZIP 与 PNGOUT 中使用了一种更加高效同时要求更多用户输入的 Deflate 程序。

deflate 使用 `inflateInit()`，而 gzip 使用 inflateInit2() 进行初始化，比 `inflateInit()` 多一个参数: -MAX_WBITS，表示处理 raw deflate 数据。因为 gzip 数据中的 zlib 压缩数据块没有 zlib header 的两个字节。使用 inflateInit2 时要求 zlib 库忽略 zlib header。在 zlib 手册中要求 windowBits 为 8..15，但是实际上其它范围的数据有特殊作用，如负数表示 raw deflate。

其实说这么多，总结一句话，**Deflate 是一种压缩算法,是 huffman 编码的一种加强。 deflate 与 gzip 解压的代码几乎相同，可以合成一块代码。**

更多知识请见 [维基百科 zlib](https://en.wikipedia.org/wiki/Zlib)。

### Web 服务器处理数据压缩的过程

1. Web服务器接收到浏览器的HTTP请求后，检查浏览器是否支持HTTP压缩（Accept-Encoding 信息）；
2. 如果浏览器支持HTTP压缩，Web服务器检查请求文件的后缀名；
3. 如果请求文件是HTML、CSS等静态文件，Web服务器到压缩缓冲目录中检查是否已经存在请求文件的最新压缩文件；
4. 如果请求文件的压缩文件不存在，Web服务器向浏览器返回未压缩的请求文件，并在压缩缓冲目录中存放请求文件的压缩文件；
5. 如果请求文件的最新压缩文件已经存在，则直接返回请求文件的压缩文件；
6. 如果请求文件是动态文件，Web服务器动态压缩内容并返回浏览器，压缩内容不存放到压缩缓存目录中。

### 举个栗子

说了这么多，下面举一个例子，打开抓包软件，访问我们学校的官网( www.ecnu.edu.cn )，请求头如下:

```
GET /_css/tpl2/system.css HTTP/1.1
Host: www.ecnu.edu.cn
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36
Accept: text/css,*/*;q=0.1
Referer: http://www.ecnu.edu.cn/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8
Cookie: a10-default-cookie-persist-20480-sg_bluecoat_a=AFFIHIMKFAAA
```

在第七行， `Accept-Encoding` 显示的是 `gzip, deflate`，这句话的意思是，浏览器告诉服务器支持 gzip 和 deflate 两种数据格式，服务器收到这种请求之后，会进行 gzip 或 deflate 压缩（一般都是返回 gzip 格式的数据）。

Python 的 urllib2 就可以设置这个参数：

```Python
request = urllib2.Request(url)
request.add_header('Accept-encoding', 'gzip')
//或者设置成 deflate
request.add_header('Accept-encoding', 'deflate')
//或者两者都设置
request.add_header('Accept-encoding', 'gzip, deflate')
```

服务器给的响应一般如下：

```
HTTP/1.1 200 OK
Date: Sat, 22 Oct 2016 11:41:19 GMT
Content-Type: text/javascript;charset=utf-8
Transfer-Encoding: chunked
Connection: close
Vary: Accept-Encoding
tracecode: 24798560510951725578102219
Server: Apache
Content-Encoding: gzip

400a
............ks#I. ...W...,....>..T..]..Z...Y..].MK..2..L..(略)
//响应体为压缩数据
```

从响应头来看，`Content-Encoding: gzip` 这段话说明响应体的压缩方式是 gzip 压缩，一般有几种情况，字段为空表示明文无压缩，还有 Content-Encoding: gzip 和 Content-Encoding: deflate 两种。

实际上 Gzip 网站要远比 Deflate 多，之前写过一个简单爬虫从 `hao123`的主页开始爬，爬几千个网页(基本涵盖所有常用的)，专门分析响应体的压缩类型，得到的结果是：

1. Accept-Encoding 不设置参数：会返回一个无压缩的响应体（浏览器比较特别，他们会自动设置 Accept-Encoding: gzip： deflate 来提高传输速度）；
2. Accept-Encoding: gzip，100% 的网站都会返回 gzip 压缩，但不保证互联网所有网站都支持 gzip(万一没开启)；
3. Accept-Encoding: deflate：只有不到 10% 的网站返回一个 deflate 压缩的响应，其他的则返回一个没有压缩的响应体。
4. Accept-Encoding: gzip, deflate：返回的结果也都是 gzip 格式的数据，说明在优先级上 gzip 更受欢迎。

响应头的 Encoding 字段很有帮助，比如我们写个正则表达式匹配响应头是什么压缩：

```
(?<=Content-Encoding: ).+(?=\r\n)
```

匹配到内容为空说明没有压缩，为 `gzip` 说明响应体要经过 gzip 解压，为 `deflate` 说明为 deflate 压缩。

### Python 中的 zlib 库

在python中有zlib库，它可以解决gzip、deflate和zlib压缩。这三种对应的压缩方式分别是：

```
RFC 1950 (zlib compressed format)
RFC 1951 (deflate compressed format)
RFC 1952 (gzip compressed format)
```

虽说是 Python 库，但是底层还是 C(C++) 来实现的，这个 `http-parser` 也是 C 实现的[源码](https://github.com/benoitc/http-parser)，Nodejs 的 `http-parser` 也是 C 实现的[源码](https://github.com/nodejs/http-parser)，`zlib` 的 C [源码](https://github.com/madler/zlib)在这里。C 真的好牛逼呀！

在解压缩的过程中，需要选择 windowBits 参数：

```
to (de-)compress deflate format, use wbits = -zlib.MAX_WBITS
to (de-)compress zlib format, use wbits = zlib.MAX_WBITS
to (de-)compress gzip format, use wbits = zli
```

例如，解压gzip数据，就可以使用zlib.decompress(data, zlib.MAX_WBITS | 16)，解压deflate数据可以使用zlib.decompress(data,- zlib.MAX_WBITS)。

当然，对于gzip文件，也可以使用python的gzip包来解决，可以参考下面的代码：

```
>>> import gzip
>>> import StringIO
>>> fio = StringIO.StringIO(gzip_data)
>>> f = gzip.GzipFile(fileobj=fio)
>>> f.read()
'test'
>>> f.close()
```

也可以在解压的时候自动加入头检测，把32加入头中就可以触发头检测，例如：

```
>>> zlib.decompress(gzip_data, zlib.MAX_WBITS|32)
'test'
>>> zlib.decompress(zlib_data, zlib.MAX_WBITS|32)
'test'
```

以上参考 stackoverflow [How can I decompress a gzip stream with zlib?](http://stackoverflow.com/questions/1838699/how-can-i-decompress-a-gzip-stream-with-zlib)。

刚接触这些东西的时候，每天都会稀奇古怪的报一些错误，基本上 Google 一下都能解决。

## 分块传输编码 chunked

分块传输编码（Chunked transfer encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许 HTTP 由网页服务器发送给客户端应用（ 通常是网页浏览器）的数据可以分成多个部分。分块传输编码只在 HTTP 协议 1.1 版本（HTTP/1.1）中提供。

通常，HTTP 应答消息中发送的数据是整个发送的，Content-Length 消息头字段表示数据的长度。数据的长度很重要，因为客户端需要知道哪里是应答消息的结束，以及后续应答消息的开始。然而，使用分块传输编码，数据分解成一系列数据块，并以一个或多个块发送，这样服务器可以发送数据而不需要预先知道发送内容的总大小。通常数据块的大小是一致的，但也不总是这种情况。

### 分块传输的优点

HTTP 1.1引入分块传输编码提供了以下几点好处：

1. HTTP 分块传输编码允许服务器为动态生成的内容维持 HTTP 持久链接。通常，持久链接需要服务器在开始发送消息体前发送 Content-Length 消息头字段，但是对于动态生成的内容来说，在内容创建完之前是不可知的。
2. 分块传输编码允许服务器在最后发送消息头字段。对于那些头字段值在内容被生成之前无法知道的情形非常重要，例如消息的内容要使用散列进行签名，散列的结果通过 HTTP 消息头字段进行传输。没有分块传输编码时，服务器必须缓冲内容直到完成后计算头字段的值并在发送内容前发送这些头字段的值。
3. HTTP 服务器有时使用压缩 （gzip 或 deflate）以缩短传输花费的时间。分块传输编码可以用来分隔压缩对象的多个部分。在这种情况下，块不是分别压缩的，而是整个负载进行压缩，压缩的输出使用本文描述的方案进行分块传输。在压缩的情形中，分块编码有利于一边进行压缩一边发送数据，而不是先完成压缩过程以得知压缩后数据的大小。

注：以上内容来自于[维基百科](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)。

### 分块传输的格式

如果一个 HTTP 消息（请求消息或应答消息）的 Transfer-Encoding 消息头的值为 chunked，那么，消息体由数量未定的块组成，并以最后一个大小为 0 的块为结束。
每一个非空的块都以该块包含数据的字节数（字节数以十六进制表示）开始，跟随一个 CRLF（回车及换行），然后是数据本身，最后块 CRLF 结束。在一些实现中，块大小和 CRLF 之间填充有白空格（0x20）。

最后一块是单行，由块大小（0），一些可选的填充白空格，以及 CRLF。最后一块不再包含任何数据，但是可以发送可选的尾部，包括消息头字段。

消息最后以 CRLF 结尾。例如下面就是一个 chunked 格式的响应体。

```
HTTP/1.1 200 OK
Date: Wed, 06 Jul 2016 06:59:55 GMT
Server: Apache
Accept-Ranges: bytes
Transfer-Encoding: chunked
Content-Type: text/html
Content-Encoding: gzip
Age: 35
X-Via: 1.1 daodianxinxiazai58:88 (Cdn Cache Server V2.0), 1.1 yzdx147:1 (Cdn 
Cache Server V2.0)
Connection: keep-alive

a
....k.|W..
166
..OO.0...&~..;........]..(F=V.A3.X..~z...-.l8......y....).?....,....j..h .6
....s.~.>..mZ .8/..,.)B.G.`"Dq.P].f=0..Q..d.....h......8....F..y......q.....4
{F..M.A.*..a.rAra.... .n>.D
..o@.`^.....!@ $...p...%a\D..K.. .d{2...UnF,C[....T.....c....V...."%.`U......?
D....#..K..<.....D.e....IFK0.<...)]K.V/eK.Qz...^....t...S6...m...^..CK.XRU?m..
.........Z..#Uik......
0
```

`Transfer-Encoding: chunked`字段可以看出响应体是否为 chunked 压缩，chunked 数据很有意思，采用的格式是 `长度\r\n内容\r\n长度\r\n..0\r\n`，而且长度还是十六进制的，最后以 `0\r\n`结尾(不保证都有)。因为上面的数据是 gzip 压缩，看起来不够直观，下面举个简单的例子：

```
5\r\n
ababa\r\n
f\r\n
123451234512345\r\n
14\r\n
12345123451234512345\r\n
0\r\n
```

上述例子 chunked 解码后的数据 `ababa12345...`，另外 `\r\n` 是不可见的，我手动加的。

和 gzip 一样，一样可以写一个正则表达式来匹配：

```
(?<=Transfer-Encoding: ).+(?=\r\n)
```

### 处理 chunked 数据

从前面的介绍可以知道，response-body 部分其实由 length(1) \r\n data(1) \r\n length(2) \r\n data(2)…… 循环组成，通过下面的函数进行处理，再根据压缩类型解压出最终的数据。

Python 处理的过程如下：

```python
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
//此时处理后unchunked就是普通的压缩数据，可以用zlib解压函数进行解压
```

实际中，我们会同时遇到既时 chunked 又是压缩数据的响应，这个时候处理的思路应该是：**先处理 chunked，在处理压缩数据**，顺序不能反。

## MultiPart 数据

MultiPart 的本质就是 Post 请求，MultiPart出现在请求中，用来对一些文件（图片或文档）进行处理，在请求头中出现 `Content-Type: multipart/form-data; boundary=::287032381131322` 则表示为 MultiPart 格式数据包，下面这个是 multipart 数据包格式：

```
POST /cgi-bin/qtest HTTP/1.1
Host: aram
User-Agent: Mozilla/5.0 Gecko/2009042316 Firefox/3.0.10
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Keep-Alive: 300
Connection: keep-alive
Referer: http://aram/~martind/banner.htm
Content-Type: multipart/form-data; boundary=::287032381131322
Content-Length: 514

--::287032381131322
Content-Disposition: form-data; name="datafile1"; filename="r.gif"
Content-Type: image/gif

GIF87a.............,...........D..;
--::287032381131322
Content-Disposition: form-data; name="datafile2"; filename="g.gif"
Content-Type: image/gif

GIF87a.............,...........D..;
--::287032381131322
Content-Disposition: form-data; name="datafile3"; filename="b.gif"
Content-Type: image/gif

GIF87a.............,...........D..;
--::287032381131322—
```

http 协议本身的原始方法不支持 multipart/form-data 请求，那这个请求自然就是由这些原始的方法演变而来的，具体如何演变且看下文：

1. multipart/form-data 的基础方法是 post，也就是说是由 post 方法来组合实现的
2. multipart/form-data 与 post 方法的不同之处：请求头，请求体。
3. multipart/form-data 的请求头必须包含一个特殊的头信息：Content-Type，且其值也必须规定为 multipart/form-data，同时还需要规定一个内容分割符用于分割请求体中的多个 post 内容，如文件内容和文本内容自然需要分割，不然接收方就无法正常解析和还原这个文件。具体的头信息如：Content-Type: multipart/form-data; boundary=${bound}，${bound} 代表分割符，可以任意规定，但为了避免和正常文本重复，尽量使用复杂一点的内容，如::287032381131322
4. multipart/form-data 的请求体也是一个字符串，不过和 post 的请求体不同的是它的构造方式，post 是简单的 name=value 值连接，而 multipart/form-data 则是添加了分隔符等内容的构造体。

维基百科上关于 [multipart](https://en.wikipedia.org/wiki/MIME#Multipart_messages) 的介绍。

multipart 的数据格式有一定的特点，首先是头部规定了一个 ${bound}，上面那个例子中的 ${bound} 为 `::287032381131322`，由多个内容相同的块组成，每个块的格式以**\-\-加 ${bound} 开始的，然后是该部分内容的描述信息，然后一个\r\n，然后是描述信息的具体内容**。如果传送的内容是一个文件的话，那么还会包含文件名信息，以及文件内容的类型。

小结，要发送一个 multipart/form-data 的请求，需要定义一个自己的 ${bound} ，按照格式来发请求就好，对于 multipart 的数据格式并没有过多介绍，感觉和 chunked 很类似，不难理解。

## 总结

本文介绍的三种数据格式，都比较基础，一些框架自动把它们处理，比如爬虫。还有图像上传，对于 multipart/data 格式的请求头，了解一些概念性的东西也非常有意思。共勉。

>参考全列在文章中了