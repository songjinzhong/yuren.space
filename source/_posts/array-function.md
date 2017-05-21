---
title: 数组方法总结
layout: post
comments: true
date: 2017-01-15 15:37:37
tags: [JavaScript, JS进阶]
categories: [JavaScript]
description: 数组 方法 总结
photos:
- https://ww1.sinaimg.cn/mw690/e3dde130gw1fbrcw7ywoij20zk0o2wj5.jpg
- https://ww1.sinaimg.cn/small/e3dde130gw1fbrcw7ywoij20zk0o2wj5.jpg
---
说起来很搞笑，我在用 sublime 3 写排序算法的时候，准备用 nodejs 来运行，就用 sublime 3 提供的编译功能。但问题来了，我比较挫，写了个死循环，然后 sublime 3 也不给输出提示，我很疑惑的连续跑了 3 遍，过了一会电脑发热，风扇开始叫了，我察觉到，一看进程，3 个 node 进程在狂吃内存和 cpu，我在想，这个 bug 该反馈给 sublime 3 还是 node 呢？
<!--more-->
JavaScript 中的数组本身就很特别，不像 C 或 Java，搞了数组、list 一整套东西，JS 中的数组就完全可以当作一个栈或队列来使用，四大操作 pop、push、shift、unshift。

我今天写这篇博客，主要是写一篇总结，以备以后查看，因为我发现无论数组操作多熟，时间久了都会忘记。

对于一个数组方法，我最关心的有两个问题，**返回值是什么，会不会对原始数组造成影响**，典型的例子就是 splice 和 slice 方法。对于那些返回原数组的函数，我们可以直接调用数组的链式调用，很酷（`array.filter().sort().reverse()`）。

我想带着这两个疑问，来总结下 Array 的数组方法。

## Array

`Array.length` 是数组的长度，每个新建的数组对象都会有 length 对象，可以通过 `Array.prototype` 修改原型，不过数组的基本使用和操作不是今天的重点，我们来看数组方法。

一般情况下，数组方法在最后都会带有一个 thisArg 的参数，这个参数会指定内部 this 的指向。如果参数中有回掉函数，这个回掉函数一般接受 3 个参数，value、index 和 array，分别代表当前传入的值，当前传入值所在的索引和当前的处理的数组。

### concat

这个方法可以用于数组的拼接，参数是一个或多个数组，返回的结果是拼接数组。[MDN array.concat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)。

concat 方法将创建一个新数组，然后将调用它的对象(this 指向的对象，即原数组)中的元素以及所有参数中的数组类型的参数中的元素以及非数组类型的参数本身按照顺序放入这个新数组,并返回该数组。concat 方法并不修改原数组和参数数组，而且对非数组对象同样有效果。

1. 返回拼接的新数组；
2. 不修改原数组和参数数组；
3. 参数可以是非数组。

```javascript
var a1 = [1, 2, 3],
  a2 = [4, 5, 6],
  a3 = [7, 8, 9];
var newarr = a1.concat(a2, a3);
newarr //[1, 2, 3, 4, 5, 6, 7, 8, 9]
a1 //[1, 2, 3]
newarr = a1.concat(4, a3);//[1, 2, 3, 4, 7, 8, 9]
newarr = a1.concat('hello');//[1, 2, 3, "hello"]
```

### every

every() 方法测试数组的所有元素是否都通过了指定函数的测试。[MDN array.every](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)。

`arr.every(callback)` 会对每一个元素都执行 callback 方法，直到 callback 返回 false。有时候 every 方法会和 forEach 方法相比较，因为 forEach 无法停止，而 every 方法返回 flase 时可以中途停止。

1. 若全部通过测试，函数返回值 true，中途退出，返回 false；
2. 不对原数组产生影响。

```javascript
function isBigEnough(element, index, array) {
  console.log(index);
  return (element >= 10);
}
var passed = [12, 5, 8, 130, 44].every(isBigEnough);
// 0
// 1
// passed is false
passed = [12, 54, 18, 130, 44].every(isBigEnough);
// 0 1 2 3 4
// passed is true
```

### filter

filter() 方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组。[MDN array.filter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)。

