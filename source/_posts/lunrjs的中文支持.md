---
title: '我的建站路4：解决 lunr.js 的中文支持问题'
layout: post
comments: true
date: 2016-08-12 22:14:36
tags: [建站, JavaScript, LunrJs]
categories: 建站
description: 我的建站路4：解决 lunr.js 的中文支持问题
photos:
- http://ww1.sinaimg.cn/mw690/e3dde130gw1f8hoek1ibnj20zk0mtdkx.jpg
- http://ww1.sinaimg.cn/small/e3dde130gw1f8hoek1ibnj20zk0mtdkx.jpg
---
之前已经说过了，还没有为博客添加搜索功能，实际上，这个功能早已经实现了，只是还存在bug，比如对中文的强烈不兼容（实际上只支持汉语拼音，就是你要搜索“问题”，要打“wen ti”，真尴尬）。

<!--more-->

### 安装搜索框

决定还是把搜索框和菜单栏放到一起，效果也和菜单栏一样，这边呢使用了一个 Github 上开源的基于 Ghost 的搜索插件，名字叫做 GhostHunter，[地址在这。](https://github.com/jamalneufeld/ghostHunter)

使用方法很简单，在HTML中引入：

```
<script src="js/jquery.ghostHunter.min.js"></script>

<form>
  <input id="search-field" /> //id为”search-field“
  <input type="submit" value="search">
</form>
<section id="results"></section>
//”results“为输出结果
```

在另外一个 js 文件中用下面的方式调用：

```
$("#search-field").ghostHunter({
  results   : "#results"
});
```

它还有很多的使用方法，具体可以参考 Github 上的说明。

这个库是基于 lunr.js ，最大的尴尬是不支持中文，之前在 Github 上看到一个支持中文的 lunr.js ，地址找不到了，这段时间研究了一下 lunr.js，发现了其中的不少奥秘。

### 关于lunrjs

Lunr.js 是一个 JavaScript 搜索引擎，是JS前端框架，可以快速的搜索静态的HTML内容，非常适合单页或者是无数据库的Web网页应用搜索，可以实现简单的全文搜索。

现在的博客系统都支持 RSS 订阅，是 XML 格式的，lunr.js 刚好可以用在博客系统的搜索上面，是一个独立于博客系统的搜索插件。

它的优势在于可以减轻服务器的搜索负载，只需从服务器加载 RSS 数据，在本地实现搜索操作。lunr.js 没有外部依赖，只需一个支持的浏览器。[官网地址](http://lunrjs.com/)。

在 html 中调用 lunr.js 或 lunr.min.js，然后使用方法如下：

```
var index = lunr(function () {
  this.field('title', {boost: 10})
  this.field('body')
  this.ref('id')
})

index.add({
  id: 1,
  title: 'Foo',
  body: 'Foo foo foo!'
})
index.add({
  id: 2,
  title: 'Bar',
  body: 'Bar bar bar!'
})

index.search('foo')
```

`this.field()`就是添加索引体，`id`表示索引 id ，就是我们在搜索的时候返回的 id 。`this.field()`有一个可选参数，`boost`的官方解释是 **An optional boost param can be passed to affect how much tokens in this field rank in search results, by default the boost value is 1.**翻译过来就是一个权重值，权重越大，搜索的等级就越高。

lunr.js 词分析器基于 Martin Porter’s 算法，这个算法具体是怎么分词的，看了半天我也没看懂，自己写了一个例子，通过 chrome 的调试，才算弄懂了，具体见下图：

```
index.add({
  id: 1,
  title: 'abc def',
  body: 'hijk lmnb'
})
var result=index.search("abc")
```

设置断点，调试，发现其实用于搜索的是个树结构，如下图：

![](/content/images/2016/08/lunrjs1.PNG)

title 和 body 中共有三个词 abc、def和hijk，首字母开头是a、d、h，再看子节点，

![](/content/images/2016/08/lunrjs2.png)

会顺着树杈走下去，`d->e->f`，根节点的 `ref=1`表示搜索结果的 id 为1，tf 是 score，值是通过函数 `tokenCount / fieldLength * field.boost`得到的，0.5*10=5。score 这个值的属性可以用来排名，比如搜索结果大于一条的时候，排名靠前的往往是值较大的。

看看`hijk`的值，为0.5：

![](/content/images/2016/08/lunrjs4.png)

那么 lunrjs 的搜索应该就是利用树来搜索。

之前看了一篇 Github 上关于添加中文支持，就是加了下面这句话：

```
lunr.trimmer = function (token) {
//check token is chinese then not replace 
  if(isChineseChar(token)){
  return token;
  }
  return token
  .replace(/^\W+/, '')
  .replace(/\W+$/, '')
}

function isChineseChar(str){     
   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;  
   return reg.test(str);  
}
```

trimmer 是用来对 tokens 进行过滤，把一些非字母替换掉，加入中文的判断，如果是中文，返回。

这里有一个问题，英文字母是按照空格来区分每一个单词的，而对于中文，一句话说完才会结束，即使加了这句话，要想正常使用，还是不行的。经过测试，会把“今天天气很好”当作一句话来处理。

**解决的办法有两个，加入分词，或者强行加入空格来区分每一个单词。**

**先介绍一下分词**，由于博主先前研究生上课的时候，学习过一些大数据分析的算法，其中就有用中文分词算法来实现中文句子的分词，这是另一门艺术，给你推荐一个分词算法 [MMSEG](http://technology.chtsai.org/mmseg/)，感兴趣的小伙伴可以去研究一下。

通过单步调试，先把 title 改成“go back home”，调试到 `lunr.tokenizer`函数的时候：

![](/content/images/2016/08/lunrjs5.png)

`return rs`已经由字符串变成处理好的数组，英文是根据空格来区分每个字母的，所有当我们把 title 换成“我想家了妈妈，我想回家”，结果如下：

![](/content/images/2016/08/lunrjs7.png)

这里已经很明显了，由于中文没有分词，返回的数组是按照标点符号和空格来划分的，中文分词算法放到哪里，你也应该知道了：

![](/content/images/2016/08/lunrjs8.png)

可以使用一个循环，处理数组的每一个元素，重新返回一个把中文分词的新数组。

**后来，我又发现了一种更简单的方法！！**

根本不需要调试把中文分词算法加到 lunr.js 中，如果 **lunr.add** 加入的词已经是中文分词分好的，比如下面例子：

```
//之前的笨方法
index.add({
  id: 1,
  title: '我想家了妈妈，我想回家',
  body: ''
})
//在 add 之前先用中文分词处理一下title
index.add({
  id: 1,
  title: '我 想家 了 妈妈 我 想 回家',
  body: ''
})
```

是我之前太笨了，太年轻！

**介绍一下第二种方法吧**，我正在使用的方法，其实呢，Ghost 博客在 RSS 中加入了 description 用来解释博客，我们可以在索引中将标题手动添加空格，或者一些特殊的标点符号（建议使用空格）。比如本文的 description 是“解决 lunrjs 中文 支持 问题”。

这样做的优点是，我们还可以加入一些有用的分词，即使分词和文本内容没有关系。例如这篇文章是用 JavaScript 写的，但是通过 JavaScript 是搜索不到的，可以在 description 中加入 JavaScript 这个标签。

不过，这种方法有个很大的缺点，就是当内容很多或不支持 description 时就不适用了。建议使用分词算法。