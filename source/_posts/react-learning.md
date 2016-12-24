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

复杂的 DOM 操作通常是性能瓶颈产生的原因，React 引入了一套 Virtual DOM，在浏览器端的 JavaScript 实现了一套 DOM API。现在的开发变得简单，开发者编写虚拟 DOM，**每当数据变化时，React 会重新绘制整个虚拟 DOM 树，然后采用高效的 [Diff 算法](http://calendar.perfplanet.com/2013/diff/)，只把需要变化的部分渲染到浏览器中**。

在以前，渲染数据都是直接使用 `innerHTMl`，使用很方便，但是带来的弊端就是一些没有改变的数据也要重新渲染。在更古老的浏览器时代，那个时候后台的数据稍有变化，直接都说重新渲染整个 HTML，相当于重新打开一次页面。

以前 MVC 的思想，是做到数据-视图-控制器的分离，现在组件化的思想是做到 UI 功能模块之间的分离，以前的 MVC 开发者需要定义三个类来实现数据、视图和控制器的分离，开发者更多的从技术的角度对 UI 进行拆分，实现松耦合。

对于 React ，完全是一个新的做法，开发者从功能的角度出发，将 UI 分成不同的组件，每个组件都用虚拟 DOM 独立封装，至于渲染，就交给 API 去处理，开发者只需将数据和视图绑定到一起。以一个简单的评论系统 UI 为例，将各个评论组件和数据绑定到一起，至于更新，只需要考虑所有的数据，只要两次数据发生变化，就告诉 UI 去重新渲染，DOM API 渲染更新的组件。

## JSX 语法

React 需要将虚拟 DOM 和真实 DOM 绑定起来，是通过 `ReactDOM.render` 函数，它是 React 中最基本的用法，

```
<head>
  <script src="react.js"></script>
  <script src="react-dom.js"></script>
  <script src="JSX.js"></script>
</head>
<body>
  <div id="example"></div>
  <script type="text/jsx">
    ReactDOM.render(
      <h1>Hello World!</h1>,
      document.getElementById("example")
    )
  </script>
<body>
```

当在浏览器里打开这个 HTML 的时候，就会看到在 id 为 example 的元素下有一个 h1 的 Hello World 标签，这就是将数据绑定。

这里直接使用了 [JSX 语法](https://facebook.github.io/react/docs/introducing-jsx.html)，我觉得这个语法最大的特点就是你可以直接在 JS 里直接写 HTML，而不用加引号。如果你用 Sublime 编辑器，还可以安装 babel 或 jsx 的插件，写起来更方便。

jsx 还有其他的功能，比如模版，官方就提供了几个例子，

```
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;

const element2 = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

还可以插入数组：

```
const arr = [
  <h1>Hello World!</h1>,
  <h1>Hello React!</h1>
]
ReactDOM.render(
  <div>{arr}</div>,
  document.getElementById("example")
)
// Hello World!
// Hello React!
```

还可以混合着写：

```
const names = ['world', 'react', 'jsx']
ReactDOM.render(
  <div>
  {
    names.map(name => <h1>Hello {name}</h1>)
  }
  </div>,
  document.getElementById("example")
)
// Hello world
// Hello react
// Hello jsx
```

## 组件

React 提供虚拟 DOM，我们可以手动构造自己的组件，这个通过 React.createClass 函数来实现，或者继承于 Component 类：

```
var Hello = React.createClass({
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }
});

ReactDOM.render(
  <Hello name="React" />,
  document.getElementById('example')
);
```

`Hello` 就是 Component，可以和 HTML 元素一样使用，但是**组件首字母必须大写**，且**顶层标签只能有一个**，`this.props` 是组件的一个对象，可以在组件使用的地方，把值传给定义的地方，这里的 this.props.name 就是指 React。

因为 class 和 for 是 JavaScript 的保留字，所以 class 要写成 className，for 要写成 htmlFor。

### this.props.children

`this.props.children` 表示组件的所有子节点，可以用来构造：

```
var List = React.createClass({
  render() {
    return (
      <ul>
      {React.Children.map(this.props.children, child => <li>{child}</li>)}
      </ul>
    )
  }
});

ReactDOM.render(
  <List>
    <h1>hello world</h1>
    <h1>hello react</h1>
  </List>,
  document.getElementById('example')
);
//1. hello world
//2. hello react
```

this.props.children 有三种情况，如果没有子节点，返回 underfined，如果有一个子节点，返回 Object，如果有多个子节点，返回 array，具体情况，具体分析，最好加个类型判断。

### propTypes

这个是 React 提供的用来验证组件的属性是否符合要求，比如组件的名称要求是 string 型，当给它 number 型的时候会提示错误。

`getDefaultProps` 可以用来表示一些默认的值，使用组件的时候没有设置，就使用默认值。

```
var Hello = React.createClass({
  propTypes: {
    // name 必须为 string 类型
    name: React.PropTypes.string.isRequired
  }
  getDefaultProps(){
    return {
      title: 'React'
    }
  }
  render() {
    return <h1>Hello {this.props.name}, title is {title}</h1>;
  }
});

const num = 123
ReactDOM.render(
  <Hello name={num} />,
  document.getElementById('example')
);
// Warning 可以显示，但会报 warning
```

## 数据操作

当虚拟 DOM 插入到 HTML 中就变成真实 DOM，但如何对真实 DOM 进行操作呢？React 也是提供一套解决方案的，通过 ref 可以找到真实 DOM：

```
var MyComponent = React.createClass({
  handleClick() {
    this.refs.mySpan.textContent = 'have clicked!'
  }
  render() {
    return (
      <div>
        <span ref="mySpan">not click</span>
        <button onClick={this.handleClick}></button>
      <div>
    )
  }
})
```

通过在虚拟 DOM 中定义 ref 值，然后在 this.refs 属性中调用，该对象和真实 DOM 操作相同。关于 React 提供的完整事件，可以查看[官方文档](https://facebook.github.io/react/docs/events.html#supported-events)。

### state

其实前面介绍了很多，还是没有和数据扯上关系。React 提供了 state 状态集，开始有一个初始状态，当后面由于某些操作导致状态改变的时候，便会自动的渲染 DOM，触发 UI 层的改变。

```
var MyComponent = React.createClass({
  getInitialState() {
    return {clicked: false}
  }
  handleClick() {
    this.setState({clicked: !this.state.liked})
  }
  render() {
    var text = this.state.clicked ? 'clicked odd' : 'clicked even'
    return (
      <div>
        <span>{text}</span>
        <button onClick={this.handleClick}></button>
      <div>
    )
  }
})
```

当每一次点击 button 的时候，会触发 handleClick 事件，导致状态变化，React 会调用 render() 事件重新渲染改变的 DOM。

## 组件的生命周期

一个组件也是有生命周期短，从大的范围来讲，组件有三种状态，mount（已插入真实 DOM），update（更新插入的 DOM），unmount（移除真实 DOM），但是函数有五个时间段：

1. componentWillMount()
2. componentDidMount()
3. componentWillUpdate(object nextProps, object nextState)
4. componentDidUpdate(object prevProps, object prevState)
5. componentWillUnmount()

will 表示还没执行，did 表示已经执行。

```javascript
var Hello = React.createClass({
  getInitialState: function () {
    return {
      opacity: 1.0
    };
  },
  componentWillMount: function(){
    console.log('component will mount')
  },
  componentDidMount: function () {
    console.log('component did mount')
    this.timer = setInterval(() => {
      var opacity = this.state.opacity;
      opacity -= .05;
      if (opacity < 0.1) {
        opacity = 1.0;
      }
      this.setState({
        opacity: opacity
      });
    }, 100);
  },
  componentWillUpdate: function(){
    console.log('component will update')
  },
  conponentDidUpdate: function(){
    console.log('component did update')
  },
  render: function () {
    return (
      <div style={{opacity: this.state.opacity}}>
        Hello {this.props.name}
      </div>
    );
  }
});

ReactDOM.render(
  <Hello name="world"/>,
  document.getElementById('example')
);
```

从输出的结果来看，执行的顺序就是按照上面的顺序，而且会发现 `componentWillUpdate`、`componentDidUpdate`函数会重复执行，因为 100 毫秒透明度就变化了一次。

### ajax 操作

通过 ajax 可以获取来自服务器的数据，比如：

```javascript
var UserGist = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    };
  },

  componentDidMount: function() {
    this.getData = $.get(this.props.source, function(result) {
      var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });
    }.bind(this));
  },

  componentWillUnmount: function(){
    this.getData.abort();
  },

  render: function() {
    return (
      <div>
        {this.state.username}'s last gist is <a href={this.state.lastGistUrl}>here</a>.
      </div>
    );
  }
});

