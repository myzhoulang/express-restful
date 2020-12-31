/**
 * TODO: 对下面的校验规则需要整理
 */

import { Request, Response, NextFunction } from 'express'
import { query } from 'express-validator'
import { validate, listBaseRules } from '../../validator'

const sortFileds = ['name', 'email', 'created_at', 'created_by', 'updated_by', 'updated_at']

// 列表的参数校验
export const validatorListParams = (req: Request, res: Response, next: NextFunction) => {
  return validate([
    ...listBaseRules,
    /**
     * TODO:
     *  nullable ?
     *  isEmpty 必须是空
     *  notEmpty 不能为空
     *  optional 代表可选 传入的参数可以有这个字段，也可以没有这个字段
     *    checkFalsy: 默认为 false 将会对 值进行 falsy 校验， 如果属于 falsy 将会报错 反之 不对对值做校验
     *    falsy 包括 "", 0, false, null
     */
    query('id').optional(),
    query('action').optional(),
    query('module').optional(),
    query('user_id').optional(),
    query('user_name').optional(),
    query('request_url').optional(),
    query('request_ip').optional(),
    query('request_method').optional(),
    query('request_time').optional(),
    query('created_at').optional(),
    query('sort').optional().isIn(sortFileds).withMessage(`只能对${sortFileds}排序`),
  ])(req, res, next)
}
