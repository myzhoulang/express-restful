# express-restful

使用 typescript + express + mongoose 实现 restful api 项目

## Overview

使用`TypeScript`编写的基于`express`、`Mongodb`、`mongoose`、`jwt`、`Sentry`等框架或技术的一套`node api`服务。使用`eslint`做代码规范，使用`prettier`做自动代码格式化。

## 需求功能

- [x] 基于`jwt`做登录校验
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
