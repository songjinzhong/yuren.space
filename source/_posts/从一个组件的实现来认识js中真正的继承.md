---
title: 从一个组件的实现来认识 JS 中真正的继承
layout: post
comments: true
date: 2016-10-23 11:15:46
tags: [JavaScript, 组件, 继承]
categories: JavaScript
description: 组件 JS 真正 继承
hot: true
photos:
- http://ww2.sinaimg.cn/mw690/e3dde130gw1f921dc4bc7j20zk0p4afy.jpg
- http://ww2.sinaimg.cn/small/e3dde130gw1f921dc4bc7j20zk0p4afy.jpg
---
其实，无论是写什么语言的程序员，最终的目的，都是把产品或代码封装到一起，提供接口，让使用者很舒适的实现功能。所以对于我来说，往往头疼的不是写代码，而是写注释和文档！如果接口很乱，肯定会头疼一整天。

<!--more-->

JavaScript 最初是以 Web 脚本语言面向大众的，尽管现在出了服务器端的 nodejs，但是单线程的性质还没有变。对于一个 Web 开发人员来说，能写一手漂亮的组件极为重要。GitHub 上那些开源且 stars 过百的 Web 项目或组件，可读性肯定非常好。

## 从一个例子来学习写组件

组件教程的参考来自于 GitHub 上，通俗易懂，[链接](https://github.com/purplebamboo/demo-richbase)。

要实现下面这个功能，对一个 input 输入框的内容进行验证，只有纯数字和字母的组合才是被接受的，其他都返回 failed：

![](/content/images/2016/10/demo.gif)

### 全局变量写法

这种写法完全没有约束，基本所有人都会，完全没啥技巧：

```javascript
// html
<input type="text" id="input"/>
// javascript
var input = document.getElementById("input");
function getValue(){
  return input.value;
}
function render(){
  var value = getValue();
  if(!document.getElementById("show")){
    var append = document.createElement('span');
    append.setAttribute("id", "show");
    input.parentNode.appendChild(append);
  }
  var show = document.getElementById("show");
  if(/^[0-9a-zA-Z]+$/.exec(value)){
    show.innerHTML = 'Pass!';
  }else{
    show.innerHTML = 'Failed!';
  }
}
input.addEventListener('keyup', function(){
  render();
});
```

缺点自然不用多说，变量没有任何隔离，严重污染全局变量，虽然可以达到目的，但极不推荐这种写法。

### 对象隔离作用域

鉴于以上写法的弊端，我们用对象来隔离变量和函数：

```javascript
var obj = {
  input: null,
  // 初始化并提供入口调用方法
  init: function(config){
    this.input = document.getElementById(config.id);
    this.bind();
    //链式调用
    return this;
  },
  // 绑定
  bind: function(){
    var self = this;
    this.input.addEventListener('keyup', function(){
      self.render();
    });
  },
  getValue: function(){
    return this.input.value;
  },
  render: function(){
    var value = this.getValue();
    if(!document.getElementById("show")){
      var append = document.createElement('span');
      append.setAttribute("id", "show");
      input.parentNode.appendChild(append);
    }
    var show = document.getElementById("show");
    if(/^[0-9a-zA-Z]+$/.exec(value)){
      show.innerHTML = 'Pass!';
    }else{
      show.innerHTML = 'Failed!';
    }
  }
}
window.onload = function(){
  obj.init({id: "input"});
}
```

相对于开放式的写法，上面的这个方法就比较清晰了。有初始化，有内部函数和变量，还提供入口调用方法。

新手能实现上面的方法已经很不错了。

不过这种方法仍然有弊端。obj 对象中的方法都是公开的，并不是私有的，其他人写的代码可以随意更改这些内容。当多人协作或代码量很多时，又会产生一系列问题。

### 函数闭包的写法

```javascript
var fun = (function(){
  var _bind = function(obj){
    obj.input.addEventListener('keyup', function(){
      obj.render();
    });
  }
  var _getValue = function(obj){
    return obj.input.value;
  }
  var InputFun = function(config){};
  InputFun.prototype.init = function(config){
    this.input = document.getElementById(config.id);
    _bind(this);
    return this;
  }
  InputFun.prototype.render = function(){
    var value = _getValue(this);
    if(!document.getElementById("show")){
      var append = document.createElement('span');
      append.setAttribute("id", "show");
      input.parentNode.appendChild(append);
    }
    var show = document.getElementById("show");
    if(/^[0-9a-zA-Z]+$/.exec(value)){
      show.innerHTML = 'Pass!';
    }else{
      show.innerHTML = 'Failed!';
    }
  }
  return InputFun;
})();
window.onload = function(){
  new fun().init({id: 'input'});
}
```

函数闭包写法的好处都在自执行的闭包里，不会受到外面的影响，而且提供给外面的方法包括 init 和 render。因为之前看过 JQuery 部分源码，稍微对其改造一下：

```javascript
var $ = function(id){
  // 这样子就不用每次都 new 了
  return new fun().init({'id': id});
}
window.onload = function(){
  $('input');
}
```

基本上，这已经是一个合格的写法了。

### 面向对象

虽然上面的方法以及够好了，但是我们的目的，是为了使用面向对象。面向对象一直以来都是被认为最佳的编程方式，如果每个人的代码风格都相似，维护、查看起来就非常的方便。

但是，我想在介绍面向对象之前，先来回忆一下 JS 中的继承（这部分回来再说）。

## 入门级的面向对象

提到继承，我首先想到的就是用 new 来实现。还是以例子为主吧，人->学生->小学生，在 JS 中有原型链这么一说，\_\_proto\_\_ 和 prototype ，对于原型链就不过多阐述，如果不懂的可以自己去查阅一些资料。

在这里，我还是要说明一下 JS 中的 new 构造，比如 `var student = new Person(name)`，实际上有三步操作：

```javascript
var student = {};
student.__proto__ = Person.prototype;
Person.call(student, name)
```

得到的 student 是一个对象，\_\_proto\_\_执行 Person 的 prototype，Person.call 相当于 constructor。

```javascript
function Person(name){
  this.name = name;
}
Person.prototype.Say = function(){
  console.log(this.name + ' can say!');
}
var ming = new Person("xiaoming");
console.log(ming.__proto__ == Person.prototype) //true new的第二步结果
console.log(ming.name) // 'xiaoming' new 的第三步结果
ming.Say() // 'xiaoming can say!' proto 向上追溯的结果
```

利用 \_\_proto\_\_ 属性的向上追溯，可以实现一个基于原型链的继承。

```javascript
function Person(name){
  this.name = name;
}
Person.prototype.Say = function(){
  console.log(this.name + ' can say!');
}
function Student(name){
  Person.call(this, name); //Person 的属性赋值给 Student
}
Student.prototype = new Person(); //顺序不能反，要在最前面
Student.prototype.DoHomeWork = function(){
  console.log(this.name + ' can do homework!');
}
var ming = new Student("xiaoming");
ming.DoHomeWork(); //'xiaoming can do homework!'
ming.Say(); //'xiaoming can say!'
```

大概刚认识原型链的时候，我也就只能写出这样的水平了，[我之前的文章](http://yuren.space/blog/2016/09/28/%E5%8E%9F%E5%9E%8B%E9%93%BE/)。

打开调试工具，看一下 ming 都有哪些东西：

```
ming
  name: "xiaoming"
  __proto__: Person
    DoHomeWork: ()
    name: undefined //这里多了一个 name 属性
    __proto__: Object
      Say: ()
      constructor: Person(name)
      __proto__: Object
```

当调用 `ming.Say()` 的时候，刚好 `ming.__proto__.__proto__` 有这个属性，这就是链式调用的原理，一层一层向下寻找。

这就是最简单的继承了。

## 面向对象的进阶

来看一看刚才那种做法的弊端。

1. 没有实现传统面向对象该有的 super 方法来调用父类方法，链式和 super 方法相比还是有一定缺陷的；
2. 造成过多的原型属性（name），constructor 丢失（constructor 是一个非常重要的属性，[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)）。

因为链式是一层层向上寻找，知道找到为止，很明显 super 直接调用父类更具有优势。

```
// 多了原型属性
console.log(ming.__proto__) // {name: undefined}
```
为什么会多一个 name，原因是因为我们执行了 `Student.prototype = new Person();`，而 new 的第三步会执行一个 call 的函数，会使得 `Student.prototype.name = undefined`，恰好 `ming.__proto__` 指向 Student 的 prototype，用了 new 是无法避免的。

```
// 少了 constructor
console.log(ming.constructor == Person) //true
console.log(ming.constructor == Student) // false
```

这也很奇怪，明明 ming 是继承与 Student，却返回 false，究其原因，`Student.prototype` 的 constructor 方法丢失，向上找到了  `Student.prototype.__proto__` 的 constructor 方法。

![](/content/images/2016/10/aa.png)

再找原因，这句话导致了 `Student.prototype` 的 constructor 方法丢失：

```javascript
Student.prototype = new Person();
```

在这句话之前打一个断点，曾经是有的，只是被替换掉了：

![](/content/images/2016/10/ab.png)

找到了问题所在，现在来改进：

```
// fn 用来排除多余的属性(name)
var fn = function(){};
fn.prototype = Person.prototype;
Student.prototype = new fn();
// 重新添上 constructor 属性
Student.prototype.constructor = Student;
```

用上面的继承代码替换掉之前的 `Student.prototype = new Person();`

## 面向对象的封装

我们不能每一次写代码的时候都这样写这么多行来继承吧，所以，于情于理，还是来进行简单的包装：

```javascript
function classInherit(subClass, parentClass){
  var fn = function(){};
  fn.prototype = parentClass.prototype;
  subClass.prototype = new fn();
  subClass.prototype.constructor = subClass;
}
classInherit(Student, Person);
```

~~哈哈，所谓的包装，就是重抄一下代码。~~

## 进一步完善面向对象

上面的问题只是简单的解决了多余属性和 constructor 丢失的问题，而 super 问题仍然没有改进。

举个栗子，来看看 super 的重要，每个人都会睡觉，sleep 函数是人的一个属性，学生分为小学生和大学生，小学生晚上 9 点睡觉，大学生 12 点睡觉，于是：

```javascript
Person.prototype.Sleep = function(){
  console.log('Sleep!');
}
function E_Student(){}; //小学生
function C_Student(){}; //大学生
classInherit(E_Student, Person);
classInherit(C_Student, Person);
//重写 Sleep 方法
E_Student.prototype.Sleep = function(){
  console.log('Sleep!');
  console.log('Sleep at 9 clock');
}
C_Student.prototype.Sleep = function(){
  console.log('Sleep!');
  console.log('Sleep at 12 clock');
}
```

对于 Sleep 方法，显得比较混乱，而我们想要通过 super，直接调用父类的函数：

```javascript
E_Student.prototype.Sleep = function(){
  this._super(); //super 方法
  console.log('Sleep at 9 clock');
}
C_Student.prototype.Sleep = function(){
  this._super(); //super 方法
  console.log('Sleep at 12 clock');
}
```

不知道对 super 的理解正不正确，总感觉怪怪的，欢迎指正！

来看下 JQuery 之父是如何 class 的面向对象，[原文在这](http://ejohn.org/blog/simple-javascript-inheritance/)，源码如下。

```javascript
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  // initializing 开关很巧妙的来实现调用原型而不构造，还有回掉
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  // 全局，this 指向 window，最大的父类
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  // 继承的入口
  Class.extend = function(prop) {
    //保留当前类，一般是父类的原型
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    //开关 用来使原型赋值时不调用真正的构成流程
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      //对函数判断，将属性套到子类上
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          //用闭包来存储
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            //实现同名调用
            var ret = fn.apply(this, arguments);  
            this._super = tmp;
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // 要返回的子类
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    //前面介绍过的，继承
    Class.prototype = prototype;
   
    Class.prototype.constructor = Class;
 
    Class.extend = arguments.callee;
   
    return Class;
  };
})();
```

这个时候就可以很轻松的实现面向对象，使用如下：

```javascript
var Person = Class.extend({
  init: function(name){
    this.name = name;
  },
  Say: function(name){
    console.log(this.name + ' can Say!');
  },
  Sleep: function(){
    console.log(this.name + ' can Sleep!');
  }
});
var Student = Person.extend({
  init: function(name){
    this._super('Student-' + name);
  },
  Sleep: function(){
    this._super();
    console.log('And sleep early!');
  },
  DoHomeWork: function(){
    console.log(this.name + ' can do homework!');
  }
});
var p = new Person('Li');
p.Say(); //'Li can Say!'
p.Sleep(); //'Li can Sleep!'
var ming = new Student('xiaoming');
ming.Say(); //'Student-xiaoming can Say!'
ming.Sleep();//'Student-xiaoming can Sleep!'
            // 'And sleep early!'
ming.DoHomeWork(); //'Student-xiaoming can do homework!'
```

除了 John Resig 的 super 方法，很多人都做了尝试，不过我觉得 John Resig 的实现方式非常的妙，也比较贴近 super 方法，我本人也用源码调试了好几个小时，才勉强能理解。John Resig 的头脑真是令人佩服。

## ES6 中的 class

在 JS 中，class 从一开始就属于关键字，在 ES6 终于可以使用 class 来定义类。比如：

```javascript
class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  toString(){
    return '(' + this.x + ',' + this.y + ')';
  }
}
var p = new Point(3, 4);
console.log(p.toString()); //'(3,4)'
```

更多有关于 ES6 中类的使用请参考阮一峰老师的 [Class基本语法](https://github.com/ruanyf/es6tutorial/blob/102bf25570ba57fb9b75dab6f98e27aaf040d6a7/docs/class.md)。

其实 ES6 中的 class 只是写对象原型的时候更方便，更像面向对象，class 的功能 ES5 完全可以做到，比如就上面的例子：

```javascript
typeof Point; //'function'
Point.prototype;
/*
|Object
|--> constructor: function (x, y)
|--> toString: function()
|--> __proto__: Object
*/
```

和用 ES5 实现的真的没有什么差别。

## 回到最开始的组件问题

那么，说了这么多面向对象，现在回到最开始的那个组件的实现——**如何用面向对象来实现**。

还是利用 John Resig 构造 class 的方法：

```javascript
var JudgeInput = Class.extend({
  init: function(config){
    this.input = document.getElementById(config.id);
    this._bind();
  },
  _getValue: function(){
    return this.input.value;
  },
  _render: function(){
    var value = this._getValue();
    if(!document.getElementById("show")){
      var append = document.createElement('span');
      append.setAttribute("id", "show");
      input.parentNode.appendChild(append);
    }
    var show = document.getElementById("show");
    if(/^[0-9a-zA-Z]+$/.exec(value)){
      show.innerHTML = 'Pass!';
    }else{
      show.innerHTML = 'Failed!';
    }
  },
  _bind: function(){
    var self = this;
    self.input.addEventListener('keyup', function(){
      self._render();
    });
  }
});
window.onload = function(){
  new JudgeInput({id: "input"});
}
```

但是，这样子，基本功能算是实现了，关键是不好扩展，没有面向对象的精髓。所以，针对目前的情况，我们准备建立一个 `Base` 基类，`init` 表示初始化，`render` 函数表示渲染，`bind` 函数表示绑定，`destory` 用来销毁，同时 `get`、`set` 方法提供获得和更改属性：

```javascript
var Base = Class.extend({
  init: function(config){
    this._config = config;
    this.bind();
  },
  get: function(key){
    return this._config[key];
  },
  set: function(key, value){
    this._config[key] = value;
  },
  bind: function(){
    //以后构造
  },
  render: function(){
    //以后构造
  },
  destory: function(){
    //定义销毁方法
  }
});
```

基于这个 `Base`，我们修改 `JudgeInput` 如下：

```javascript
var JudgeInput = Base.extend({
  _getValue: function(){
    return this.get('input').value;
  },
  bind: function(){
    var self = this;
    self.get('input').addEventListener('keyup', function(){
      self.render();
    });
  },
  render: function(){
    var value = this._getValue();
    if(!document.getElementById("show")){
      var append = document.createElement('span');
      append.setAttribute("id", "show");
      input.parentNode.appendChild(append);
    }
    var show = document.getElementById("show");
    if(/^[0-9a-zA-Z]+$/.exec(value)){
      show.innerHTML = 'Pass!';
    }else{
      show.innerHTML = 'Failed!';
    }
  }
});
window.onload = function(){
  new JudgeInput({input: document.getElementById("input")});
}
```

比如，我们后期修改了判断条件，**只有当长度为 5-10 的时候才会返回 success**，这个时候能很快定位到 `JudgeInput` 的 render 函数：

```javascript
render: function(){
  var value = this._getValue();
  if(!document.getElementById("show")){
    var append = document.createElement('span');
    append.setAttribute("id", "show");
    input.parentNode.appendChild(append);
  }
  var show = document.getElementById("show");
  //修改正则即可
  if(/^[0-9a-zA-Z]{5,10}$/.exec(value)){
    show.innerHTML = 'Pass!';
  }else{
    show.innerHTML = 'Failed!';
  }
}
```

以我目前的能力，只能理解到这里了。

## 总结

从一个组件出发，一步一步爬坑，又跑去介绍 JS 中的面向对象，如果你能看到最后，那么你就可手动搭一个 JQuery 了，纯调侃。

关于一个组件的写法，从入门级到最终版本，一波三折，不仅要考虑代码的实用性，还要兼顾后期维护。JS 中实现面向对象，刚接触 JS 的时候，我能用简单的原型链来实现，后来看了一些文章，发现了不少问题，在看 John Resig 的 Class，感触颇深。还好，现在目的是实现了，共勉！

### 参考

>[制作组件的例子](https://github.com/purplebamboo/demo-richbase)
>[javascript oo实现](http://purplebamboo.github.io/2014/07/13/javascript-oo-class/)
>[John Resig: Simple JavaScript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/)