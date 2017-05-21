---
title: Docker，搭建靶场的利器
layout: post
comments: true
date: 2017-01-07 11:15:32
tags: [建站, Docker]
categories: 建站
description: Docker 搭建 靶场 利器
photos:
- https://ww4.sinaimg.cn/mw690/e3dde130gw1fbhwu8wopyj20zk0np0zu.jpg
- https://ww4.sinaimg.cn/small/e3dde130gw1fbhwu8wopyj20zk0np0zu.jpg
---
最近在看《李宗仁回忆录》，断断续续看了一个星期，因白天没时间，只能抽出晚上的时间，荒废了好多学习的时间，自觉惭愧。本来就对历史非常感兴趣，而李宗仁的这个回忆录，写得真是太好啦，每天晚上回来，本想着打开书就看一会，然后就渐渐忘我了。

这本书最吸引我的地方是刷新了我对民国历史的理解，之前，我了解到的李宗仁是一个领导台儿庄战役，与蒋介石对立的桂系领袖。仔细读完这本书之后，发现李实为一代英雄，和预想中差别真是太大，而且从他做事的风格打心底佩服这个传奇人物。少时家贫，弃文从戎，从排长做起，负过伤，一步一步（克死上级），连长、营长、团长、旅长，三十出头，统一广西，李的年轻史就是一部奋斗史。

后联合广东，致力于北伐，他所统领的七军被誉为“钢军”，奠定了南京国民政府的基础，龙潭一役，奠定了统一全国的基础。后经武汉军变，蒋桂战争，中原大战而不被灭亡，抗日战争后又有很多辉煌事迹。这本书爆出很多历史事实，比如北伐，国民党内部纷争，蒋介石的为人。

之前我一直有一个疑惑，像汪精卫这种大汉奸，为什么后人骂之甚少，才知道原来汪在国民党内部地位如此之高，而且投日后也未作出对国家，对民族不利的事情。

虽说历史不可全信，而且看这本书就像看小说一样过瘾，李宗仁的经历就像儿时自己的梦想一样，只不过一个是真实存在，一个从来未踏出第一步，看完之后，只能用佩服得五体投地来形容。
<!--more-->
最近公司里开始全面使用 Docker 来搭建靶机环境，以前搭环境都是用 Ubuntu 虚拟机，安装必备的软件 mysql、php 和 apache（以 php 服务器为例），然后整个虚拟机生成一个好几 G 的 .vof 虚拟机文件当作服务器，每次需要搭一个新环境，都必先拷贝该文件，然后像 `/var/www/html` 中复制 php web 文件。可以说整个过程，费时费力，还很占用空间。

