import { Request, Response, NextFunction } from 'express'
import { Schema } from 'express-validator'
import { isOptional, optional } from '../../validator'
import { checkSchema } from '../../validator/checkSchema'

// 校验规则
export const createRules = (method: HttpMethods = 'POST'): Schema => {
  // 可选或必填
  // 在请求方法 patch 下是可选
  // 在请求方法 POST 或 PUT 下必填
  const optionalOrNotEmpty = isOptional(method)

  return {
    name: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '姓名必须是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 2, max: 10 },
        errorMessage: '姓名长度在2-10',
      },
      escape: true,
    },
    phone: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '手机号必须是一个字符串',
      },
      trim: true,
      isMobilePhone: {
        options: ['zh-CN'],
        errorMessage: '手机号格式有误',
      },
      escape: true,
    },
    email: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '邮箱必须是一个字符串',
      },
      trim: true,
      isEmail: {
        errorMessage: '邮箱格式有误',
      },
      escape: true,
    },
    password: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '账号密码是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 6, max: 18 },
        errorMessage: '账号密码最小6位，最大18位',
      },
      escape: true,
    },
    nick_name: {
      in: ['body'],
      optional: optional,
      isString: {
        errorMessage: '用户昵称是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 2, max: 10 },
        errorMessage: '用户昵称在2-10位',
      },
      escape: true,
    },
    job: {
      in: ['body'],
      optional: optional,
      isString: {
        errorMessage: '用户工作是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 2, max: 10 },
        errorMessage: '用户工作在2-10位',
      },
      escape: true,
    },
    avatar: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '用户头像是一个字符串',
      },
      trim: true,
    },
    motto: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '用户头像是一个字符串',
      },
      trim: true,
    },
    gender: {
      in: ['body'],
      optional,
      isIn: {
        options: [0, 1],
        errorMessage: '值只能是 0 和 1 ',
      },
      toInt: true,
    },
    age: {
      in: ['body'],
      optional,
      isInt: {
        options: { min: 1, max: 150 },
        errorMessage: '值区间在 1-200 之间',
      },
    },
    status: {
      in: ['body'],
      optional,
      isIn: {
        options: [1, 2],
        errorMessage: '值只能是 1和2 ',
      },
      default: {
        options: 1,
      },
    },
    tags: {
      in: ['body'],
      optional,
      isArray: {
        options: { min: 0, max: 3 },
        errorMessage: '值一个0-3位的数组',
      },
    },
    desc: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '值是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 5, max: 40 },
        errorMessage: '长度位5-40',
      },
      escape: true,
    },
    team: {
      in: ['body'],
      optional,
      isArray: {
        options: { min: 0, max: 3 },
        errorMessage: '值一个0-3位的数组',
      },
    },
    'team.*': {
      in: ['body'],
      isMongoId: {
        errorMessage: '数组总有非法的ID',
      },
    },
    roles: {
      in: ['body'],
      optional,
      isArray: {
        options: { min: 0, max: 3 },
        errorMessage: '值一个0-3位的数组',
      },
    },
    'roles.*': {
      in: ['body'],
      optional,
      isMongoId: {
        errorMessage: '数组中有非法ID',
      },
    },
  }
}

// 参数校验
export const validator = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const method = req.method as HttpMethods
  return checkSchema(createRules, method)(req, res, next)
}
