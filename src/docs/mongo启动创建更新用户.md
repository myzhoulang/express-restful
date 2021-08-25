# Mongodb 入门

## Mongodb 简介

> 基于`JSON`的面向文档的`NoSQL`数据库，具有以下特点：
>
> 1. 建模是可选的，即无需提前设计好数据的存储结构，可以动态创建字段
> 2. 一种基于`JSON`扩展的`BSON`数据模型
> 3. 数据文档具有伸缩性，每个文档可以具有不同数量的字段。每个文档的大小和内容可以互不相同。
> 4. 每一个文档中默认都有一个`_id`字段，用于文档在集合中的唯一标识。默认的`_id`字段由 `时间戳 + 主机名散列值 + pid + 自增计数器` 组成来保证唯一性。

## 安装启动数据库

### 使用 Docker 启动 Mongodb

```shell
# 拉取镜像
docker pull mongo
# -d 后台运行容器
# --name 指定容器名称
# -v 挂载数据目录
# -p 指定启动 mongo 服务端口
docker run -d --name mongodb -p 27017:27017 \
 -v /Users/apple/data/mongo/conf/mongod.conf:/etc/mongod.conf \
 -v /Users/apple/data/mongo/logs:/data/log \
 -v /Users/apple/data/mongo/data:/data/db mongo --config /etc/mongod.conf
```

### 使用`mongod`名利启动数据库

```shell
## 方式一 将一系列参数放在命令行中， 不方便管理
mongod --port 27017 --dbpath /var/lib/mongodb/mongodb --logpath /var/lib/mongodb/log.log

## 方式二 指定配置文件启动 方便管理
mongod  --config /var/lib/mongodb/mongo.conf
```

## 链接数据库

### 使用`mongo`命令行链接数据库

```shell
mongo 127.0.0.1:27017/auth -u admin -p 123456
# 先使用 `mongo` 命令进入 `mongo shell`, 执行 `use admin` 使用 `admin`数据库, 然后使用 db.auth进行验证

mongo
use admin
db.auth(用户名,密码)

```

### 使用 gui 管理工具或程序中链接数据库， 链接地址形式如下：

```shell
 mongodb://auth:123456@47.100.111.243:27017/auth
```

> 开启访问控制前，需要在`admin`数据库中有一个具有`userAdmin`或`userAdminAnyDatabase`角色的用户，这个用户用来管理用户和角色，例如：创建用户、授予或者撤销用户的角色、创建或者修改角色。

```js
db.createUser({
  user: 'root',
  pwd: '123456',
  roles: [
    {
      role: 'userAdminAnyDatabase',
      db: 'admin',
    },
    {
      role: 'readWriteAnyDatabase',
      db: 'admin',
    },
  ],
})
```

> 使用 api `db.adminCommand({shutdown: 1})` 关闭`mongo`实例
> 使用 `docker`启动的`mongo`,也可以使用 `docker stop <容器ID>`来停止容器
> 使用配置文件启动`mongo`的，在配置文件中添加
> `security: authorization: enabled` 选项

- 创建普通用户

```javascript
$ db.createUser({
    user: 'admin',
    pwd: '123456',
    roles: [
      {role: 'userAdmin', db: 'auth'},
      {role: 'dbOwner', db: 'auth'},
      {role: 'readWrite', db: 'auth'}
    ]
  })
```

- 更新用户

```js
db.updateUser('auth', {
  user: 'admin',
  pwd: '0987654321',
  roles: [
    { role: 'userAdmin', db: 'auth' },
    { role: 'dbOwner', db: 'auth' },
    { role: 'readWrite', db: 'auth' },
  ],
})
```

docker run --name redis -p 6379:6379 -v /redis:/data -d redis
