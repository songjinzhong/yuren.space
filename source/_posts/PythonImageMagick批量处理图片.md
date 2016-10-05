---
title: 'Windows下用 Python + ImageMagick 批量处理图片'
layout: post
comments: true
date: 2016-08-27 17:33:31
tags: [Python, 图片处理, ImageMagick]
categories: 图片处理
description: Windows Python ImageMagick 处理 图片
photos:
- http://ww4.sinaimg.cn/mw690/e3dde130gw1f8hqsr6xakj20zk0np18i.jpg
- http://ww4.sinaimg.cn/small/e3dde130gw1f8hqsr6xakj20zk0np18i.jpg
---
这周研究漏洞时，看了一下关于 ImageMagick 的漏洞，它是远程代码执行漏洞，远程攻击者利用漏洞通过上传恶意构造的图像文件，可在目标服务器执行任意代码，进而获得网站服务器的控制权。

<!--more-->

当然，漏洞不是今天讨论的重点，ImageMagick 作为一个开源的图像处理软件，受到广大前端爱好者的喜爱，肯定有其原因的。我在之前只用过 PS 处理图片，根本就没听过 ImageMagick （~~害羞~~），研究的时候发现它小巧轻便，还能支持各种脚本（ C++、Python、Java等）批量处理图片，霸气度让觉得能甩 PS 两条街，对于程序员来说，它就是**命令行上的 PhotoShop**。

它的功能完全不逊 PS，支持和处理超过 90 种图片格式，功能包括格式转换、、变换、透明度、附加、装饰、特效、文本及评论、图像识别、综合、蒙太奇、电影支持、图像计算器、离散傅立叶变换、加密或解密图片、虚拟像素支持、大图像支持、执行、异构分布式处理...

关看到这些功能，估计你就眼花缭乱了吧！

今天就来研究一下它是如何用 Python 对图片批量处理的。

### 关于安装

我是在 windows 下安装的，它对 Linux 的支持更好，相对来说，Windows 下安装比较困难，要用 C 编译执行，但是由于官网推出了 .exe 的 Windows 安装文件之后，一切都变得很简单。

[Windows 版本下载](http://www.imagemagick.org/script/binary-releases.php#windows)

~~是的，你没有看错，这个强大的软件只有 23MB。~~

在这里不建议下载最新版的，因为后面 Python 写脚本的时候，`最新版的暂时还支持不了 Wand 库`，可以从下面这个链接下载 6.9.5 ，

[其他 Windows 版本下载](http://www.imagemagick.org/download/binaries/)

**特别注意**

无论你的系统是 64 位还是32 位，一定要看一下你的 Python 是多少位的，下载和 Python 相同位数的版本。比如，我的 Python 是 32 位的，我下载的版本是`ImageMagick-6.9.5-7-Q16-x86`，不然在后面用 Python 调用 ImageMagick 库的时候，会提示找不到路径的。

比如下面这个错误 `MagickWand shared library not found`：

![](/content/images/2016/08/error.png)

安装，就直接下一步、下一步，注意下图：

![](/content/images/2016/08/zhuyi.png)

把路径添加到环境变量里，同时要安装 libraries for C and C++。

### 第一个 Hello World

安装完成，需要测试一下，到安装目录下面，把 `convert.exe`改成`im_convert.exe`，因为`convert`这个命令和系统命令重复了...

打开命令行，运行：`im_convert nanjing.jpg -gravity southeast -fill white -pointsize 16 -draw "text 5,5 'Hello World'" nanjing_hw.jpg`，**如果报错，说明环境变量没有配置好**。

上面的命令就是执行把 nanjing.jpg 在距右下角（5px，5px）处打上字体白色 Hello World 水印，效果如下：

![](/content/images/2016/08/test2.png)

### 强如 Python 脚本

好啦，开始步入主题，用 Python 配合 ImageMagick 批量处理图。

**安装 Python 的支持库**

[从官方的文档来看](http://www.imagemagick.org/script/api.php#python)，Python 支持 3 个库，分别是 Wand、PythonMagick、PythonMagickWand：

![](/content/images/2016/08/python.png)

这里我安装的是 [Wand](http://docs.wand-py.org/en/0.4.3/)， 直接`pip install Wand`，当然也可以从 GitHub 上 `git clone git://github.com/dahlia/wand.git`。

安装好之后，用 `import wand`测试一下，不保错说明安装成功，

写了一个小测试：
```
from wand.image import Image
from wand.display import display

with Image(filename='nanjing.jpg') as img:
    print(img.size)
    for r in 1, 2, 3:
        with img.clone() as i:  # 克隆图片
            i.resize(int(i.width * r * 0.25), int(i.height * r * 0.25))
            i.rotate(90 * r)
            i.save(filename='nanjing-{0}.jpg'.format(r))  # 保存图片
```

![](/content/images/2016/08/result.png)

上面用到了 `resize`：重新设置图片大小，`rotate`：图片旋转，`save`：保存图片。

如果报出了`MagickWand shared library not found`的错误，说明你的 Python 没有发现 ImageMagick 提供的接口，可能有以下原因：

1. 环境变量没配置好
2. 你的 Python 是32位，你下载的 ImageMagick 是64 位
3. Wand 更新较慢，建议用 ImageMagick 稳定版而不是最新版（6.9.5是可用的）

具体的错误还需要自己 Google，这只是我碰到的。

ImageMagick 的功能不止如此，这里只是列出了如何简单的使用，毕竟我才接触了两天，深入学习还是要花一定时间的，共勉！