其实这个方法就是一个过滤方法，前面那个 every 方法，只判断不过滤，filter 会过滤掉一些不符合条件的，并返回新数组。

1. 返回一个满足过滤条件的新数组；
2. 不会改变原数组。

```javascript
function isBigEnough(element, index, array) {
  return (element >= 10);
}
var a1 = [19, 22, 6, 2, 44];
var a2 = a1.filter(isBigEnough);
a1 //[19, 22, 6, 2, 44]
a2 //[19, 22, 44]
```

### forEach

forEach() 方法对数组的每个元素执行一次提供的函数(回调函数)。[MDN array.forEach](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)。

1. 函数没有返回值，即 underfined；
2. 不对原数组产生影响。

```javascript
function logArrayElements(element, index, array) {
    console.log("a[" + index + "] = " + element);
}

// 注意索引2被跳过了，因为在数组的这个位置没有项
var result = [2, 5, 9].forEach(logArrayElements);
// a[0] = 2
// a[1] = 5
// a[2] = 9
result //underfined
```

### indexOf

indexOf()方法返回给定元素能找在数组中找到的第一个索引值，否则返回-1。[MDN array.indexOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)。

1. 返回值是找到元素的索引值或 -1；
2. 不对原数组产生影响。

```javascript
var array = [1, 2, 5];
array.indexOf(5); // 2
array.indexOf(7); // -1
```

### join

join() 方法将数组中的所有元素连接成一个字符串。[MDN array.join](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/join)。

其实，对于 join 想到的第一个是字符串的 split 操作，这两个经常搭配用来处理字符串。

1. 返回拼接的字符串；
2. 不对原数组产生影响。

```javascript
var a1 = [1, 2, 3];
var a2 = a1.join();
a1 //[1, 2, 3]
a2 //"1,2,3"
a2 = a1.join("");//"123"
a2 = a1.join("-");//"1-2-3"
```

### lastIndexOf

lastIndexOf() 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始。[MDN array.lastIndexOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)。

其实这个就是 indexOf 的翻版。

1. 返回找到的第一个元素的索引；
2. 不对原数组产生影响。

```javascript
var array = [2, 5, 9, 2];
var index = array.lastIndexOf(2);
// index is 3
index = array.lastIndexOf(7);
// index is -1
index = array.lastIndexOf(2, 3);
// index is 3
index = array.lastIndexOf(2, 2);
```

### map

map() 方法返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组。[MDN array.map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)。

map reduce 这两个函数在处理数组上一直都是一把手，带来很大的便捷性。

1. 返回一个经过回掉函数处理的新数组；
2. 不对原数组产生影响。

```javascript
var a1 = [1, 4, 9];
var a2 = a1.map(Math.sqrt);
a1 //[1, 4, 9]
a2 //[1, 2, 3]
```

### reduce

reduce() 方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始合并，最终为一个值。[MDN array.reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)。

reduce 是一个合并的过程，从左到右，直到把所有元素合并到一起，并返回最终的结果。它接受两个参数，第一个参数是一个回掉函数，第二个参数是一个初始值，表示处理第一个元素时的前一个值。这个回掉函数接受四个参数，依次是 accumulator（上次处理的结果），currentValue（当前元素的值），index（当前元素索引），array（调用 reduce 的数组）。

1. 返回最终合并的结果，即回掉函数的输出，可以为字符串，对象，数组等任意结果；
2. 不对原数组产生影响。

```javascript
var getAdd = (pre, cur) => pre + cur;
var a1 = [1, 2, 3];
var a2 = a1.reduce(getAdd, 0);
a1 //[1, 2, 3]
a2 //6
```

### reduceRight

reduceRight() 方法接受一个函数作为累加器（accumulator），让每个值（从右到左，亦即从尾到头）缩减为一个值。（与 reduce() 的执行方向相反）[MDN array.reduceRight](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight)。

```javascript
var toStr = (pre, cur) => '' + pre + cur;
var a1 = [1, 2, 3];
var a2 = a1.reduce(toStr, '');
a2 //"123"
a2 = a1.reduceRight(toStr, '');
a2 //"321"
```

### push

push() 方法添加一个或多个元素到数组的末尾，并返回数组新的长度（length 属性值）。[MDN array.push](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push)。

