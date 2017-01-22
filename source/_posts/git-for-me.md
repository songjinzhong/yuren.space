---
title: 我常用的那些 Git 命令
layout: post
comments: true
date: 2017-01-21 16:23:22
tags: [工具, Git]
categories: [工具]
description: 我 常用 那些 Git 命令
photos:
- http://wx2.sinaimg.cn/mw690/e3dde130gy1fbyc5rvraqj20zk0npmzx.jpg
- http://wx2.sinaimg.cn/small/e3dde130gy1fbyc5rvraqj20zk0npmzx.jpg
---
我从没有用过 SVN，为什么，因为我在接触 Git 之前从没有接触到版本工具，大部分时间都是一个人在盲干。我对 SVN 的命令还是熟悉那么一点点，但当我身边使用过 Git 和 SVN 的人都在夸赞前者的时候，我想，不会 SVN，那又如何呢。
<!--more-->
接触到 Git 之后，就经常混迹在 GitHub。一开始的时候，只知道 GitHub 是一个可以下载很多牛逼代码的仓库，没事就去 Download zip 包来观摩。当团队在内网用 Git 管理项目时（GitLab），这段时间是我对 Git 由浅入深的一个重要阶段，add、commit、reset、checkout。

用 Git 这么久了，我想来总结下我的使用经验。

