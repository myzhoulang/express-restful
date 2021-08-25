# mongodb 认证和授权

## 认证

> 默认启动`mongo`实例是没有认证机制，需要我们手动开启认证来保证数据库安全。开启访问控制前，需要在`admin`数据库中有一个具有`userAdmin`或`userAdminAnyDatabase`角色的用户，这个用户用来管理用户和角色，例如：创建用户、授予或者撤销用户的角色、创建或者修改角色。

### 创建用户

```js
// 创建一个管理用户和角色的用户
db.createUser({
  user: 'root',
  pwd: '123456',
  roles: [
    {
      role: 'userAdminAnyDatabase',
      db: 'admin',
    },
  ],
})
```

```js
// 创建普通用户, 指定用户所拥有的数据以及对应的角色
db.createUser({
  user: 'admin',
  pwd: '123456',
  roles: [
    { role: 'userAdmin', db: 'auth' },
    { role: 'dbOwner', db: 'auth' },
    { role: 'readWrite', db: 'auth' },
  ],
})
```

### 开启认证

> 先停止之前启动的 mong, 然后只需要在配置文件中指定对应的配置项既可

```yaml
systemLog:
  destination: file
  path: '/data/log/mongod.log'
  logAppend: true
storage:
  dbPath: '/data/db'
  journal:
    enabled: true
net:
  port: 27017
# 开启认证
security:
  authorization: enabled
```

### 启动 mongo 实例

#### 使用 Docker 启动 Mongodb

```shell
docker run -d --name mongodb -p 27017:27017 \
 -v /Users/apple/data/mongo/conf/mongod.conf:/etc/mongod.conf \
 -v /Users/apple/data/mongo/logs:/data/log \
 -v /Users/apple/data/mongo/data:/data/db mongo --config /etc/mongod.conf
```

#### 在终端中使用命令行`mongod`启动数据库

```shell
## 方式一 将一系列参数放在命令行中， 不方便管理
mongod --port 27017 --dbpath /Users/apple/data/mongo/data --logpath /Users/apple/data/mongo/logs/log.log

## 方式二 指定配置文件启动 方便管理
mongod  --config /Users/apple/data/mongo/conf/mongod.conf
```

### 链接数据库

#### 使用`mongo`命令行链接数据库

```shell
# 1. 直接在 mongo 后面加上选项
mongo 127.0.0.1:27017/auth -u admin -p 123456

# 2. 也可以先使用 `mongo` 命令进入 `mongo shell`,
# 执行 `use admin` 使用 `admin`数据库,
# 然后使用 db.auth进行验证
# 使用哪一个数据去校验 登录用户 取决于在哪一个数据库中建立的用户
mongo
use admin
db.auth(用户名,密码)

```

#### 使用 GUI 管理工具或程序中链接数据库， 链接地址形式如下：

```shell
 mongodb://auth:123456@47.100.111.243:27017/auth
```

## 授权

> 授权指对一个用户指定他有什么可以操作，什么不可以操作。由 权限 + 角色 + 用户来完成一个授权操作。
> 权限指 对一个资源(一个数据库，一个集合，一个集群等)能做什么动作(查找、更新、删除等等)。
> 角色是指一堆权限组成的集合，方便管理对不同用户授予相同权限的操作。
> 权限不是直接赋予给用户，而是先赋予给角色，然后再赋予给用户。 在 `mongo` 中有`内置角色`和`自定义角`色两种。

### 内置角色

### 自定义角色
