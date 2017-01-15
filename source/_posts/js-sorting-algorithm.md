---
title: JavaScript 版各大排序算法
layout: post
comments: true
date: 2017-01-14 14:28:29
tags: [JavaScript, JS进阶, 排序]
categories: [JavaScript]
description: JavaScript 各大 排序 算法
photos:
- http://ww4.sinaimg.cn/mw690/e3dde130gw1fbq5ranotaj20zk0npwm6.jpg
- http://ww4.sinaimg.cn/small/e3dde130gw1fbq5ranotaj20zk0npwm6.jpg
---
最近看到了很多公司都在准备明年的实习校招，虽然离三月份还有一段时间，感觉已经可以准备了。在网上看了一些排序算法和数组去重操作，感觉都写的很好，心血来潮，也来写一写。
<!--more-->
## 排序算法的设计和实现

说到排序，之前在做百度前端学院的题目的时候，也碰到过，并把它整理到 [github](https://songjinzhong.github.io/BaiDu_IFE/stage2/task19/) 上。这是一个可视化的排序展示，支持冒泡、插入和选择排序，具体使用先 随机添加 40 个，然后点排序，就可以看到可视化的效果。

推荐一下，这里有个可视化的[排序博客](http://coolshell.cn/articles/3933.html)，各大排序算法的实现都栩栩如生。

javascript 写排序算法也比较奇葩，主要是参数的问题，比如 javascript 算法函数可以扔给 Array 原型：`Array.prototype.sort = function`，也可以直接写个函数带参数：`function sort(array){}`，在我看来，哪种方法都一样，需要注意的是兼容性的问题，如果可以考虑对所有可遍历对象都能排序（比如 arguments），才大法好。

好了，直接入主题了（下面的排序均是从小到大的顺序）。

### 插入排序

插入排序是一种基本排序，它的基本思路是构建有序序列，对于未排序的数据，在已排序的基础上，从右向左（或者二分查找）选择位置插入，[维基百科-插入排序](https://zh.wikipedia.org/wiki/%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F)。

```javascript
function insert_sort(input){
  var i, j, temp;
  for(i = 1; i < input.length; i++){
    temp = input[i];
    for(j = i-1; j >= 0 && input[j] > temp; j--)
      input[j+1] = input[j];
    input[j+1] = temp;
  }
  return input;
}
```

如果以比较次数和移动次数来衡量算法的效率，最好情况下，比较 n-1 次，移动 0 次，最坏情况，比较 n\*(n-1)/2 次，移动 n\*(n-1)/2 次。

### 二分插入排序

思路基本同上，只是在查找插入位置的时候，不是依次查找，而是采用二分法：

```javascript
function bin_insert_sort(input){
  var i, j, low, high, mid, temp;
  for(i = 1; i < input.length; i++){
    temp = input[i];
    high = i - 1;
    low = 0;
    while(low <= high){
      mid = parseInt((low + high) / 2);
      if(temp < input[mid]){
        high = mid - 1;
      }else{
        low = mid + 1;
      }
    }
    // low 位置就是要插入的位置
    for(j = i-1; j >= low; j--)
      input[j+1] = input[j];
    input[low] = temp;
  }
  return input;
}
```

### 希尔排序

希尔排序其实是加强版的插入排序，就是在原先插入排序的基础上，加入了步长，原先插入排序的步长是 1，而且步长不同，效率也有差异，选择一个合适的步长也很重要。而且，希尔排序的最后一步，也必定是步长为 1 的插入排序，只不过此时整个排序已经基本稳定。[维基百科-希尔排序](https://zh.wikipedia.org/wiki/%E5%B8%8C%E5%B0%94%E6%8E%92%E5%BA%8F)。

```javascript
function shell_sort(input){
  var gap, i, j, temp;
  gap = input.length >> 1;
  while(gap > 0){
    for (i = gap; i < input.length; i++) {
      temp = input[i];
      for (j = i - gap; j >= 0 && input[j] > temp; j -= gap)
        input[j + gap] = input[j];
      input[j + gap] = temp;
    }
    gap = gap >> 1;
  }
  return input;
}
```

### 选择排序

选择排序的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。[维基百科-冒泡排序](https://zh.wikipedia.org/wiki/%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F)。

```javascript
function select_sort(input){
  var i, j, min, temp;
  for(i = 0; i < input.length - 1; i++){
    min = i;
    for(j = i + 1; j < input.length; j++){
      if(input[min] > input[j])
        min = j;
    }
    temp = input[min];
    input[min] = input[i];
    input[i] = temp;
  }
  return input;
}
```

选择排序在最好情况下，也要比较 n\*(n-1)/2，移动 n-1 次（这里可以加个判断，移动 0 次），最差情况下，比较 n\*(n-1)/2 次，移动 n-1 次。所有最好，最坏情况下，比较次数是一样的。

### 冒泡排序

冒泡排序的基本原理：对于带排序列，它会多次遍历序列，每次都会比较相邻的两个元素，若顺序相反，即交换它们，[维基百科-冒泡排序](https://zh.wikipedia.org/wiki/%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F)。

```javascript
function bubble_sort(input){
  var i, j, temp, flag;
  for(i = 0; i < input.length - 1; i++){
    flag = true;
    for(j = 0; j < input.length - i; j++){
      if(input[j] > input[j + 1]){
        temp = input[j];
        input[j] = input[j + 1];
        input[j + 1] = temp;
        flag = false;
      }
    }
    if(flag)
      // 提前结束
      break;
  }
  return input;
}
```

有 flag 时，最好情况比较 n-1 次，移动 0 次，最坏情况，比较 n\*(n-1)/2 次，交换 n\*(n-1)/2。

### 快排

记得我一个同学去百度面试，百度面试官上来就让他手写了一个快排，可见对快排的掌握很重要呀，而且快排理解起来也不容易。

[维基百科-快排](https://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F)。快排的基本思路就是选择一个元素，然后按照与这个元素的比较，将大于这个元素的都拿到右边，小于这个元素的都拿到左边，并找到这个元素的位置，这个元素的左右两边递归。

```javascript
function quick_sort(input){
  function sort(start, end){
    if(start >= end){
      return;
    }
    var mid = partition(start, end);
    sort(start, mid - 1);
    sort(mid + 1, end);
  }
  function partition(start, end){
    var left = start, right = end, key = input[start], temp;
    while(left < right){
      while(left < right && input[right] >= key){
        right --;
      }
      input[left] = input[right];
      while(left < right && input[left] <= key){
        left ++;
      }
      input[right] = input[left];
    }
    input[left] = key;
    return left;
  }
  // main here
  sort(0, input.length - 1);
  return input;
}
```

partition 函数就是来找对应的 mid，sort 函数用来排序。

关于快排的优化，可以从以下几个方面来考虑：

1. partition 函数的哨兵（比较值）除了 start 以外，用其他位置（比如中位数）是否可行；
2. 当 start 和 end 间距很小的时候，改用其他高效算法
3. 还有就是优化递归。

其实呢，上面的这个算法，并不属于 JavaScript 版本，而更像 C 版本的，重在让人理解快排，下面是 JS 版的快排，来体验下 JS 的迷人特性吧：

```javascript
// javascript 版
function quick_sort(input) {
  var len = input.length;
  if (len <= 1)
    return input.slice(0);
  var left = [];
  var right = [];
  // 基准函数
  var mid = [input[0]];
  for (var i = 1; i < len; i++)
    if (input[i] < mid[0])
      left.push(input[i]);
    else
      right.push(input[i]);
  return quick_sort(left).concat(mid.concat(quick_sort(right)));
};
```

这个 JS 版快排也比较好懂，找到那个基准（这里是第一个元素 input[0]）之后，遍历，把小于基准的放到左边，大于基准的放到右边，然后返回拼接数组。

### 归并排序

在学习分治算法时，典型的一个例子就是归并。[维基百科-归并排序](https://zh.wikipedia.org/wiki/%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F)。思路就是先分后和，依旧是递归。

```javascript
function merge_sort(input){
  function merge(left, right){
    var temp = [];
    var i = 0, j = 0;
    while(i < left.length && j < right.length){
      if(left[i] < right[j]){
        temp.push(left[i]);
        i++;
      }else{
        temp.push(right[j]);
        j++;
      }
    }
    if(i < left.length){
      temp = temp.concat(left.slice(i));
    }
    if(j < right.length){
      temp = temp.concat(right.slice(j));
    }
    return temp;
  }
  if(input.length <=1){
    return input;
  }
  var mid = parseInt(input.length / 2);
  return merge(merge_sort(input.slice(0, mid)), merge_sort(input.slice(mid)))
}
```

同样，以上归并仍然是类似 C 语言版本，JavaScript 版本如下：

```javascript
// javascript 版
function merge_sort(input) {
  var merge = function(left, right) {
    var final = [];
    while (left.length && right.length)
      final.push(left[0] <= right[0] ? left.shift() : right.shift());
    return final.concat(left.concat(right));
  };
  var len = input.length;
  if (len < 2) return input;
  var mid = len / 2;
  return merge(merge_sort(input.slice(0, parseInt(mid))), merge_sort(input.slice(parseInt(mid))));
};
```

数组的一系列操作大大优化排序的过程。

### 堆排序

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。[维基百科-堆排序](https://zh.wikipedia.org/wiki/%E5%A0%86%E6%8E%92%E5%BA%8F)。

其实，对于堆排序，只要牢记几个操作就可以，比如找到最后一个父节点，如何找到子节点（初始为 0），如何建立一个最大堆。

```javascript
function heap_sort(input){
  var arr = input.slice(0);
  function swap(i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  // 上推操作
  function max_heapify(start, end) {
    var dad = start;
    var son = dad * 2 + 1;
    if (son >= end)
      return;
    if (son + 1 < end && arr[son] < arr[son + 1])
      son++;
    if (arr[dad] <= arr[son]) {
      swap(dad, son);
      max_heapify(son, end);
    }
  }

  var len = arr.length;
  // 建立一个最大堆
  for (var i = Math.floor(len / 2) - 1; i >= 0; i--)
    max_heapify(i, len);
  for (var i = len - 1; i > 0; i--) {
    swap(0, i);
    max_heapify(0, i);
  }

  return arr;
};
```

堆排序的过程大致如下：先生成一个最大堆，然后将根节点（最大元素）与最后一个元素交换，然后把剩下的 n-1 元素再次生成最大堆，交换，生成...

## 总结

那么问题来了，到底这些算法写的对不对，不然写个测试脚本来试试：

```javascript
// 两种排序算法
var test = function(sort1, sort2){
  var arr1 = [], arr2 = [];
  // 随机生成 100 个 1～100 随机数
  function random_arr(a1, a2){
    var tmp;
    for(var i = 0; i < 100; i++){
      tmp = parseInt(Math.random()*100) + 1;
      a1.push(tmp);
      a2.push(tmp);
    }
  }

  var flag = true;
  for(var i = 0; i < 100; i++){
    random_arr(arr1, arr2);
    // 比较排序算法的结果
    if(sort1(arr1).toString() != sort2(arr2).toString()){
      flag = false;
      break;
    }
    arr1 = arr2 = [];
  }
  return flag ? "Ok!" : "Error!"
}

console.log(test(insert_sort, merge_sort)); //"Ok!"
```

如果已知插入排序是正确的情况下，就可以验证归并排序是否正确了。共勉！

## 参考

>[维基百科 排序搜索](https://zh.wikipedia.org/w/index.php?title=Special:%E6%90%9C%E7%B4%A2&profile=default&fulltext=Search&search=%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F&searchToken=2hr0n0ogeab2hwdmlm2z5ujdm)
>[聊一聊排序算法](http://www.barretlee.com/blog/2016/08/11/algorithms-of-sort/)
>[秒杀9种排序算法(JavaScript版)](http://www.cnblogs.com/JChen666/p/3360853.html)
>[排序图解：js排序算法实现](http://www.cnblogs.com/wteam-xq/p/4752610.html)