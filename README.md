# express-restful

使用 typescript + express + mongoose 实现 restful api 项目

## Overview

使用`TypeScript`编写的基于`express`、`Mongodb`、`mongoose`、`jwt`、`Sentry`、`redis`等框架或技术的一套`node api`权限管理服务。使用`eslint`做代码规范，使用`prettier`做自动代码格式化。

## 需求功能

- [x] 基于`jwt`做登录校验
- [ ] 每一个接口的权限控制
- [x] 使用`Sentry`监控代码运行错误
- [ ] 日志收集
- [ ] 图片上传到 OSS
- [ ] 使用`Docker`构建打包
- [ ] 代码提交规范

## 项目下载和运行

- 拉取项目代码

```shell
  git clone https://github.com/myzhoulang/express-restful.git
  cd express-restful
```

- 安装依赖

```shell
npm i
```

- 开发模式运行

```shell
npm run dev
```

- `TypeScript` 编译

```shell
npm run build
```

- `TypeScript` 编译并且运行

```shell
npm run build:start
```

- eslint 检测和修复

```shell
npm run test:lint:fix
```

## 环境

## 使用到的包
* [express](https://www.npmjs.com/package/express)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [express-validator](https://www.npmjs.com/package/express-validator)
* [express-jwt](https://www.npmjs.com/package/express-jwt)
* [helmet](https://www.npmjs.com/package/helmet)
* [cors](https://www.npmjs.com/package/cors)
* [redis](https://www.npmjs.com/package/redis)
## 权限控制

1. 用户请求某一个资源
2. 通过 url 查出这个资源的 code
3. 判断当前用户是否有这个 code 的权限