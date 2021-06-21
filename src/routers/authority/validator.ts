/**
 * TODO: 对下面的校验规则需要整理
 */

import { Request, Response, NextFunction } from 'express'
import { Schema } from 'express-validator'
import { isOptional, optional, checkSchemaValidator } from '../../validator'

// 校验规则
export const validRules = (method: HttpMethods = 'POST') => {
  // patch 可选
  const optionalOrNotEmpty = isOptional(method)
  const rules: Schema = {
    title: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '值是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 2, max: 10 },
        errorMessage: '值长度在2-10位',
      },
      escape: true,
    },
    desc: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '值是一个字符串',
      },
      trim: true,
      isLength: {
        options: { min: 10, max: 40 },
        errorMessage: '值长度在10-40位',
      },
      default: {
        options: '',
      },
      escape: true,
    },
    code: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isString: {
        errorMessage: '值是一个字符串',
      },
      isLength: {
        options: { min: 2, max: 20 },
        errorMessage: '值长度在2-20位',
      },
    },
    parent_id: {
      in: ['body'],
      ...optionalOrNotEmpty,
      isMongoId: {
        errorMessage: '值是非法的ID',
      },
    },
    status: {
      in: ['body'],
      optional,
      isIn: {
        options: [0, 1],
        errorMessage: '值只能是 0, 1',
      },
      default: {
        options: 3,
      },
    },
    icon: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '值是一个字符串',
      },
      escape: true,
    },
    type: {
      in: ['body'],
      optional,
      isIn: {
        options: [1, 2, 3],
        errorMessage: '值只能是 1, 2, 3 ',
      },
      default: {
        options: 3,
      },
    },
    url: {
      in: ['body'],
      optional,
      isString: {
        errorMessage: '值是一个字符串',
      },
      escape: true,
    },
  }
  return rules
}

// 参数校验
export const validator = (req: Request, res: Response, next: NextFunction) => {
  const rules = validRules(req.method as HttpMethods)
  return checkSchemaValidator(rules)(req, res, next)
}
