---
title: Unity3D 中一个很有趣的 Debug
layout: post
comments: true
date: 2016-11-14 19:58:10
tags: [Unity3D, Debug]
categories: Unity3D
description: Unity3D 有趣 Debug
photos:
- https://ww1.sinaimg.cn/mw690/e3dde130gw1f9rw1o7qqyj20zk0qok3y.jpg
- https://ww1.sinaimg.cn/small/e3dde130gw1f9rw1o7qqyj20zk0qok3y.jpg
---

最近开始准备毕业论文写开题报告，又开始玩起来 Unity 和 C# 脚本，依旧还是熟悉的味道。因为这次是带着改进的思路去整理之前写过的代码，主要以修改为主，仍然学到了不少知识。

<!--more-->

首先来简单介绍一下 Unity3D 中脚本的执行。Unity 的界面是那种拖拽式的，所有物体和物体之间的联系和通信就要靠脚本来完成。有三类脚本，分别是 C#、JavaScript 和 Boo(这个真心没用过)，C# 和 java 风格类似，JavaScript 天生就适合干脚本的活，独开一档。

脚本的运行也很有意思，简单来叙述一下。Unity 运行时就像在播电影一样，一帧一帧的，所以这些脚本都有一个特点，继承 MonoBehaviour 类，使用函数 Start，Update，OnGUI，FixedUpdate 等，Start 函数当系统运行时候执行，之后就不再运行，Update，OnGUI，FixedUpdate 函数在每一帧都会执行。这样子写函数就有主次了，这种语言方式很常见，比如 Arduino 也是 Start、Update 的模式。

## 向屏幕中输出 Debug.Log

因为知道了运行的原理，有两种向屏幕中输入 Debug 的方法，在 Start 函数中，在 Update 函数中。在 Start 函数中写 Debug 的好处当然是很省资源，只执行一次，但是缺点是后期无法更改，适合打印一些永久性的日志。在 Update 中可以写入一些动态的 Debug。

下面就介绍动态输出 Debug，方法很简单，先定义两个 private 的全局数组，分别记录 message 和 name。

```
static List<string> messages = new List<string>();
static List<string> names = new List<string>();
// OnGUI 函数是每帧刷新，用来显示
void OnGUI()
{
  for(int i=0;i<names.Count;i++)
  {
    // i*IntervalSize 表示显示高度，逐次变高
    GUI.Box(new Rect(0,i*IntervalSize,width,height),
      names[i] +" : "+messages[i],style);
  }
}
```

以上这段代码的功能，就是把 name 数组和 messages 数组里的内容一对一的显示在屏幕上。接下来就是如何向数组添加内容了。

```
public static void Add(string name, string message){
  //防止重复输出
  if(names.Contains(name) == false){
    names.Add(name);
    messages.Add(message);
  }else{ //已经存在则替换 message
    for(int i=0;i<names.Count;i++){
      if(names[i] == name){
        messages[i] = message;
        break;
      }
    }
  }
}
```

提供了一个静态的 Add 方法，在任何地方都可以调用，这样子一个简单的 Debug 方法就构造成功了。

添加一个最大显示时间：

```
//Update 函数
void Update(){
  // ClearTime 为 0 表示不清空
  if(ClearTime != 0){
    if(nowTime < ClearTime)
       nowTime+=Time.deltaTime;
    else{
      messages.Clear();
      names.Clear();
      nowTime = 0;
    } 
  } 
}
```

这样每隔 ClearTime 的时间就会清空 Debug。

下面是一个读本地文件的例子：

```
public static ArrayList LoadFile(string Path, string name){
  ArrayList arrlist = new ArrayList ();
  StreamReader sr = null;
  try{
    sr = File.OpenText(Path+"//"+name);
  }catch(Exception e){
    //调用 Add 函数
    DebugOnScreen.Add ("LoadFile_Error", "读取 "+name+" 文件出错");
    return arrlist;
  }
  string line;
  while ((line = sr.ReadLine ()) != null) {
    arrlist.Add (line);
  }
  sr.Close ();
  return arrlist;
}
```

## 总结

这种 Debug 的显示方法其实很常见，比如经常就会把 FPS 打印到屏幕的右上角，大致使用的也是这种方式。数组和对象比较的话，感觉还是对象存储 names 和 messages 更方便些，但是顺序有可能会被打乱。

但是还有一个问题，这种方式针对 Unity 来说可能是一种高效的方式，毕竟每一帧都在刷新，而对于其他语言，可能就不适用了。比如网页中的一个元素需要改变，完全可以用 JS 封装一个全局函数来控制。

共勉。