我不喜欢图形界面，仍然靠命令行来使用 git。我承认公司使用的 pyCharm 中的 git 模块已经足够好了，但我只喜欢用命令行，当然也有例外，比如解决冲突的时候，我会使用图形界面，毕竟 git 命令行解决冲突真的有点弱鸡。如果大家觉得命令行真的用不习惯，推荐 [SourceTree](https://www.sourcetreeapp.com/)，一款不错的 git 图形化界面软件，用官网的话说，就是“Harness the power of Git and Hg in a beautifully simple application”。

下面是一些有用的 git 教程，写的都挺好的，（不，是非常好）：

>[廖雪峰 Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/)
>[git - 简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)
>[图解Git](http://marklodato.github.io/visual-git-guide/index-zh-cn.html)
>[git Book](https://git-scm.com/book/zh/v2)
>[git ppt 教程](http://www.slideshare.net/ihower/git-tutorial-13695342)

## 我常用的一些 git 命令

我最常敲的 git 命令还属 `git status`，这个命令就像 linux 的 `ls` 命令一样深入人心。我是那种有强迫症的程序员，每执行完一个操作，比如 add，commit 等，我都会用 status 命令来查看下执行结果，因为总有一种不放心的感觉。做事情认真的同学，写出来的代码肯定会让人放心。

### git init

`git init` 可以在当前文件夹下创建一个 git 仓库，即 `.git` 文件夹，而大多数的时候，我们会忽略这个命令，而通过 `git clone url` 的方式来获取代码，这样可以省去很多设置，比如 remote。

git init 用途还是很广泛的，对于一个用在本地的项目，我们不需要把它提交到服务器，但是需要时刻观察它有哪些文件经过改动，这时在这个项目创建一个 git 文件版本库，还是非常实用的。但仔细想想，发现 git 的产生本来就是为解决这个问题的，只不过有了 push pull 这样的命令后，git 才由本地面向服务器，继而有了 github 这样的网站（pull request 请求）。

### git config

`git config` 的命令太多了，这里讲不完的，不介绍了，需要设置什么自己百度就可以解决，config 的配置文件分为 global 和 local，global 的文件位置一般是在 `/etc/gitconfig` 或 `~/.gitconfig` 内，而 local 的配置文件在 .git 文件的 config 文件中，无需手动修改他们，用命令行就行啦。比如：

```
// 设置是否显示不同颜色
git config color.ui true
// window 平台换行报错
git config --global core.autocrlf false
```

从服务器上 push 项目需要提供 url，这里有两种类型的 url，http 和 git，无论哪种方式，都需要我们提供一个 username 和 useremail，一般安装好一个 git 之后，首先要做的就是这个配置 user 的命令。

```
git config --global user.name songjinzhong
git config --global user.email xx@xx.com
```

### git ssh

我说过了，我是一个有强迫症的程序员。git http 方式进行一些 push 操作的时候，每一次都必须输入用户名和密码。如果单单是密码也就算了，每次都输入用户名，真的很烦耶。

解决办法就是用 ssh 的方式登陆，首先要在本地机器生成 ssh 密钥，是以邮箱来生成的，目录一般是 `~/.ssh`，把公钥内容拷贝到 github 的 ssh 密钥管理里，此时需要输入 github 密码。更改后每次用 git 访问 github 服务器端时候，就可以验证机器而不用再输入用户名和密码了。

```
ssh-keygen -t rsa -C 'xx@xx.com'
// copy 公钥 to github
// 测试是否配置成功
ssh -T git@github.com
// 如果不报错，且显示用户名，则成功了
```

PS：这个时候有同学说 push 的时候还是要输入用户名和密码，那是因为你忘记了一个最重要的事情：**修改 remote 的 url**，如果你的 url 仍然是 http 或 https 的，那么请修改为 ssh 的：

```
git remote set-url origin git@github.com:songjinzhong/yuren.space.git
// 查看一下是否修改
git remote -v
// origin  git@github.com:songjinzhong/yuren.space.git (fetch)
// origin  git@github.com:songjinzhong/yuren.space.git (push)
```

还有一个很有趣的问题，当我在同一台机器上，既可以连接到 github，又需要连接到 coding.net 的时候，git 如何得知我连接到的是哪个服务器，用哪个私钥。仍然需要对 git 进行配置，新建一个公钥，如果邮箱是一样的，可以使用同一个公钥，这点经测试是可以的。将公钥添加到 coding.net 的 ssh 配置下，在 `~/.ssh` 目录下新建一个 config 文件，如下填写：

```
# 配置github.com
Host github.com                 
  HostName github.com
  // 配置私钥所在位置
  IdentityFile ~/.ssh/id_rsa
  PreferredAuthentications publickey
  User username1

# 配置git.coding.net 
Host git.coding.net 
  HostName git.coding.net
  IdentityFile ~/.ssh/id_rsa
  PreferredAuthentications publickey
  User username2
```

分别作测试：

```
ssh -T git@github.com
// successful
ssh -T git@git.coding.net
// successful
```

### git remote

在多人协作的项目中，需要在 remote 中添加多个源，比如老大建了一个 A 项目，我在 gitlab 上 fork 了这个项目 A'，服务器上的项目就有两个，一个是老大的，一个是我的。对于我自己的项目，我 clone 下来的时候，remote 默认是添加了 origin url 的，如果是 init 方法，可能还需要手动添加。

此时，需要添加老大项目 A 的 URL 到 remote 中。

在很多情况下，我更新自己的代码后，push 到自己的服务器上的项目，并通过 gitlab 服务器把 commit 提交给老大，老大合并，这没问题。如果老大更新了代码（不一定是老大写的，有可能是其他开发人员写的），我这边需要把老大代码合并到我的 A' 项目中。

```
// 获取 leader 最新代码
git fetch leader/master
// 查看更新情况
git log leader/master --stat
// 暂不讨论 merge 和 rebase 问题
git merge leader/master
```

### git fetch

到底什么时候用 pull 或 fetch，要我说，千万别要用 pull，git 就应该把 pull 命令给删掉，因为 pull 命令就是 fetch 和 merge 命令的组合，如果从谨慎情况来考虑，肯定是 fetch 大法好。还是那句话，建议删除 git pull 命令。

### git log

`git log` 命令可以查看 log 日志，即我们所说的 commit 情况，一般常用的几个参数如下：

```
// 查看当前分支的日志
git log
// 显示文件变化状况（缩略）
git log --stat
// 显示文件变化状况（详细）自带 diff
git log -p
// 显示任意分支日志
git log origin/master
git log leader/master
```

`git log remote` 是多人合作的重点，只有观察别人修改了什么，才能最好的解决冲突，对，就是**解决冲突**。

我常用的命令就这些，而且我所经手的项目，基本都不是很复杂，看了 commit （前提是 commit message 没毛病）就完全可以搞清楚状况。

有时候会觉得 git log 命令不够形象，没有图形界面那种层次关系，而且图形界面还提供各个 remote 所在的位置，确实比较直观，但我就喜欢命令行。

### git merge OR git rebase

有时候真的不必纠结这个问题，因为这两种合并的方式，都各有好处。

git merge 默认是把当前项目分支（其实就是本地项目最新的 commit）与其它分支进行合并，比如与 origin/master：`git merge origin/master`，与 leader：`git merge leader/master`。

在这里借用[图解Git](http://marklodato.github.io/visual-git-guide/index-zh-cn.html)的几张图。

![p1](/content/images/2017/01/p1.svg)

**第一种**情况，如果要合并的分支（这里是 master）与当前分支并不存在分叉，一条直线，这个时候，只是简单的移动分支（请注意合并的顺序，是将 master 分支合并到当前分支，是不会改变 master 分支到）。这个时候最无聊了，若 Head 分支比较慢，就把 master 分支内容拿过来，如上图，如果 Head 分支本事就很快，比 master 还要靠右，啥也不做，如果两个分支内容一样，也是啥也不做。

![p2](/content/images/2017/01/p2.svg)

真正的合并应该如上图所说，两个分支，不仅不一样，还有互相都有对方没有的 commit。

如图，`b325c` 是两个分支相同的，`33104`是 other 分支，`ed489` 是 master 分支的，会把这三个分支融合成一个新分支，当然，如果有冲突的话，还要解决冲突。图中没有说清楚的一点是，最终的 commit 路线仍然是直线，会按照时间关系重新排列。无论如何，最终会有一个 commit 用来记录这次三方合并。

有时候有人会有这样的疑问：没有冲突的情况下，为什么也会生成一个空的 commit，可以删掉吗？答案是可以的，有两种方法，一种是用 `git merge --no-commit`，如果有冲突会比较麻烦，例外一种是 `git reset $pre-commit` 跳过这个 commit，虽然很抠脚。。

`git rebase` 命令和 merge 功能是一样的，只不过在处理 commit 的时候，方式不一样。前面说了 merge 是会生成一个三方合并 commit，commit 会按照时间来重新排列，不会打乱 commit 序列，而 rebase 合并方式就不同了：

![p3](/content/images/2017/01/p3.svg)

从图中可以看出，rebase 比较奇葩的会把当前分支的每一个 commit 移到序列的最前端，打乱了按时间提交的序列，显然这对于以后查找历史记录会带来麻烦。rebase 还有很多命令，比如 --onto 来限制提交。

我们项目组，目前采用的合作方式如下，我们每个模块分工互不干扰，很少出现 conflict 情况：

1. 每人在开始新工作之前，先 fetch leader 的项目，处于同一起跑线；
2. 每个人完成任务，产生新的 commit，再次 fetch leader 项目，对比别人有没有提交，若暂时没有别人提交，直接提交给 leader；
3. 若发现已经有人提交，先对比，合并后没有冲突直接提交，发现冲突，需要商量并解决冲突再提交，基本都是用 merge 方式。

### git branch

其实这个命令，我几乎没怎么使用过，首先公司里的项目，基本就一个主分支 master，同志们都很齐心，不搞分裂，所以没怎么使用。

对于 branch，我觉得是 git 另一个非常强大的功能，抛除服务器，只在本地的话，branch 可以衍生出许多分支，比如测试分支（这个最常见啦），版本分支（或许 git tag 更好用些）。不过像 github 的 gh-pages 和 coding.net 的 coding-pages 分支，虽然脱离了版本控制的范畴，却也不失为一种很有意义的用法。

`git tag`，没用过，想用。

### git show/diff/log

这三个命令都可以用来做对比，但使用的方法却大不相同。

比如 `git show $commitid` 表示那个 commit 做了哪些新改变，当然这个可以被 `git log -p`所掩盖，表示所有 commit 做了哪些改变，而 `git diff` 默认是缓存区的内容与 open file 的内容做对比，当然也可以`git diff $id1 $id2` 比较两个 commit 之间的不同，所有要根据自己的需求来判断到底哪个更合适。

当然，貌似还有更多的用法，我就没用过，就不一一探讨了。

## 一些干货

上面的内容，没有干货，只是简单说明了一下自己的使用经历。

其实，对于 git，如果用服务器的话，必须要了解几个仓库。你从 leader 那里 fork 了项目 A 为 A'，这个时候就有了两个仓库，而且这两个仓库是互相独立的，一般的 git 服务器像 github 或 gitlab 都有自带的 pull request 命令，允许我将 A' 的 commit 提交给 A。

通过 git clone 命令可以将服务器上的仓库拉取到本地，这是第三个仓库，而且我们提交的 commit 一般都会先提交到本地仓库。git push 命令可以将本地仓库推到服务器，而且本地的分支都会有一个 remote url 用来作为 pull push 的源头。我也可以对 A 仓库进行 push，但会因为没有权限导致 push 失败。

不过呢，即使没有服务器的 pull request 请求，也完全是可以的，leader 需要有每一个 fork 用户的 remote url 即可：

1. 这时候，我会对 leader 喊一下，“我的代码更新了，老大，更新一下”；
2. 老大不耐烦的打开 git，并把我的代码 git fetch 到他本地；
3. 老大解决下冲突，把代码合并到他的分支中，并喊 “好了，代码更新好了”；
4. 我 fetch leader 的新代码，覆盖我本地代码。

对于仓库，了解这些就够了，而比较让人费解的是每个仓库的文件目录，请看下图（来源于万能的互联网）：

![p4](/content/images/2017/01/p4.svg)

这里有三个目录，分别是 History，Stage，Working Director：

1. History 表示提交的历史记录，所有的 commit 都会被保存；
2. Stage 表示暂存区，作为 open file 与 History 的中间人；
3. Working Director 表示我们能看到的，即我们打开的文件。

如果从存储的位置来看，History 和 stage 都存在 .git 文件夹中，而 working director 就是剩下的工作区文件。

从图中也可以看出，我们常用的 add、commit、reset、checkout 命令，其实就是对这三个文件目录进行的修改，图已经说的很清楚了，仔细看图吧。

也可以直接跳，比如 `git reset HEAD` 直接从 History 调到 working director，`git commit -a` 可以省去 add 命令。

那么，这样划分，有什么合理性吗？

### 找回那个被你“弄丢”的文件

都说 git 是版本管理工具，如何找回那个丢失很久的文件？

事情是这样的，前天我修改了 a.js 文件，效果很好，并提交了 commit A，昨天我又修改了 a.js 和 b.js 文件，并提交了 commit B，今天我再次修改了 a.js 和 b.js 文件，提交 commit C。问题来了，今天下班前测试，发现昨天和今天修改的 a.js 文件对整个系统的效益不大，组织上准备还是采用前天的那个版本，准备回滚，有一个问题，因为昨天和今天也修改了 b.js 文件，而这个文件是不允许回滚的。想了想，如果可以拿回前天的那个 a.js 文件，并用它替换掉今天的 a.js 就行啦。

基本的步骤就是：

1. `git branch test && git checkout test` 新建一个分支用来回滚，程序员嘛，以防万一，出现错误直接 delete 分支，不会对主分支造成影响；
2. `git reset A`，回滚到前天的 status，这个时候缓存区里与 working 目录文件有差异了，但 working 目录文件并没有改变；
3. `git checkout a.js`，通过 checkout 命令，将 a.js 回滚（b.js 不变），working 目录文件改变；
4. `git reset C`，回到今天的文件状态，此时缓存区的内容又和 working 目录保持一致，除了 a.js 文件，因为它已经改变了；
5. `git commit -a -m "message here"`，将找回的 a.js 文件提交新 commit；
6. `git checkout master && git merge test && git branch -d test`，切换分支，合并分支，删除分支，一气呵成。

## 总结

我用了 git 这么久，干货全在这了，有些关于 git 的东西我非常想去弄懂，但苦于没有找到合理的借口，比如到底 .git 文件夹有哪些东西，都有什么用。哪天之后，当我有了需求，我就会去查资料学习了。共勉！