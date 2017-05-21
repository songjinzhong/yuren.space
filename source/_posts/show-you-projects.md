---
title: 如何展示自己的 GitHub 项目
layout: post
comments: true
date: 2016-12-04 12:01:35
tags: [JavaScript, 项目]
categories: JavaScript
description: 如何 展示 自己 GitHub 项目
photos:
- https://ww4.sinaimg.cn/mw690/e3dde130gw1faemsk12h0j20zk0k0q9k.jpg
- https://ww4.sinaimg.cn/small/e3dde130gw1faemsk12h0j20zk0k0q9k.jpg
---
经常会在别人的简历中看到，做过什么高大上的项目。说实话，有时候看到一些大牛的简历，会感到非常的自卑，入行前端也一年多的时间了，但真正的‘懂行’或许也就半年的时间吧。真正大的前端项目没有做过，一些小的个人项目大多都托管在 GitHub，前段时间酝酿了一个展示 GitHub 项目的一个小 Project，今天就来说说这个东西。

<!--more-->

以前学前端，就只是学 HTML，CSS 和 JS，看书，看视频，大概这样的日子持续了好几个月，不能说没有一点效果，至少一些前端的基本概念都有所了解。慢慢地，开始接触到 GitHub，发现这里真是前端学习的一个高效场所。一个前端er，如果不逛 GitHub，必定是一个失败的前端，因为在 GitHub，视野可以得到很大的扩展。后来索性把浏览器主页也设置成了 GitHub。

发现好多大公司在招实习生和应届生的时候，也开始慢慢的关注应聘者的 GitHub 的信息，有时候在做一些网测题的时候，会看到输入 GitHub 地址或博客地址，其实，有时候你不够优秀的原因是因为你不会 show yourself。

## 从思路到实践

偶然间看到了一个精美博客的一个[项目展示页面](https://lufficc.com/projects)，感觉很不错。看了下它的源码，不是很复杂，通过 JavaScript 从 api.github.com 获取 json 数据，动态的渲染到页面中。于是，依葫芦画瓢，把整个展示页面的代码模仿 copy 下来，然后加入了扩展的元素。

GitHub [项目地址在这](https://github.com/songjinzhong/showGitHubProjects)，[Demo 地址在这](https://songjinzhong.github.io/showGitHubProjects/demo/)。

## 介绍一下代码

想来想去，还是准备用 Jquery，本来想写原生的，但是考虑到 ajax 操作和 html 操作，想想还是算了。首先用一个闭包，避免全局变量污染，把 JQuery 对象传进来：

```javascript
(function($){
  var showProjects = function(option){
    ...
  }
  // 把函数扔给 prototype
  $.prototype.showProjects = showProjects;
})($)
```

使用也很简单，设置了一个 option 配置对象，参数可选，如下：

```
//html
<div class="projects"></div>
<script src="https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
<script src="showProjects.js"></script>

//js
$('.projects').showProjects({
  name : 'songjinzhong', //your github url name
  maxNum : 12, // max Num you want show your projects
  loading : '<h3>加载中...</h3>', //loading informtion
  filter : { // filter for your projects, can be id or name
    id : [66267751],
    name : ['7studying.com']
  }
});
```

只要是一个 JQuery 对象都可以使用 showProjects 函数，但是之前必须要引入 JQuery 库。

参数中，name 表示 github 的名称，maxNum 表示是否限制显示的条目，默认显示全部，如果 maxNum 超过最大项目数，也显示全部。因为这个 js 是动态从 GitHub 加载的，访问速度很慢的时候，loading 相当于提示作用，也可以设置成其他内容。filter 是一个过滤器，表示一些不想显示的项目，可选 id 和 name 两种方式。

来看看 showProjects 函数中的内容，以下是一些参数设置：

```javascript
var projects = this;

// no github name
if(!option || !option.name){
  projects.html('<div><h3>参数错误</h3><p>请设置 GitHub 用户名</p></div>');
  return;
}

// defaultSetting
option.maxNum = option.maxNum || 0;
option.loading = option.loading || '<h3>加载中...</h3>';
var name = (option.filter && option.filter.name) || [],
  id = (option.filter && option.filter.id) || [];
```

在查看 github 返回的 json 数据之前，建议先自己访问一下 [https://api.github.com/<wbr>users/songjinzhong/<wbr>repos?<wbr>type=owner](https://api.github.com/users/songjinzhong/repos?type=owner)，了解数据格式。其中会用到的数据格式有 `html_url`, `name`, `description`, `language`, `stargazers_count`, `forks_count`。

```javascript
// 先设置 loading，然后 $.get
projects.length > 0 && projects.html(option.loading) && $.get("https://api.github.com/users/"+ option.name +"/repos?type=owner", function(data){
  if(data){
    // 成功返回后删除 loading
    projects.html("");
    // 过滤操作，用于去掉没有 description 和 fork 项目
    data = data.filter(function(a){
      return null != a.description && a.fork == false && name.indexOf(a.name) == -1 && id.indexOf(a.id) == -1; 
    });
    // 排序操作，安装 star 数和 fork 数排序
    data = data.sort(function(a, b){
      return b.stargazers_count - a.stargazers_count|| b.forks_count - a.forks_count;
    })
    var item = "";
    // 实现如果设置 maxNum 的情况
    if(option.maxNum > 0 && option.maxNum < data.length){
      data = data.slice(0,option.maxNum);
    }
    // 对剩下的 data 每一项都添加到 html 中
    data.forEach(function(repo){
      // language underfined 问题，改成字符串 null
      repo.language = repo.language || 'null';
      // 替换 template 模版中的字符串
      item = template.replace(/\[(.*?)\]/g, function(){
        return eval(arguments[1]);
      });
      projects.append(item);
    });
  }else{
    projects.html('<div><h3>加载失败</h3><p>请刷新或稍后再试...</p></div>');
  }
})
```

template 是字符串模版，巧妙的通过 replace 来替换关键字中的正则，然后执行 eval：

```
var template = '<div class="p-item">'+
  '<div class="p-header"><a href="[repo.html_url]"><h3>[repo.name]</h3></a></div>'+
  '<div class="p-body"><p>[repo.description]</p></div>'+
  '<div class="p-footer"><span>L：[repo.language]</span><span>S：[repo.stargazers_count]</span><span>F：[repo.forks_count]</span></div>'+
  '</div>';
```

## 显示

这个时候连显示的样式也 copy 过来了，不过那个博客中用的是浮动，我用的是 flex 作为基本布局。具体请参考 demo 中的样式吧。

这个样式并不是固定的，可以根据自己的需求来改变。下图是生成 project 的 html 图：

![](/content/images/2016/12/p1.png)

然后我把它应用到我的博客，projects 地址在这 [我的项目 | 渔人](http://yuren.space/projects)。改了点东西，比如 loading 图标变了，language star fork 全被我换成图标。