/**
 * TODO: 对下面的校验规则需要整理
 */

import { Request, Response, NextFunction } from 'express'
import { query, body } from 'express-validator'
import { validate, listBaseRules } from '../../validator'
import { type } from './typings'

const sortFileds = ['created_at', 'created_by', 'updated_by', 'updated_at']

// 列表的参数校验
export const validatorListParams = (req: Request, res: Response, next: NextFunction) => {
  return validate([
    ...listBaseRules,
    /**
     * TODO:
     *  nullable ?
     *  isEmpty 必须是空
     *  notEmpty 不能为空
     *  optional 代表可选 传入的参数可以有这个字段，也可以没有这个字段 默认会做严格判断
     *    checkFalsy: 默认为 false 将会对 值进行 falsy 校验，
     *        如果属于 falsy 将会报错 反之 不对对值做校验 直接转换成数据库中的类型存入
     *        falsy 包括 "", 0, false, null
     *
     *    nullable: 值可以为 null
     */
    query('title').optional(),
    query('desc').optional(),
    query('code').optional(),
    query('parent_id').optional(),
    query('created_at').optional(),
    query('created_by').optional(),
    query('created_by_name').optional(),
    query('updated_at').optional(),
    query('updated_by').optional(),
    query('updated_by_name').optional(),
    query('type').optional().isIn([1, 2, 3]).withMessage('type 值有误').toInt(),
    query('status').optional().isIn([1, 2]).withMessage('status 值有误').toInt(),
    query('sort').optional().isIn(sortFileds).withMessage(`只能对${sortFileds}排序`),
  ])(req, res, next)
}

// 新增校验
export const validatorAddOrRepacleBody = (req: Request, res: Response, next: NextFunction) => {
  return validate([
    body('title')
      .trim()
      .notEmpty()
      .withMessage('权限名称不能为空')
      .isString()
      .withMessage('权限名称是一个字符串')
      .isLength({ min: 2, max: 10 })
      .withMessage('权限名称长度在2-10位')
      .escape(),

    body('desc')
      .optional()
      .trim()
      .default('')
      .isString()
      .withMessage('描述是一个字符串')
      .isLength({ max: 40 })
      .withMessage('描述字段最多40个字符')
      .escape(),

    body('code')
      .trim()
      .isString()
      .withMessage('权限标识符是一个字符串')
      .notEmpty()
      .withMessage('权限标识符不能为空')
      .isLength({ min: 2, max: 20 })
      .withMessage('权限标识符长度在2-20位')
      .escape(),

    // TODO:校验当前 ID 是否在数据库中存在
    body('parent_id')
      .optional({ nullable: true })
      .default(null)
      .isMongoId()
      .withMessage('非法的父级ID'),

    body('status').optional().default(1).isIn([0, 1]).withMessage('资源状态只能是 0 | 1'),

    body('icon').optional().isString().escape(),
    body('type').default(3).toInt().isIn([1, 2, 3]).withMessage('类型是目录/菜单/按钮中的一种'),
    body('url').optional().isString().withMessage('url 是一个字符串').escape(),
    // body('system').notEmpty().withMessage('需要选择一个系统').isMongoId().withMessage('非法的值'),
  ])(req, res, next)
}

// patch
export const validatorUpdateBody = (req: Request, res: Response, next: NextFunction) => {
  // optional
  // 可以没有这个字段
  // 如果有这个字段 checkFalsy=false 将会进入下一个校验
  return validate([
    body('title')
      .optional()
      .isString()
      .withMessage('名称是一个字符串')
      .trim()
      .notEmpty()
      .withMessage('名称不能为空')
      .isLength({ min: 2, max: 10 })
      .withMessage('名称长度在2-10位')
      .escape(),

    body('desc')
      .trim()
      .optional()
      .default('')
      .isString()
      .withMessage('描述是一个字符串')
      .isLength({ max: 40 })
      .withMessage('描述字段最多40个字符')
      .escape(),
    body('status').optional().default(1).isIn([0, 1]).withMessage('用户状态只能是 0 | 1'),
    body('authority_ids').optional().default([]).isArray().withMessage('权限资源是一个数组'),
    body('authority_ids.*').isMongoId().withMessage('权限资源中有非法ID'),
  ])(req, res, next)
}
