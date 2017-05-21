---
title: 谷歌不在的那些日子（shadowsocks）
layout: post
comments: true
date: 2017-02-18 22:29:14
tags: [工具]
categories: 工具
description: 谷歌 不在 那些 日子 shadowsocks
photos:
- https://wx2.sinaimg.cn/mw690/e3dde130gy1fcv0te2pwuj20zk0np7el.jpg
- https://wx2.sinaimg.cn/small/e3dde130gy1fcv0te2pwuj20zk0np7el.jpg
---
我故意把名字起的这么隐晦，主要是不想被 zf 给封了，你懂的，现在 ss 这个词可是敏感词，尤其当 vpn 走不通了之后，很多人都走向了 ss 的道路。

我为什么要写这篇博客，因为我自己搭的 ss 服务器又不知咋的，速度慢得要死。平时用起来基本没啥大问题，就是偶尔出个小毛病，难受，想哭，还好重启了一下就解决了。
<!--more-->
不知道什么时候 google 才能重返大陆，但我想，它不回来说不定还好一些，普通人不用谷歌，搞技术的都有办法用谷歌，再牛逼一点的都直接去他们总部上班了。

## 翻墙之路

我刚读大学那会，也不会翻墙，搜索工具要么百度，要么 360，而且中国的 windows 系统没几个是正版的，系统一装好，有时候全家桶也就顺带着装好了。

不过，那个时候，同学之间流传着一种信仰：能上 google 的同学都是牛人。毕竟科班出身，这点追求还是有的。

记得有人会共享一些谷歌或谷歌香港的镜像网站，用多了，自然就会卡。而且那个时候还不懂 svn，如果翻墙的话，只知道手机端有个 fqrouter，电脑端有个自由门，这些免费的东西，有个最大的弊端，就是卡。

再后来，用了 chrome 之后，就开始使用一些翻墙插件，打开关闭很方便，有时候还能手动选择节点，还是老毛病，慢，卡。

## 翻墙 2.0

当认识的人多了，接触的人多了，这个技术就慢慢的娴熟起来。尤其读了研究生之后，发现，还真是学到了不少知识。

实验室里一个同学开始先搭的 ss，效果挺不错的，还把账号分享给大家。随后我觉得用别人的不如自己搭一个，买个国外的 vps 也不是很贵。

关于服务器，我在鼎盛的时候，拥有 4 台服务器，也同时拥有 4 个 ipv4 的 ip，两家国外的 vps 服务器，还有阿里云，腾讯云（均是学生计划）的主机，到现在为止，腾讯云的主机还在一直使用中，上面挂着几个网站，我的旧博就挂在上面。

关于国外的那两家 vps，主要是当时什么都不懂，其实 vps 虚拟化技术主要分为两种，一种是基于 kvm 技术的，另一种是基于 openVZ 技术的，貌似还有其它的，我不记得了。

openVZ 的虚拟化技术是不完全虚拟化，虽然你拥有 1G 内存，1 个处理器，100M 带宽，但这些都是与别人一起共享的，所以在这个范围内，如果使用的人越多，用起来就非常卡，这也是一种竞争关系。

kvm 则相对较好，它是完全虚拟化技术，分配多大，实际就有多大，限制它的主要因素则是主机的稳定性，硬盘类型（固态或普通磁盘），还有网络，毕竟买美国的 vps，延迟 150ms ～ 200ms 是正常的，300ms 的我也见过。

选择上又存在了大问题，对于一些老牌的 vps 提供商，他们的机器一般都很稳定，而最近国内一些 vps 服务商（主机在美国）声称有亚洲优化的 ip，延迟低。我在买 vps 之前，都会去逛一下这个网站 [国外主机测评](http://www.zhujiceping.com/)，还有知乎这个问答 [有哪些便宜稳定，速度也不错的Linux VPS 推荐？](https://www.zhihu.com/question/20800554)，**土豪请无视**。

## shadowsocks

shadowsocks 肯定得罪人了，不然它的 github [主页](https://github.com/shadowsocks/shadowsocks) 也不会就只有 1 个 commit：**Removed according to regulations**。哈哈！

当然万能的技术人员肯定有办法获得服务器端和客户端，ss 是基于 python 开发的一个 socks5 代理，[主页在这](https://shadowsocks.org)（ps：这个是不是主页，我也不清楚，貌似很多仿冒网站，因为存在商机，你懂的），关于安装和客户端的使用，应该不用多做分析了，上面已经说到非常清楚，大家都是技术人员。

### 一些小技巧

有时候会怕服务器宕机，或者其它种种原因，需要对服务器 ss 设置开机自启，比如我常用的一个简单方法：

```
// ubuntu
@root: vi /etc/rc.local 

// 在文件末位添加下面一段话
// 我用配置文件启动
/usr/local/bin/ssserver -c /etc/shadowsocks.json -d start
```

还有一些命令行的简单操作，比如快速开关 ss：

```
@root: vi ~/.bash_profile

// 添加下面的话
alias ssstart="/usr/local/bin/ssserver -c /etc/shadowsocks.json -d start"
alias ssstop="/usr/local/bin/ssserver -c /etc/shadowsocks.json -d stop"
```

在客户端方面，我系统为 mac，我没有使用官方推荐的那个客户端，而是用了[这款](https://github.com/shadowsocks/shadowsocks-iOS/wiki/Shadowsocks-for-OSX-Help)，比官方推荐的要小很多（1.1M，官方推荐的那个二十几兆）。

命令行默认下是不支持代理，需要额外设置。ss 在本地开放了 1080 端口，故：

```
// mac
@songjz: vi ~/.bash_profile

// 添加
alias ss-on='export ALL_PROXY=socks5://127.0.0.1:1080'
alias ss-off='unset ALL_PROXY'
```

这样子就可以通过简单的 `ss-on` 和 `ss-off` 命令来控制 ss 在命令行的启动和关闭，比如要是从 github clone 项目的时候就开启，用完则关闭。这样子是不是方便很多，当然也不排斥从头到尾都使用。

### 总结

ss 真的是一款强大的软件，服务器端给力，同一个 ip 可以设置不同的端口加不同的密码，[多端口设置](https://blog.whsir.com/post-274.html)，客户端更是包揽了所有主流的操作系统，真是非常方便，忍不住又要吹一把。

貌似我的服务器又恢复了，又可以开始工作了。

## 参考

>[搬瓦工Shadowsocks配置总结](http://www.jianshu.com/p/36e55c289d65)
>[OS X终端使用配置socks5 代理](http://www.jianshu.com/p/16d7275ec736)