---
title: '我的建站路1：Ghost 博客平台'
layout: post
comments: true
date: 2016-08-02 22:53:23
tags: [建站, Ghost]
categories: 建站
description: 建站 Ghost 博客 平台
photos: 
- http://ww2.sinaimg.cn/mw690/e3dde130gw1f8hk9i2r3hj20zk0nnk3r.jpg
- http://ww2.sinaimg.cn/small/e3dde130gw1f8hk9i2r3hj20zk0nnk3r.jpg

---

### 空间和域名

关于空间和域名，不想说太多，如果你真心想建立一个自己的网站的话，这两个是必须要弄的。

<!--more-->

我的服务器用的腾讯云的服务器，域名用的也是腾讯的，国内做的比较好的还有阿里云（其实我只知道这两家），国外的知道不少，像Godaddy、securedservers、codero等，当然还有一些便宜的可以做带理的vps服务器。

我的服务器用的系统是Ubuntu Server 14.04 64位，刚买的时候想尝试一下centos，发现用的不习惯，就重装成ubuntu，还是Ubuntu的命令比较习惯。配置是最便宜的，1G内存，1核CPU，20GB的硬盘，只是搭一个简单的个人博客，这些配置就已经足够了。

至于域名，是用来映射IP的，其实完全可以不用申请域名，通过IP就可以访问到你的网站。人靠衣装，域名可以方便别人记住你的网站。腾讯有它自己的域名解析，还是免费的，顺便也就用了。因为我申请的是国内.cn的域名，天朝的网站都是要审核的，大概花了两个星期的时间吧，提交材料还碰到许多问题，非常麻烦。如果嫌麻烦可以直接买国外的域名，简单方便，最好支持支付宝就好了，不要让支付成为累赘。

到此，建站的三大要素都有了，服务器，域名和域名解析。关于域名解析，因为是第一次用，感觉挺有意思的，不过我自己吃过亏，在解析的时候。下面这个图是我的域名解析信息：

![](/content/images/2016/08/----.png)

我的域名是songjz.cn，主机记录www表示当访问www.songjz.cn的时候指向的ip，\*表示匹配所有\*.songjz.cn，@表示匹配songjz.cn，具体如下图

![](/content/images/2016/08/----2-1.png)

### Ghost 开源的博客平台

下面就是安装Ghost了，现在还需要连接服务器的两个工具`Xshell`和`Xftp`，都是免费的。

通过Xshell连接到Ubuntu服务器，update后先安装`nodejs`：

```
root@server1:~# sudo apt-get update
root@server1:~# sudo apt-get install nodejs
```

安装nodejs的同时，也会把npm也一起安装：

```
root@server1:~# node -v
v4.4.7
root@server1:~# npm -v
1.3.10
```

下面开始安装Ghost，通过[Ghost下载界面](https://ghost.org/developers/)下载最新版，通过Xftp把文件上传到服务器的自定义位置。（如果没有高级root权限，建议放到当前用户的目录下，防止权限不足问题）

通过`unzip`或`tar`解压刚才的文件（这要看下载的文件是.zip还是.tar.gz），然后执行：

```
cd ghost
npm install --production
```

Ghost博客需要的库较多，需要安装一会。

复制一份config.example.js为config.js，用vim打开：

```
production: {
    url: 'http://blog.songjz.cn',
	//将上面url修改为自己的博客主页
    mail: {},
    database: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, '/content/data/ghost.db')
        },
        debug: false
    },
    server: {
        host: '127.0.0.1',
		//host修改成'0.0.0.0'
        port: '2368'
		//运行的端口，把端口设置成'80'
    }
},
```

基本配置完成，然后：

```
root@server1:~# node index.js
WARNING: Ghost is attempting to use a direct method to send email.
It is recommended that you explicitly configure an email service.
Help and documentation can be found at http://support.ghost.org/mail.

Migrations: Up-to-date at version 004
Ghost is running in development...
Listening on 0.0.0.0:80
Url configured as: http://blog.songjz.cn
Ctrl+C to shut down
```

报了一个warning，是因为没有配置邮件。实际上Ghost是一个多人博客平台，通过邮件邀请他人一起写博客，这个先不管。

这个时候就可以通过浏览器访问主页了，如果域名和解析暂时无法使用的时候，也可以通过主机的ip来直接访问。比如http://115.159.219.205。

### Forever和Nginx

这个时候通过ctrl+c或关闭Xshell，Ghost的运行就会停止，如何让Ghost后台运行？

Forever是一个简单的命令式nodejs的守护进程，创建、自动重启node进程，输出node日志，还可以同时开启多个node进程,可以通过`forever start`启动进程，`forever stop`关闭进程，`forever list`查看当前运行的进程列表：

```
npm install -g forever
forever start index.js
forever list
```

Nginx 是一个高性能的HTTP和反向代理服务器，以它的稳定性、丰富的功能集、示例配置文件和低系统资源的消耗而闻名。

所谓的反向代理，就是通过不同的域名映射到同一个ip，比如songjz.cn的域名只能对应一个115.159.219.205ip地址，而浏览器输入一般都是默认访问80端口，所以我输入www.songjz.cn和blog.songjz.cn都是访问服务器的80端口。

那么我想要输入www.songjz.cn的时候跳转到我的主页，输入blog.songjz.cn跳转到我博客的主页，其实也可以通过URL解析来实现，例如访问博客页www.songjz.cn/blog。

现在有一个问题，Ghost是一个独立的nodejs应用，想要通过URL解析很难实现，而nginx的反向代理就可以很轻松实现。原理是先通过80端口访问nginx，nginx判断不同的三级域名，转给其它端口。

[nginx的下载页面](http://nginx.org/en/download.html)我用的是1.81的稳定版本。

将nginx安装包通过Xftp复制到服务器中，解压到/usr/local目录下:

```
cd nginx
./configure
make
```

打开conf/nginx.conf，修改配置：

```
http {
	include       mime.types;
	default_type  application/octet-stream;
	sendfile        on;
	keepalive_timeout  65;
	#pool
	upstream blog_pool{
		server 127.0.0.1:5000;#这边开启端口5000
	}
	server {
		listen       80;
		server_name  blog.songjz.cn;
		#这句话就是把浏览器打开blog.songjz.cn提交给其它端口
		location / {
			proxy_set_header Host $host;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_pass http://blog_pool;
			#调用前面建好的pool
		}
	}
```

增加nginx的环境变量，通过：

```
nginx
//开启nginx
nginx -s stop
//关闭nginx
```

这个时候再回到Ghost的目录下，把config.js开启端口设置成5000，重启Ghost，通过blog.songjz.cn就可以访问Ghost的主页。