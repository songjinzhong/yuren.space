---
title: webpack 入门实战
layout: post
comments: true
date: 2016-12-19 19:17:05
tags: [React相关, webpack]
categories: React相关
description: webpack 入门 实战
photos:
- http://ww3.sinaimg.cn/mw690/e3dde130gw1fawbt3k6sbj20zk0npn0a.jpg
- http://ww3.sinaimg.cn/small/e3dde130gw1fawbt3k6sbj20zk0npn0a.jpg
---
大概几个月前，刚接触 gulp 的时候，通过 gulp 对前端工作流进行优化，在 gulpfile.js 文件中写插件，编译 less、stylus，压缩 css、js 等等，感觉工作效率得到极大的提升，原本手动的东西，现在都是自动化了。

<!--more-->

但是，现在，学习 react 的时候，我又不得不来学习 webpack。webpack 最近火得不行（或许已经火了很久了），当下最热门的前端资源模块化管理和打包工具,它能把各种资源，包括 jxs、coffeeJS、less／sass，甚至图片，当作模块来加载和使用。同样它需要一个 webpack.config.js 的配置文件，有专门针对于 css、js 和图片等插件，在 js 中直接通过 require 来使用。

webpack 可以将文件模块按照依赖打包成方便使用的前端资源，还可以将按需加载的模块进行异步加载。