ReactDOM.render(
  <UserGist source="https://api.github.com/users/octocat/gists" />,
  document.getElementById('example')
);
```

之前使用 isMounted() 函数，貌似后来被取消了，然后使用 componentWillUnmount 函数来 abort 之前的 ajax 请求。

不过感觉 ES6 提供了 Promise 之后，貌似方便多了。

```javascript
var PromiseDemo = React.createClass({
  getInitialState: function(){
    return {
      loading: true,
      data: null,
      error: null
    }
  },
  componentDidMount: function(){
    this.props.promise.then(
      value => this.setState({loading: false, data: value}),
      error => this.setState({loading: false, error: error})
    )
  },
  render: function(){
    if(this.state.loading){
      return <div>loading...</div>
    }
    else if(this.state.error != null){
      return <div>error...{this.state.error.message}</div>
    }
    else{
      var p = this.state.data[0].html_url
      return <div>
        <h1>the URL is:</h1>
        <p>{p}</p>
      </div>
    }
  }
});
ReactDOM.render(
  <PromiseDemo promise={$.getJSON('https://api.github.com/users/octocat/gists')} />,
  document.getElementById('example2')
);
```

学好 ES6 真的很重要。

## 总结

这只是单纯的介绍 React，一些简单的操作，一点也不复杂，其实把 React 和 webpack 结合发挥的作用更大，后面的文章会继续涉及到，同时还有 react-router 和 react-redux、react-flux。共勉！

## 参考

>[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
>[一看就懂的ReactJs入门教程（精华版）](http://www.cocoachina.com/webapp/20150721/12692.html)
>[React虚拟DOM浅析](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/)
>[http://reactjs.cn/react/docs/tutorial.html](http://reactjs.cn/react/docs/tutorial.html)