很早之前，公司里有部分人就开始研究 docker，最近才打算使用 docker 来搭建环境。而我最近在写 [jQuery 源码](https://github.com/songjinzhong/JQuerySource)方面的项目，想来也没啥可写，就抽时间把这几周使用 docker 的经验记录一下吧，欢迎打脸。

## 为什么要用 docker

docker 在 [github](https://github.com/docker/docker) 上开源，它是一个引擎，支持创建一个轻量级、可移植的容器，用过之后感觉和虚拟机非常像呀，而且还比虚拟机轻量多了。docker 最经典的一句话：build once, configure once and run anywhere。可见 docker 的强大。

比如现在的阿里云容器，用户可以在上面购买 web 服务，然后 docker 一键部署生成应用，可见 docker 已经有取代虚拟云主机的趋势，毕竟对于大部分服务商来说，他们只希望 web 服务能平稳安全的运行，并不在意它运行在容器里还是虚拟机里。

我的理解，docker 是面向运维人员的，而开发人员，该怎么开发，还是怎么开发，只是运行的平台不同而已。

**那么，docker 的优势在哪里？**

支持多平台，目前已支持各大操作系统：window、linux 和 mac，[docker products overview](https://www.docker.com/products/overview)。

就我使用的来看，比 VM 小，比 VM 快，docker 在构建应用的过程中，速度要比虚拟机快很多，而且每个应用依托 image，实际上是在 container 中运行，镜像和容器分开，在构建多个应用的时候，又非常多方便。

docker 虽然是容器，但却是通过命令行来管理，而且还借鉴 git 操作，比如一些常见的 commit、push、pull 命令。

CPU/内存的低消耗这方面我无法验证，但是 build once，run anywhere，这点非常赞同。比如公司里现在需要搭建 php 的环境，只需要 build 一个 php+mysql+apache 的环境，便可构建任意一个 web 应用。

## docker 的使用

关于 docker 的安装，可以参考 [docker docs](https://docs.docker.com/)，详细介绍了支持操作系统的安装。

使用 docker 的第一步，就是拉取 image。docker image 是 docker 运行时的模版，比如我想要运行一个 mysql 服务，就必须有一个安装了 mysql 的基本的 ubuntu 系统。这个就是运行时基本的 image，而最基本的 image 要属一个纯净的 ubuntu 系统[docker hub ubuntu](https://hub.docker.com/_/ubuntu/)。

第一步，先拉取一个简单的 docker 镜像。docker 提供一个类似于 github 一样镜像官网，[https://hub.docker.com/](https://hub.docker.com/)，用户可以 pull 到一些基本和流行的镜像。当然在 docker hub 中最火的还是 ubuntu 镜像，关注度最高。用户把基本 ubuntu 镜像加以改造，衍生出各类镜像文件。

```
docker pull ubuntu:14.04
```

上面这个是最基本的 docker pull 命令，有 `ubuntu:14.04` 表示官方 ubuntu 镜像 14.04 版本，也可以 pull 最新版的比如：`docker pull ubuntu:latest` 或者 pull 16.04：`docker pull ubuntu:16.04`。

这个是从 docker hub 官网获取镜像，速度非常慢，好在国内有镜像加速器，具体配置可参考[这篇文章](http://blog.csdn.net/huludan/article/details/52713799)，或者注册 [www.daocloud.io](https://www.daocloud.io) 通过[这个页面](https://www.daocloud.io/mirror.html#accelerator-doc)获取镜像加速。通过加速之后，你会发现，速度非常快。

这个时候通过 `docker images` 可以查看当前存在的镜像。

运行的话，使用下面的命令：

```
docker run -i -t ubuntu:14.04 /bin/bash 
// -i 表示输出在标准控制台
// -t 表示分配一个 tty 终端设备
```

**这个命令执行后，在当前的命令行下面，会进入 ubuntu:14.04 的命令行，就像 ssh 服务器那样**，exit 命令退出。ubuntu:14.04 是 image 名称和版本，最后是要执行的命令，这里是进入命令行，所以 执行 /bin/bash 文件。因为 build 是自动的，所以在大多数情况下（后面介绍 Dockerfile 会用到）事先写好一个 bash 文件，启动运行这个 bash 文件即可，比如：

```
docker run -d ubuntu:14.04 /bin/bash /run.sh
// -d 表示后台运行容器
```

`docker ps ` 用于查看当前正在运行的 container，`docker ps -a` 显示所有 container，`docker stop/start/restart {container_id | container name}` 可以停止/开启/重启 正在运行或已经停止的容器。总之记住一句话，**images 是模版，而运行靠容器**。

有时候为了方便管理，还需要对 container 进行命名：

```
docker run -d ubuntu:14.04 /bin/bash /run.sh --name=test
```

如果运行时忘记了或者需要修改名字，可以通过下面的命令，因为即使忘记命名，docker container 会使用一个系统随机分配的名字：

```
docker rename {old_name} {new_name}
```

我们可以将基本的 ubuntu 镜像升级成一个 mysql 的服务器，这是通过 commit 命令来完成：

```
host$ docker run -i -t ubuntu:14.04 /bin/bash 
// 下面进入 ubuntu:14.04 shell
// 命令进行简化
root$ sudo apt-get update
root$ sudo apt-get install mysql-server
root$ exit
host$ docker commit -m "install mysql_server" {container_id} ubuntu:mysql
host$ docker images
```

会发现多一个叫做 ubuntu:mysql 的镜像文件，便是 commit 后的镜像文件，此时可以通过 push 命令将它们 push 到服务器供别人使用。

docker 还通过端口映射，文件夹映射等，比如一个 mysql 服务器，它启动了之后，实际上会在容器中开启 3306 端口，可以通过 -p 将它们映射到本地的 3306 端口：

```
docker run -d -p 3306:3306 -p 80:80 -v /web/:/var/www/html ubuntu:apache_server /bin/bash /run.sh
```

-v 会将主机目录下 /web 映射到 /var/www/html 中。

这是一个容器，如果我们需要开启第二个 web 应用，只需要新建另一个容器即可，所谓的 build once，run everywhere。

有时候对于数据库服务和 apache 服务，需要在两个不同的容器中运行，需要将它们建立 link 链接。

## Dockerfile

前面说了，一键部署，一键运行，而我们只看到的是一键运行，而一键部署该如何设置？

通过 docker 提供的 docker build 命令。

新建 image 有两种方法，前面已经介绍过一种 commit 的方法，但是 commit 是针对 container 来说的，构建的话需要一个已经完好的 container，过程略有繁琐。

docker build 需要一个 Dockerfile 的文件，如果该文件在当前目录下：

```
docker build -t ubuntu:mysql .
```

-t 参数表示给 image 添加一个 tag 标签，Dockerfile 也可以指定位置，把 . 换成一个指定的 Dockerfile 即可。

而一个 Dockerfile 大致如下：

```
# 表示来自哪个 image
FROM ubuntu:14:04
# 作者
MAINTAINER author <author@qq.com>
# ENV 指定 docker 容器的环境变量
ENV DEBIAN_FRONTEND noninteractive
# RUN 表示执行 bash 命令
# install package
RUN apt-get update && \
  apt-get -y install supervisor git apache2 libapache2-mod-php5 mysql-server php5-mysql pwgen php-apc php5-mcrypt && \
  echo "ServerName localhost" >> /etc/apache2/apache2.conf
# ADD 表示将本地文件添加到容器目录中
ADD start-apache2.sh /start-apache2.sh
ADD start-mysqld.sh /start-mysqld.sh
ADD run.sh /run.sh
RUN chmod 755 /*.sh
ADD my.cnf /etc/mysql/conf.d/my.cnf
ADD supervisord-apache2.conf /etc/supervisor/conf.d/supervisord-apache2.conf
ADD supervisord-mysqld.conf /etc/supervisor/conf.d/supervisord-mysqld.conf

# 删除数据库文件
RUN rm -rf /var/lib/mysql/*

# 添加数据库配置文件
ADD create_mysql_admin_user.sh /create_mysql_admin_user.sh
RUN chmod 755 /*.sh

# clone app 文件
RUN git clone https://github.com/fermayo/hello-world-lamp.git /var/www/html

#Environment variables to configure php
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV PHP_POST_MAX_SIZE 10M

# 添加挂载，用于共享，和 -v 命令一样 
VOLUME  ["/etc/mysql", "/var/lib/mysql" ]

# 暴露端口
EXPOSE 80 3306
# 添加默认执行的 bash（cmd）
CMD ["/run.sh"]
```

**这里面有一个坑啊。**因为这个 14.04 的镜像来自于官方，所以 apt-get 的源是美国的主机，非常慢，建议先对 ubuntu 的更新源进行修改，然后再执行 build 命令，切记。

上面这个 Dockerfile 文件来自 github 上一个 php+mysql+apache 环境搭建项目，[lamp](https://github.com/tutumcloud/lamp)。

更多 Dockerfile 的命令请参考[如何使用Dockerfile构建镜像](http://blog.csdn.net/qinyushuang/article/details/43342553)或[Docker入门教程（三）Dockerfile](http://dockone.io/article/103)。

## 总结

其实 docker 的使用非常简单，又不用看它的的源码，只是一些简单的命令，而且网上的教程满天飞，想在短时间内学会 docker 是完全没有问题的，但是关键的问题是：你为什么要学 docker？docker 能给你带来哪些便利？

因我公司需要掌握 docker，我也就花了一些时间，算入门 docker 了吧，基本的命令都有所了解，**而且确实也带来了很大的便利**。但入门始终是入门，有一些问题会在使用的过程中碰到，比如 

1. container 容器 root 权限的问题;
2. docker 像虚拟机那样安全吗;
3. docker 的性能与 VM 性能和直接在本地运行应用的性能，都有多大差别？

共勉！

## 参考

>[docker 中文](http://www.docker.org.cn/book/docker/what-is-docker-16.html)
>[Docker入门教程](http://dockone.io/article/111)
>[Docker容器入门](http://www.cnblogs.com/xing901022/p/5199473.html)
>[如何使用Dockerfile构建镜像](http://blog.csdn.net/qinyushuang/article/details/43342553)