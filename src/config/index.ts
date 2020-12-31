import { CorsOptions } from 'cors'

// 白名单配置
export interface Whitelist {
  path?: Array<string>
  body?: Array<string>
}

// 程序配置项
export interface Conf {
  cors?: CorsOptions
  prefix?: string
  white?: Whitelist
  // bcrypt 加密等级
  saltRounds: number | string
}

export interface Http {
  port: number
}

export interface Https extends Http {
  key: File
  cert: File
}

const prefix = ''

const config: Conf = {
  // cors 配置
  cors: {
    credentials: true,
    origin: 'http://127.0.0.1:8080',
  },
  // api 前缀
  prefix: prefix,
  // 白名单
  white: {
    // 路由白名单
    path: [`${prefix}/login`],

    // 日志记录 body 体过滤名单
    body: ['password'],
  },
  saltRounds: 10,
}

export default config
