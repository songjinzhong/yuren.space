---
title: '如何在 Hexo 中优雅的实现搜索功能'
layout: post
comments: true
date: 2016-10-07 18:34:00
tags: [JavaScript, Hexo, LunrJs]
categories: JavaScript
description: Hexo 实现 搜索 功能
photos:
- https://ww4.sinaimg.cn/mw690/e3dde130gw1f8k4crw37bj20hs0ckmzb.jpg
- https://ww4.sinaimg.cn/small/e3dde130gw1f8k4crw37bj20hs0ckmzb.jpg
---
大概两个星期之前，开始动手设计自己的 Hexo 主题，原先的 Ghost 博客主题是在一个免费的主题基础上修改的，虽然符合我的基本需求，但是还是觉得身为一个前端人员，如果不自己设计主题，总觉得有点尴尬。

<!--more-->

### 为什么要使用 Hexo

首先来说一下 Ghost吧，它是动态博客，所以搭 Ghost 需要一台服务器，我现在用的是腾讯的学生计划，一元主机(这是我觉得腾讯对学生最有良心的计划)，最低配，原价好像是 65元/月。但是长久来看，这种低配的服务器就像搞投资，如果以后毕业了，仍然需要它来搭博客，也扛不住一年七八百块呀(先给你一点小便宜，让你最后离不开我)。

Hexo 是静态博客，可以托管在 `GitHub`，现在貌似 `Coding.net` 的网速要快一些，毕竟国内的公司(如果 GitHub 在周边有服务器镜像，速度应该差不多)。

**关键是**，Hexo 博客的功能真心强大，现在支持越来越多的插件，基本上一个博客该有的，都可以通过各种途径来获得。我也是最近才开始玩 Hexo的，越来越喜欢它，像归档、标签、RSS订阅这些功能可以轻松实现，其他的需要借助插件，比如评论有多说或 Disqus，搜索可以用 Google 或 swiftype。

虽然才写了一个多星期的 `swig`模板(以前用 Handlebar)，感觉越用越喜欢，慢慢习惯这种网页嵌入 `if, for`的开发模式了。

### 如何以优雅的方式来实现搜索

好吧，终于说到今天的主题(其实前面都是废话)，**静态博客难道就没法自己实现搜索吗？答案是可以的**。

先来说一下市面上 Hexo 常用的搜索，**swiftype**，原理就是爬虫，先去他们官网注册一个账号，然后爬你的网页，分析站点内容，构建关键词库，给你提供接口，用 JS 调用返回 json 数据。这种方式真的很不错，虽然初期有点麻烦，不过后面使用的时候非常方便，推荐这个。

**Google 或百度搜索**，在这里强烈推荐一下 GoogleHacking，搞安全找漏洞的时候，经常会用到它，真心强大。比如你要找一个可能含有 SQL 注入漏洞的网站，在 URL 中有一定的特征，就可以通过 URL 过滤搜索条件。[维基百科](https://en.wikipedia.org/wiki/Google_hacking)。有时候因为墙的原因，可以考虑百度搜索。比如你在百度搜索框输入`site:edu.cn`，得到的结果要么是大学的官网，要么含有 `edu.cn` 且常访问的网站。

最后就是**静态的方式**，和 Hexo 的 RSS 很类似，首先生成静态的 search.json 或 search.xml 文件，然后用户点击搜索，前端写 JS 访问这些数据，立马用各种分词算法，匹配算法得到搜索结果返回给用户。这种方式虽然实现起来麻烦一点，也算是一种优雅的方式。

为什么说它`优雅`，我觉得作为一个程序员，最主要的是**掌控代码的局面**，说直白了就是用户的任何操作都在自己的预料之下，无论是点击按钮也好，还是输入内容也好。swiftype 或者 Google 搜索恰好违背了这种思路，活别人干，我调用 API。对于搜索结果，只能被动的来获取。想要改变，自己实现搜索。

### 实现搜索功能

之前我就写过关于 JS 的搜索插件 [lunr.js](http://yuren.space/blog/2016/08/12/lunrjs%E7%9A%84%E4%B8%AD%E6%96%87%E6%94%AF%E6%8C%81/)，虽然是用在 Ghost 中，但也是针对 RSS 的搜索。

如何生成静态的 search.json？在网上发现已经有人写了关于Hexo Search 的[插件](https://github.com/PaicHyperionDev/hexo-generator-search)，和我所需要的有一点差别，我对它进行稍微的改进。

我不习惯或者说不喜欢用一个关键字去搜索文章内容或全部文章的内容，比如我在搜索框中输入 `java`，如果搜索全部文章内容，一来会带来很大的开销，二来有的文章其实并不是说 java，只是恰巧踢到了这个关键字。所以我把 search 插件生成的 xml 稍微改了一下：

```
<entry>
  <title><%-: post.title %></title>
  <url><%- encodeURI('/'+post.path) %></url>
  <tag><%- getTags(post.tags,post.categories) %></tag>
  <description><%-: post.description %></description>
  <date><%-: getDate(post.date)  %></date>
</entry>
```

只保留了五个参数，文章标题、文章 URL、文章标签、文章描述和标准化(YYYY-MM-DD)之后的日期，把厚重的文章内容部分给删掉了，我并不想把它当作搜索内容来搜索。其中，`description`算是搜索的重点，我把文章的关键字全写在 `page.description`，其次是 `tag`。经过优化，**search.xml**的文件大小会非常小。

接下来是前端 JS 的介绍，我仿照 [GhostHunter](https://github.com/jamalneufeld/ghostHunter) 的方式来写介绍 XML 的 JS 代码。先把 `lunrjs` 内嵌在 `search.js`中，处理从服务器获得的 XML 数据：

```javascript
$.get(this.search_path).done(function(data) {
  searchData = $(data).find("entry");
  for(var i = 0; searchData && i < searchData.length;i++){
    var post = $(searchData[i]);
    var parsedData = {
      id: i + 1,
      description: post.find("description").text(),
      tag: post.find("tag").text()
    };
    index.add(parsedData)
    blogData[i+1] = {
      title: post.find("title").text(),
      link: post.find("url").text(),
      pubDate: post.find("date").text()
    };
  }
});
```

使用 **JQuery** 的 `get()` 函数，遍历每一个 `entry`标签，把内容放到 index 中，`blogData`是用来做备份用，备份了 文章 id、文章 title、文章 url和文章 date，用来显示。

对于搜索，采用的是 `KeyUp` 的方式，如果搜索结果大于 10 条，会隐藏 10 条之后的记录，给用户提示是否显示，以免搜索条件不精确造成数据太多。

因为我们把搜索交给了 `lunr.js`去处理，这里只需要考虑如何优雅的显示结果就 OK 了。**Demo** 就是本博客中的搜索吧，希望你喜欢这种款式的搜索。

### 总结

国庆最后一天了，7 天时间没闲着，火急火燎的把 Hexo 的主题给设计好了，其中碰到了不少麻烦，毕竟我接触 Hexo 的时间不长。

本博客的样式是从两个人那里参考来的，主要参考了小胡子哥，[主页在这](http://www.barretlee.com/)，还有阮一峰老师，[主页在这](http://www.ruanyifeng.com/home.html)。

[Theme ](https://github.com/songjinzhong/hexo-theme)和 [Hexo ](https://github.com/songjinzhong/yuren.space)源码 都放在 Github 上，还没有做优化(~~就是看起来特别乱~~)，如果有人喜欢的话，以后再优化吧，有疑问，欢迎随时联系我。共勉！