如果把数组当作栈，push pop 操作是栈进和出，而往往很多人会忽略函数执行后的返回值。

1. 返回 push 操作执行之后数组的长度；
2. 肯定改变。

```javascript
var a1 = [1, 2, 3];
var a2 = a1.push(4);
a1 //[1, 2, 3, 4]
a2 //4
```

### pop

pop() 方法删除一个数组中的最后的一个元素，并且返回这个元素。[MDN array.pop](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)。

1. 返回删除的这个元素；
2. 肯定改变。

```javascript
var a1 = [1, 2, 3];
var a2 = a1.pop();
a1 //[1, 2]
a2 //3
```

### unshift

unshift() 方法在数组的开头添加一个或者多个元素，并返回数组新的 length 值。[MDN array.unshift](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)。

1. 返回 length 值；
2. 肯定改变。

```javascript
var a1 = [1, 2, 3];
var a2 = a1.unshift(4);
a1 //[4, 1, 2, 3]
a2 //4
```

### shift

shift() 方法删除数组的 第一个 元素，并返回这个元素。该方法会改变数组的长度。[MDN array.shift](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)。

shift 方法和 push 方法可以组成一个队列的操作啦。

1. 返回删除的这个元素；
2. 肯定改变。

### reverse

reverse() 方法颠倒数组中元素的位置。第一个元素会成为最后一个，最后一个会成为第一个。[MDN array.reverse](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)。

1. 函数返回值是修改了的原数组；
2. 原数组会修改。

```javascript
var a1 = [1, 2, 3];
var a2 = a1.reverse();
a1 //[3, 2, 1]
a1 === a2; //true
```

### slice

slice() 方法会浅复制（shallow copy）数组的一部分到一个新的数组，并返回这个新数组。[MDN array.slice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)。

slice 的参数包括拷贝的初识位置，结束位置（左闭右开），与 splice 有区别。由于不会改变原数组，这个数组可以用于前拷贝，比如经常看别人使用：`arr.slice(0)`，表示拷贝数组。

1. 返回浅拷贝后的新数组；
2. 不会改变原数组。

```javascript
var a1 = [1, 2, 3, 4, 5];
var a2 = a1.slice(1, 3);
a1 //[1, 2, 3, 4, 5]
a2 //[2, 3]
```

### splice

splice() 方法用新元素替换旧元素，以此修改数组的内容。[MDN array.splice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)。

如其名，分割，会修改原数组的内容，返回一个新数组，而且它的参数也比较多，第一个参数表示初始位置，第二个参数表示分割长度，第三个参数及以后表示分割后在分割处添加新元素。

1. 返回分割的元素组成的数组；
2. 会对数组进行修改，原数组会减去分割数组。

```javascript
var a1 = [1, 2, 3, 4];
var a2 = a1.splice(1, 2);
a1 //[1, 4]
a2 //[2, 3]
a1 = [1, 2, 3, 4];
a2 = a1.splice(1, 2, 5, 6);
a1 //[1, 5, 6, 4]
```

### some 

some() 方法测试数组中的某些元素是否通过了指定函数的测试。[MDN array.some](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)。

### sort

sort() 方法对数组的元素做原地的排序，并返回这个数组。 sort 排序可能是不稳定的。默认按照字符串的Unicode码位点（code point）排序。[MDN array.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)。

sort 函数用于排序，比较常用，若没有制定排序函数，则按照 unicode 位点进行排序，而且数字会被转成字符串，所以 ‘123’ 要排在 ‘11’ 的后面。

我们会用 sort 做一些有意思的排序，比如汉字按照拼音排序。

1. 返回排序后的原数组；
2. 会对数组进行修改。

```javascript
var big = function(a, b){
  return a - b;
}
var a1 = [2, 4, 77, 1];
var a2 = a1.sort(big);
a1 //[1, 2, 4, 77]
a1 === a2; //true
```

`localeCompare` 可以对汉字进行排序，当同时出现汉字和字母的时候会有 bug：

```javascript
var sort_py = function(a, b){
  return a.localeCompare(b);
}
var a1 = ["北京", "上海", "南京", "合肥"];
a1.sort(sort_py);
//["北京", "合肥", "南京", "上海"]
```

