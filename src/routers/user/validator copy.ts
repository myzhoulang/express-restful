/**
 * TODO: 对下面的校验规则需要整理
 */

import { Request, Response, NextFunction } from 'express'
import { Schema } from 'express-validator'
import { checkSchemaValidator, isOptional } from '../../validator'

// 校验规则
export const validRules = (method: HttpMethods = 'POST') => {
  const optional = isOptional(method)
  const rules: Schema = {
    name: {
      in: ['body'],
      ...optional,
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
      ...optional,
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
      ...optional,
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
      ...optional,
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
      optional: optional.optional,
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
      optional: optional.optional,
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
      optional: optional.optional,
      isString: {
        errorMessage: '用户头像是一个字符串',
      },
      // .isURL()
      // .withMessage('用户头像是一个url'),
      trim: true,
    },
    motto: {
      in: ['body'],
      optional: optional.optional,
      isString: {
        errorMessage: '用户头像是一个字符串',
      },
      trim: true,
    },
    gender: {
      in: ['body'],
      optional: optional.optional,
      isIn: {
        options: [0, 1],
        errorMessage: '值只能是 0 和 1 ',
      },
      toInt: true,
    },
    age: {
      in: ['body'],
      optional: optional.optional,
      isInt: {
        options: { min: 1, max: 150 },
        errorMessage: '值区间在 1-200 之间',
      },
    },
    status: {
      in: ['body'],
      isIn: {
        options: [1, 2],
        errorMessage: '值只能是 1和2 ',
      },
    },
    tags: {
      in: ['body'],
      optional: optional.optional,
      isArray: {
        options: { min: 0, max: 3 },
        errorMessage: '值一个0-3位的数组',
      },
    },
    desc: {
      in: ['body'],
      optional: optional.optional,
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
      optional: optional.optional,
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
      optional: optional.optional,
      isArray: {
        options: { min: 0, max: 3 },
        errorMessage: '值一个0-3位的数组',
      },
    },
    'roles.*': {
      in: ['body'],
      optional: optional.optional,
      isMongoId: {
        errorMessage: '数组中有非法ID',
      },
    },
  }

  return rules
}

// 新增校验 post 或 put
export const postAndPutValidator = (req: Request, res: Response, next: NextFunction) => {
  const rules = validRules()
  return checkSchemaValidator(rules)(req, res, next)
}

// patch
export const patchValidator = (req: Request, res: Response, next: NextFunction) => {
  const rules = validRules('PATCH')
  return checkSchemaValidator(rules)(req, res, next)
}
