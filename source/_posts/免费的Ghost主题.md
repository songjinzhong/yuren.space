---
title: '我的建站路2：免费的 Ghost 主题'
layout: post
comments: true
date: 2016-08-04 21:26:35
tags: [建站, Ghost]
categories: 建站
description: 我的建站路2：免费的 Ghost 主题
photos:
- http://ww4.sinaimg.cn/mw690/e3dde130gw1f8hnx8hoaej20zk0mujxl.jpg
- http://ww4.sinaimg.cn/small/e3dde130gw1f8hnx8hoaej20zk0mujxl.jpg
---

Ghost是免费的博客平台，它有一个自己的自适应博客界面，样子一般，后台用的是handlebars.js模板，所有，我们可以设计自己的主题。

重点是，我一点灵感都没有！

<!--more-->

还好，毕竟Ghost是一个庞大的开源平台，手下的主题数不胜数，当然，漂亮的一塌糊涂的主题，肯定是收费的，下面收集了2个网址：

[Ghost官方主题市场](http://marketplace.ghost.org/)

[https://www.ghostforbeginners.com](https://www.ghostforbeginners.com)

其次，Github上面也有免费的分享主题，我选了一个黑色简约的主题 **abc** Theme，[官网在这](http://pxt.be/)，[演示地址在这](http://abc.pxt.be/)。

### 变更主题

Ghost主题默认放在`/content/themes/`文件夹下面，之前说的那个很一般的主题叫做Casper，是Ghost默认的。把下载好的主题放到该目录下，需要重启服务器，登陆Ghost后台，选择自己的新主题，保存。

### 关于Handlebars

[Handlebars](http://handlebarsjs.com/)是Ghost使用的模版语言。

Handlebars 提供了可以使你轻松高效地建立语义模版的功能。如果你想学 handlebars ，可以先熟悉熟悉它的语法，看看 [handlebars 文档](http://handlebarsjs.com/expressions.html)

**写到这里，我发现官网有个[中文版的介绍](http://docs.ghost.org/zh/themes)，直接贴过来啦，实在不想写啦。。。**

### 关于Ghost主题

Ghost 的主题旨在做到易于编写和维护。Ghost 主题推崇模版（HTML）和业务逻辑（JavaScript）之间的分离。Handlebars （几乎）是没有逻辑，并且强化了这个分离，同时提供部件来帮助用来显示内容的业务逻辑保持独立。这种分离使在制作主题时，开发者和设计师之间的合作更加容易。

Handlebars 模版是分等级的（一个模版可以扩展另一个），也支持模块化的模版。Ghost 拥有这些特性，使得代码的重复得以减少，同时每一个模版可以保持专注于实现单一功能，并且做到好。拥有良好架构的主题将很容易维护，而各个组成部分之间的分离使得他们可以在不同主题之间重复利用。

希望你喜欢我们构造主题的方法。

### Ghost 主题的文件架构

我们推荐如下架构：

```
.
├── /assets
|   └── /css
|       ├── screen.css
|   ├── /fonts
|   ├── /images
|   ├── /js
├── default.hbs
├── index.hbs [必需]
└── post.hbs [必需]
```

目前default.hbs和其他目录都不是必要的。 `index.hbs` 和 `post.hbs` 是必须的 – 如果这两个模板文件不存在的话，Ghost就无法正常运行。 `partials` 是一个特殊的目录。 这个目录应该包含所有你想要在整个博客范围内使用的模板文件，比如 `list-post.hbs` 可能是一个以列表形式展现一篇篇文章的模板文件，这个文件可能会被用于首页，之后可能被用于文章归档及标签页。 `partials` 也应该存放那些你想要覆盖的有特定功能的缺省模板文件比如分页。 在`partials`目录中添加`pagination.hbs`文件可以让你自定义分页的HTML。

>这是转移的博客，然后由于 MarkDown 的渲染方式不一样，先前的 MarkDown 在 Hexo 里报错，针对好恶心，所有请移步 [原站](http://blog.songjz.cn/wo-de-jian-zhan-lu-2-mian-fei-de-ghostzhu-ti/) 或者 直接访问 Ghost 的官网[Ghost中文](http://docs.ghost.org/zh/themes)。