### toString

toString() 返回一个字符串，表示指定的数组及其元素。[MDN array.toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)。

显然，这个方法和 join 方法比较一下。

1. 返回拼接的字符串；
2. 不会改变原数组。

```javascript
var a1 = [1, 2, 3];
var a2 = a1.toString();
a2 //"1,2,3"
```

## ES6 中新添的数组方法

上面的这些方法都是 ES5 的，来看看 ES6 添加了哪些新方法。

### copyWithin

`copyWithin()` 方法会浅拷贝数组的部分元素到同一数组的不同位置，且不改变数组的大小，返回该数组。[MDN array.copyWithin](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)。

接受三个参数，分别是要拷贝到的位置 target，拷贝开始位置 start 和结束位置 end。

1. 返回修改了的原数组；
2. 会对数组进行修改，且是浅拷贝；
3. 参数可负，负值时倒推，且 end 为空表示数组长度。

```javascript
var a1 = [1, 2, 3, 4, 5];
var a2 = a1.copyWithin(0, 2, 4);
a1 //[3, 4, 3, 4, 5]
a2 //[3, 4, 3, 4, 5]
a1 === a2; //true
```

### find

如果数组中某个元素满足测试条件，find() 方法就会返回满足条件的第一个元素，如果没有满足条件的元素，则返回 undefined。[MDN array.find](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)。

1. 返回找到的那个元素，若未找到，返回 underfined
2. 不对原数组产生影响。

```javascript
function isBigEnough(element, index, array) {
  return (element >= 10);
}
var a1 = [8, 18, 14];
var num = a1.find(isBigEnough); //18
```

### findIndex

findIndex()方法用来查找数组中某指定元素的索引, 如果找不到指定的元素, 则返回 -1。[MDN array.findIndex](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)。

这个方法可以参考 find 方法，只是返回值是元素的索引而非元素本身。

### fill

使用 `fill()` 方法，可以将一个数组中指定区间的所有元素的值, 都替换成或者说填充成为某个固定的值。[MDN array.fill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)。

fill 方法接受三个参数，第一个参数 value 表示要填充到值，后面两个 start 和 end 表示开始和结束位置，可选，且左闭右开。

1. 函数返回值是修改了的原数组；
2. 可对数组产生影响。

```javascript
var a1 = [1, 2, 3, 4, 5];
var a2 = a1.fill(6, 1, 4);
a1 //[1, 6, 6, 6, 5]
a2 //[1, 6, 6, 6, 5]
a1 === a2; //true
```

### keys

数组的 keys() 方法返回一个数组索引的迭代器。[MDN array.keys](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)。

这个方法会返回一个数组索引的迭代器，迭代器在 ES6 中有特殊的用途。

1. 函数返回一个迭代器对象；
2. 不会改变原数组。

```javascript
var arr = ["a", "b", "c"];
var iterator = arr.keys();

console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### entries

entries() 方法返回一个 Array Iterator 对象，该对象包含数组中每一个索引的键值对。[MDN array.entries](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)。

```javascript
var arr = ["a", "b", "c"];
var eArr = arr.entries();

console.log(eArr.next().value); // [0, "a"]
console.log(eArr.next().value); // [1, "b"]
console.log(eArr.next().value); // [2, "c"]
```

### includes

includes() 方法用来判断当前数组是否包含某指定的值，如果是，则返回 true，否则返回 false。[MDN array.includes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)。

该函数接受两个参数，第二个参数表示开始查找位置，起始位置为 0。这个方法与 indexOf 方法最大的区别不仅在于返回值一个是索引，一个是布尔值，indexOf 方法使用的是 `===` 来判断，无法判断 NaN 情况，而 includes 可以判断。

1. 返回 true 或 false；
2. 不会改变原数组。

```javascript
var a1 = [1, NaN];
a1.indexOf(NaN);//-1
a1.includes(NaN);//true
```

## 总结

本文重在总结，没啥干货。共勉！

## 参考

>[MDN Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
>[ES6 入门-数组的扩展](http://es6.ruanyifeng.com/#docs/array)
>[Array 数组方法](http://caibaojian.com/js-array-object-method.html?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com)