---
title: ES6 你不得不学！
layout: post
comments: true
date: 2016-12-11 20:23:17
tags: [JavaScript, ES6]
categories: JavaScript
description: es6
photos:
- http://ww1.sinaimg.cn/mw690/e3dde130gw1fan4pqnd1uj20zk0npdpl.jpg
- http://ww1.sinaimg.cn/small/e3dde130gw1fan4pqnd1uj20zk0npdpl.jpg
---
在没有学习 ES6 之前，学习 React，真的是一件非常痛苦的事情。即使之前你对 ES5 有着很好的基础，包括闭包、函数、原型链和继承，但是 React 中已经普遍使用 ES6 的语法，包括 modules、class、箭头函数等，还有 JSX 语法。所以，在学习 React 之前一定要先学习 ES6。

<!--more-->

关于 ES6 你必须要知道的一个教程，[ECMAScript 6入门](http://es6.ruanyifeng.com/)。这本书对于 ES6 的讲解非常详细，一步一步跟着来，绝对会对 ES6 的语法都了解到。

学习 ES6，还要知道一个 ES6 的语法编译器，[Babel](http://babeljs.cn/)。ES6 出来很久了，并不是所有浏览器都支持，Babel 就可以把 ES6 代码转换成 ES5，让所有浏览器都支持你写的代码。Babel 内嵌了对 JSX 的支持，学习 React 必备。[在线实验](http://babeljs.cn/repl/)是一个 Babel 的在线编译器，可以用来练习 ES6 语法，并实时观测转换成 ES5 的代码效果。

准备工作做完了，接下来开始今天的主题，你不得不学的 ES6！

## 箭头函数

讲真，自从出了箭头函数之后，再也不用担心 this 问题了，而且就简化代码这一方面来说，箭头函数可谓是装逼神器。

箭头函数有几点需要注意，如果 return 值就只有一行表达式，可以省去 return，默认表示该行是返回值，否则需要加一个大括号和 return。如果参数只有一个，也可以省去括号，两个则需要加上括号。比如下面的例子：

```javascript
var f = v => v*2;
// 等价于
var f = function(v){
  return v*2;
}

// 判断偶数
var isEven = n => n % 2 == 0;

// 需要加 return
var = (a, b) => {
  if(a >= b)
    return a;
  return b;
}
```

还有 this 的问题，我觉得[这篇文章](http://es6.ruanyifeng.com/#docs/function#使用注意点)说的非常好。普通函数的 this 是可变的，**我们把函数归为两种状态，一种是定义时，一种是执行时，如果仔细研究会发现，函数中的 this 始终是指向函数执行时所在的对象**。比如全局函数执行时，this 执行 window，对象的方法执行时，this 执行该对象，**这就是函数 this 的可变。而箭头函数中的 this 是固定的**，看下面的例子：

```javascript
function obj(){
  setTimeout(()=>console.log(this.id), 20);
}
var id = 1;
obj.call({id: 2}); // 2
```

执行的结果是 2 而不是全局的 1，表示 setTimeout 函数执行的时候，this 指向的不是 window，这和普通函数是有区别的。

实际上，箭头函数并没有 this 对象，将箭头函数转成 ES5 会发现：

```javascript
// ES6
function obj() {
  setTimeout(()=>console.log(this.id), 20);
}

// ES5
function foo() {
  var _this = this;
  setTimeout(function () {
    console.log(this.id);
  }, 20);
}
```

通过 call aply 等方法是无法绑定 箭头函数中的 this：

```javascript
var f = () => this.x;
var x = 1;
f.call({x: 2}); // 1
```

对 this 的一个总结就是 在对象的方法中直接使用箭头函数，会指向 window，其他箭头函数 this 会指向上一层的 this，箭头函数并没有存储 this：

```javascript
var obj = {
  id: 1,
  foo: ()=>{
    return this.id;
  }
}
var id = 2;
obj.foo(); // 2
```

除了 this 之外，箭头函数的 arguments 也是不存在，不能使用 new 来构造，也不能使用 yield 命令。

## class

盼星星盼月亮，终于盼来了 JS 的继承。但是 ES6 中的继承和已经很完善的 ES5 中流行的继承库，到底有多少差异？

先来看一个例子：

```javascript
//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  // 注意函数构造的方式
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
var p1 = new Point(5, 5);
p1.toString(); //"(5, 5)"

typeof Point // function
p1.constructor == Point //true
```

直接使用 class 关键字，constructor 作为构造方法，函数可以直接 `toString(){}` 的方式。

但是，class 的本质仍然是函数，是构造函数的另外一种写法。既然 class 的本质是函数，那么必不可少的一些 proto，prototype 方法也是存在的。

### 关于 class 的继承

通过关键字 extends 可以实现 class 的继承，

```javascript
class Square extends Point{
  constructor(x){
    super(x, x);
  }
  toString(){
    return super.toString() + 'Square!';
  }
}
var s1 = new Square(4);
s1.toString(); //"(4, 4)Square!"
s1 instanceof Point // true
s1 instanceof Square // true
```

既然说到了继承，对 es5 中继承了解到小伙伴，肯定会疑惑关于 class 中的 proto 和 prototype 是一个什么样的关系。

子类的 proto 指向父类，子类的 prototype 的 proto 指向父类的 prototype，这和 ES5 并没有区别。

```javascript
Square.__proto__ === Point
// true
Square.prototype.__proto__ === Point.prototype
// true
```

### super 关键字

在 Java 等语言中，是有 super 继承父类函数，JS 中更加灵活，可以用作父类的构造函数，又可以用作对象。

子类的 constructor 必须要调用 super 方法，且只能在 constructor 方法中调用，其他地方调用会报错。

```javascript
class A {
  constructor(a){
    this.x = a;
  }
}
A.prototype.y = 2;
class B extends A{
  constructor(a){
    super();
  }
  getY(){
    super() // 报错
    return super.y
  }
}
```

### 原生构造函数的继承

对于一些原生的构造函数，比如 Array，Error，Object，String 等，在 ES5 是无法通过 `Object.create` 方法实现原生函数的内部属性，原生函数内部的 this 无法绑定，内部属性获得不了。[原生构造函数的继承](http://es6.ruanyifeng.com/#docs/class#原生构造函数的继承)。

ES6 的 class 可以解决这个问题。

```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

extends 关键字不仅可以用来继承类，**还能用来继承原生的构造函数**，在原生函数的基础上，自定义自己的函数。

### 静态方法

ES6 支持 static 关键字，该关键字定义的方法，不会被实例继承，但可以被子类继承：

```javascript
class A{
  static add(x, y){
    return x + y;
 }
}
A.add(1, 2);
var a = new A();
a.add()// error
class B extends A{}
B.add(2, 2)// 4 
```

## Module

ES6 之前，JS 一直没有 modules 体系，解决外部包的问题通过 CommonJS 和 AMD 模块加载方案，一个用于服务器，一个用于浏览器。ES6 提出的 modules （import／export）方案完全可以取代 CommonJS 和 AMD 成为浏览器和服务器通用的模块解决方案。

关于模块，就只有两个命令，import 用于导入其他模块，export 用于输出模块。

```javascript
// profile.js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export {firstName, lastName, year};

// main.js
import {firstName, lastName, year} from './profile';
console.log(firstName, lastName) // Michael Jackson
```

import 加载的模块可以只加载用到的，但是必须使用同名的原则，可以用 as 来解决名字问题，同样，as 也可以解决 export 问题：

```javascript
//main.js
import { lastName as surname } from './profile';
console.log(surname); // Jackson

//profile.js
export {firstName as name}
```

export 可以输出的内容很多，包括变量、函数、类，貌似都可以输出，还可以借助 export default 来加载默认输出。

```javascript
//default.js
function add(a, b){
  return a + b;
}
export default add;
// 实际上
export {add as default};

// main.js
import add from './default'
//实际上 add 名字可以随便起
import {default as add} from './default'
```

### 模块加载的实质

这部分 [ES6模块加载的实质](http://es6.ruanyifeng.com/#docs/module#ES6模块加载的实质) 完全只能参考了，因为对模块加载用的不多，没有一点经验，但是看到作者提到了拷贝和引用，感觉逼格很高的样子。

ES6模块加载的机制，与CommonJS模块完全不同。CommonJS模块输出的是一个值的拷贝，而ES6模块输出的是值的引用。

比如一个 CommonJS 加载的例子：

```
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

这个值会被 mod 缓存，而取不到原始的值。

ES6 中不一样，它只是生成一个引用，当真正需要的时候，才会到模块里去取值，

```javascript
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

### 循环加载

循环加载也比较有意思，经常能看到 nodejs 中出现加载同一个模块，而循环加载却不常见，nodejs 使用 CommonJS 模块机制，CommonJS 的循环加载采用的是加载多少，输出多少，就像是我们平时打了断点一样，会跳到另外一个文件，执行完在跳回来。

```
//a.js
exports.done = '1';
var a = require('./b.js');
console.log('half a=%s', a);
exports.done = '3';
console.log('done a');

//b.js
exports.done = '2';
var b = require('./a.js');
console.log('half b=%s', b);
exports.done = '4';
console.log('done b');

//main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('all done! a=%s,b=%s',a,b)
```

`node main.js` 的结果：

```
half a=2
done a
half b=3
done b
all done! a=3,b=4
```

这就是 CommonJS 所谓的循环加载。

而 ES6 采用的加载模式也不一样，因为使用动态引用，必须要开发者保证能 import 到值：

```javascript
// a.js如下
import {bar} from './b.js';
console.log('a.js');
console.log(bar);
export let foo = 'foo';

// b.js
import {foo} from './a.js';
console.log('b.js');
console.log(foo);
export let bar = 'bar';
```

结果：

```javascript
$ babel-node a.js
b.js
undefined
a.js
bar
```

循环加载稍有不慎，就会 underfined。

## 字符串模版

ES6 在字符串上面可是下了不少功夫，先是解决了字符 unicode 的 bug，增加了一些处理多字节字符串 codePointAt 函数，还多了字符串的遍历接口 `for...of`，这个遍历借口有点仿造 python 的感觉。只要有迭代器功能的对象，都可以用 for...of 来遍历。

ES6 添加了一些有意思的函数，比如 repeat()，前几天比较火的文章‘五道经典的前端面试题’，就有提到一个在字符串上实现原生的重复方法，这里的 repeat 可以直接解决。

关于字符串上的新内容，非常有帮助的还是模版字符串。之前在 js 中跨行的字符串实现起来很别扭，而 python 可以用三个反引号来实现。

ES6 中的模版字符串使用需要注意以下内容：

```javascript
// ` 可以跨行
var html = `
  <ul>
    <li>first</li>
    <li>second</li>
  </ul>`

//${} 调用变量和函数
var name = 'window';
var str = `my name is ${name};`;
// my name is window;

var add = (a, b)=> a+b;
var str = `2 + 3 = ${add(2,3)}`;
// "2 + 3 = 5"
```

用过 ejs 、swig 或 hbs 等模版，它们可以嵌入 js 代码，ES6 的模版字符串也可以。使用 <%...%> 放置 JavaScript 代码，使用 <%= ... %> 输出 JavaScript 表达式。

```javascript
var template = `
  <ul>
    <% data.forEach(function(item){ %>
      <li><%= item %></li>
    <% }) %>
  </ul>
`
```

下面就可以写正则表达式替换掉自定义字符并执行函数：

```javascript
function compile(str){
  var evalExpr = /<%=(.+?)%>/g;
  var expr = /<%([\s\S]+?)%>/g;
  str = str.replace(evalExpr, '`); \n  join( $1 ); \n  join(`')
    .replace(expr, '`); \n $1 \n  join(`');
  str = 'join(`' + str + '`);';
  var script = `
    (function parse(data){
      var output = "";

      function join(html){
        output += html;
      }

      ${ str }

      return output;
    })
  `
  return script;
}
var strParse = eval(compile(template));
// 使用
var html = strParse(['shanghai', 'beijing', 'nanjing']);
//  <ul>    
//    <li>shanghai</li>
//    <li>beijing</li>
//    <li>nanjing</li>
//  </ul>
```

通过两次使用字符串模版，并使用 eval 函数，一个 ES6 简易模版就这样完成了。

## 一些其他核心功能

### let const

ES5 通过 var 来申明变量，ES6 新添 let 和 const，且作用域是 **块级作用域**。

let 使用和 var 非常类似，**let 不存在变量提升，也不允许重复申明，let 的声明只能在它所在的代码块有效**，比如 for 循环，非常适合使用 let：

```
for(let i = 0; i < data.length; i++){
  console.log(data[i]);
}
console.log(i); // error
```

如果用 var 来申明 i，最后不会报错。之前学闭包的时候，有一个利用闭包解决循环的问题，用 let 可以解决:

```
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```

const 就是申明常量用的，一旦申明即被锁定，后面无法更改。

```
const PI = 3.14;
PI = 3; //error
```

let 和 const 都是块级作用域，块级作用域可以任意嵌套，且 {} 内定义的变量，外层作用域是无法获得的，且内外层的作用域可以同名。

```
function fn() {
  let n = 1;
  if (true) {
    let n = 2;
  }
  console.log(n); // 1
}
```

### 解构赋值

解构赋值真的很好用，但是我每次都忘记使用。ES6 解构赋值基本语法 `var [a, b, c] = [1, 2, 3];`，从数组中取值，并按照先后次序来赋值。如果解构赋值不成功，就会返回 underfined，解构赋值也允许指定默认值：

```
var [a, b] = [1];
b // undefined

// 指定默认值
var [a, b = 2] = [1];
b // 2
```

除了数组，对象也可以解构赋值，但是数组是有顺序的，而对象没有顺序，如果想要成功赋值，必须与对象属性同名，才能成功赋值，否则返回 underfined：

```
var {a, b} = {a: 1, b: 2};
a // 1
b // 2

var {a, c} = {a: 1, b: 2};
c // undefined
```

字符串的解构赋值比较有意思，既可以把字符串当作可以迭代的数组，又可以当作对象，比如：

```
var [a1,a2,a3,a4,a5] = 'hello';
a2 // e

var {length : len} = 'hello';
len // 5
```

函数参数的解构赋值，看一个 forEach 的例子：

```
var data = [[1, 2], [3, 4]];
data.forEach(([a, b]) => console.log(a+b));
// 3
// 7
```

### Promise 解决回掉

一直以来，回掉问题都是一件令人头疼的事，调试的时候感觉代码跳来跳去，玩着玩着就晕了。ES6 提供 Promise 对象（函数），专门用来处理回掉。

```javascript
var promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

resolve 和 reject 是两个异步操作调用函数，当异步操作完成时，调用 resolve，error 则调用 reject，这两个函数的功能就是把参数传递给回掉函数。then 函数用来处理成功或失败状态。

```javascript
function loadImageAsync(url) {
  var p = new Promise(function(resolve, reject) {
    var image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(url);
    };

    image.src = url;
  });
  p.then(function(image){
    document.body.appendChild(image);
  }, function(url){
    throw new Error('Could not load '+ url);
  })
}

loadImageAsync('http://yuren.space/images/bg.gif');
```

上面是一个用 Promise 实现的异步加载图片的函数。

### for of 与 ...

Python 中有 for in 运算符，ES6 就搞了个 for...of。当使用 for...of 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是可遍历的，对象、数组、字符串都是可遍历的。

```javascript
var str = 'hello';
for(let i of str){
  console.log(i);
}
// 'h' 'e' 'l' 'l' 'o'
```

`...`也非常好用，可以直接把可遍历对象直接转换成数组：

```javascript
var str = 'hello';
[...str] //["h", "e", "l", "l", "o"]

let arr = ['b', 'c'];
['a', ...arr, 'd'] 
// ['a', 'b', 'c', 'd']
```

有了 ... 之后，方便对非数组可遍历的对象进行转换，比如 arguments 和 querySelectAll 的结果：

```javascript
[...arguments] // Array

var selects = document.querySelectAll('a');
[...selects] // Array
```

### set 集合

ES6 新增 Set 集合对象，其实像其他语言早都支持了，不过，吃瓜群众，不觉明厉，以后，再遇到数组去重读算法题，就可以：

```javascript
[...(new Set([1, 2, 2, 3]))];
//[1, 2, 3]
```

Set 方法分为操作和遍历，操作方法有 add-添加成员， delete-删除成员， has-拥有判断返回布尔值， clear-清空集合。

遍历操作有 keys()，values()，entries()，forEach()，...，for of，map 和 filter 函数也可以用于 Set，不过要进行巧妙操作：

```javascript
let set = new Set([1,2,3]);
set = new Set([...set].map(a => a*2));
// Set {2, 4, 6}
```

## 总结

总之，对于 ES6 的学习还是要活用，当我看了一遍 [ECMAScript 6入门](http://es6.ruanyifeng.com/)时候，感觉知识点还是很多，有点乱。当接触了 react 之后，发现很多语法都非常的熟悉，于是就从头温习了 ES6，并整理了这篇文章。可能，你还不知道，这篇文章，大部分都是参考阮一峰老师的。共勉！

## 参考

>[ECMAScript 6入门](http://es6.ruanyifeng.com/)
>[30分钟掌握ES6/ES2015核心内容（上）](https://segmentfault.com/a/1190000004365693)
>[30分钟掌握ES6/ES2015核心内容（下）](https://segmentfault.com/a/1190000004368132)
>[ES6 学习笔记](https://segmentfault.com/a/1190000002904199)
>[ES6新特性概览](http://www.cnblogs.com/Wayou/p/es6_new_features.html)
>[ES6js.com 官网](http://www.es6js.com/)