ps：gulp/grunt 是前端构建工具，是自动化工具，可以简化前端流程；而 webpack 是前端模块化方案。虽然二者在某些功能上有共同点（比如压缩代码），但本质是不一样的，比如现在还有基于 gulp 的 webpack 插件[gulp-webpack](https://www.npmjs.com/package/gulp-webpack)。

## 前端模块化

前端模块化是大势所趋，随着 webapp 的兴起，浏览器的功能越来越强大，而一个单页面在使用的过程中会加载更多的 JavaScript 代码，这给前端开发的流程和运行带来了很大的挑战。

时下，已经有不少前端模块化系统：

**script 标签**，这是最传统的文件模块，一个文件是一个模块，

```
<script src="./main.js"></script>
<script src="./module.js"></script>
```

这些接口会暴露在全局作用下，弊端很多：

1. 全局作用域造成变量冲突
2. 文件只能按照 script 的顺序进行加载
3. 开发人员必须主观解决代码库和模块的依赖关系
4. 在大型的项目中，会造成资源文件难以管理，代码库混乱不堪

**CommonJS**

NodeJS 遵循的就是 [CommonJS 规范](http://wiki.commonjs.org/wiki/CommonJS)，这种通过 require 和 module.exports 的方式很常见：

```javascript
//main.js
var module = require('./module.js')
// dosomething
module.exports = somevalue;
```

优点是服务器端模块便于重用，简单易用，且 NPM 上有几十万个可以使用的模块包，缺点是这种加载方式属于同步加载，不适用于浏览器，且不能非阻塞的加载多个模块。关于 CommonJS 循环加载的原理，可以看看这篇文章中的介绍 [ES6模块加载的实质](http://es6.ruanyifeng.com/#docs/module#ES6模块加载的实质) CommonJS 部分。

**AMD CMD**

AMD 是适合在浏览器中的异步加载的模块，

```javascript
define("module", ["dep1", "dep2"], function(d1, d2) {
  return someExportedValue;
});
require(["module", "../file"], function(module, file) { /* ... */ });
```

CMD 规范和 AMD 规范很像，CommonJS 规范保持了很大的兼容。

还有就是 ES6 中的模块加载系统，详情请移步[ES6模块加载](http://es6.ruanyifeng.com/#docs/module)。

在上面的分析中，提到的都只是对 JavaScript 文件等加载，然而在前端的开发中还需要对图片，样式，字体文件和 html 模版等样式的加载，webpack 可以让这一切成为可能：

```
require("./style.css");
require("./style.less");
require("./template.jade");
require("./image.png");
```

在加载的过程中，还能通过对静态文件的分析，比如 css，把它内联到 html 的 style 样式中。

## webpack 的优势

webpack 是集大成者，支持 CommonJS，AMD/CMD，还能对图片，样式等进行模块化。

比如直接使用 CommonJS 语法：

```
var m1 = require('module1');
var m2 = require('module2');
//dosomething
module.exports = function(){
  m1();
  m2();
}
```

## 安装及使用

通过 npm 全局安装 webpack，`npm install webpack -g`，也可以在本地项目中安装依赖 `npm install webpack --save-dev`，前提要确保 npm init。

目录下面有一个静态页面 index.html 和 JS 入口文件 entry.js，

```
<!-- index.html -->
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <script src="bundle.js"></script>
</body>
</html>
// entry.js
document.write('hello webpack');
```

然后使用命令 `webpack entry.js bundle.js` 就可以生成 bundle.js 文件。

现在添加 module.js 文件，在 ertry.js 中引用：

```
//module.js
document.write('hello module');

//ertry.js
document.write(require(module));
```

webpack 会分析每个文件的入口，把依赖的相关文件都打包到 bundle.js。`webpack entry.js bundle.js` 这句话执行后，会先执行 entry.js，其他文件，则只有在 require 的时候才会加载。

还可以通过插件来加载样式模块。目录下添加一个 style.css 文件，安装 css 和 style 模块 `npm install css-loader style-loader`：

```
/* style.css */
body { background: yellow; }

// entry.js
require("!style!css!./style.css");
document.write('hello webpack');
```

这个时候打包，刷新页面，就可以看到 index.html 中内联的 css 样式。

## webpack.config.js

前面介绍的这种是命令行打包的方式，比较麻烦，一般都是写一个 webpack 的配置文件，上面的配置文件可以如下：

```javascript
//webpack.config.js
var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'}
    ]
  }
}
```

module.loader 中 loader 可能有人会有疑惑，这种用感叹号把模块放开表示 css 文件加载多个模块，加载的顺序从右到左，先加载 css 模块，再加载 style 模块。在 entry.js 文件中就可以简化的写成 `require('./style.css')`。

配置文件的几个比较重要的参数如下：

1. entry: 编译过程的输入
2. output: 编译过程的输出
3. module: 模块module的处理方式
4. plugin: 配置文件的插件入口
5. resolve 配置文件其他解决方案

output 代表输出，path 代表路径，filename 代表文件名。plugin 表示插件，有内置插件和扩展插件，

```javascript
var webpack = require("webpack");

var ComponentPlugin = require("component-webpack-plugin");

module.exports = {
  plugin: [
    //内置压缩插件
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    // 扩展插件
    ComponentPlugin
  ]
};
```

更多插件可以去[官网](https://webpack.github.io/docs/list-of-plugins.html)查看。

module 中最需要注意的就是 loaders，

1. test：正则表达式，用于匹配文件名（必须）
2. loader：需要加载的 loaders 列表，可用 ! 加载多个（必须）
3. include/exclude：手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
4. query：为loaders提供额外的设置选项（可选）

resolve 是配置的其他解决方案，比如 resolve.alias 可以定义模块的别名，resolve.root 可以定义绝对路径。

## webpack 更强大的功能

### webpack-dev-server

webpack-dev-server 是一个专门为 webpack 服务的 nodejs 服务器，通过 `npm install --save-dev webpack-dev-server` 命令来安装。

```
// webpack.config.js
devServer: {
  contentBase: "./",  //本地服务器所加载的页面所在的目录
  colors: true,  //终端中输出结果为彩色
  historyApiFallback: true,  //不跳转
  inline: true  //实时刷新
}
```

### Babel

Babel 是一个编译 JavaScript 的平台，它的功能非常强大，可用编译 JSX，ES6，ES7，生成浏览器识别的 JavaScript 语言。需要安装多个依赖：`npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react`。

```
//webpack.config.js
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015','react']
      }
    }
  ]
},
```

### Hot Module Replacement

webpack 提供热更新，官网关于热更新的介绍：[hot-module-replacement-with-webpack](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html),[webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)。

webpack-dev-server 本身就带有热更新功能，只需要在参数启动参数重添加 `webpack-dev-server --inline --hot`，如果嫌每次添加麻烦，可用在 package.json 中 script 设置 start 或在 webpack.config.js 中开启。

## 参考

>[webpack 中文官网](http://webpackdoc.com/)
>[webpack编译流程漫谈](https://github.com/slashhuang/blog/issues/1)
>[webpack学习之路](https://github.com/wangning0/Autumn_Ning_Blog/blob/master/blogs/3-12/webpack.md)
>[入门Webpack，看这篇就够了](http://blog.csdn.net/kun5706947/article/details/52596766)
>[一小时包教会 —— webpack 入门指南](http://www.w2bc.com/Article/50764)