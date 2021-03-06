/**
 * TODO: 对下面的校验规则需要整理
 */

import { Request, Response, NextFunction } from 'express'
import { query, body } from 'express-validator'
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
    query('title').optional().escape(),
    query('desc').optional().escape(),
    query('created_by').optional(),
    query('created_at').optional(),
    query('updated_at').optional(),
    query('updated_by').optional(),
    query('status')
      .optional({ checkFalsy: true, nullable: true })
      .isIn([1, 2])
      .withMessage('status 值有误')
      .toInt(),
    query('sort').optional().isIn(sortFileds).withMessage(`只能对${sortFileds}排序`),
  ])(req, res, next)
}

// 新增校验
export const validatorAddOrRepacleBody = (req: Request, res: Response, next: NextFunction) => {
  return validate([
    body('title')
      .trim()
      .notEmpty()
      .withMessage('角色名称不能为空')
      .isString()
      .withMessage('角色名称是一个字符串')
      .isLength({ min: 2, max: 10 })
      .withMessage('角色名称长度在2-10位')
      .escape(),

    body('desc')
      .optional({ checkFalsy: true, nullable: true })
      .trim()
      .default('')
      .isString()
      .withMessage('描述是一个字符串')
      .isLength({ max: 40 })
      .withMessage('描述字段最多40个字符')
      .escape(),

    body('status')
      .optional({ checkFalsy: true, nullable: true })
      .default(1)
      .isIn([0, 1])
      .withMessage('角色状态只能是 0 | 1'),

    body('authority_ids')
      .optional({ checkFalsy: true, nullable: true })
      .default([])
      .isArray()
      .withMessage('权限资源是一个数组'),
    body('authority_ids.*').isMongoId().withMessage('权限资源中有非法ID'),
    // body('system').notEmpty().withMessage('需要选择一个系统').isMongoId().withMessage('非法的值'),
  ])(req, res, next)
}

// patch
export const validatorUpdateBody = (req: Request, res: Response, next: NextFunction) => {
  return validate([
    body('title')
      .optional({ checkFalsy: true, nullable: true })
      .trim()
      .notEmpty()
      .withMessage('名称不能为空')
      .isString()
      .withMessage('名称是一个字符串')
      .isLength({ min: 2, max: 10 })
      .withMessage('名称长度在2-10位')
      .escape(),

    body('desc')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('描述是一个字符串')
      .isLength({ max: 40 })
      .withMessage('描述字段最多40个字符')
      .escape(),
    body('status')
      .optional({ checkFalsy: true, nullable: true })
      .default(1)
      .isIn([0, 1])
      .withMessage('用户状态只能是 0 | 1'),

    body('authority_ids')
      .optional({ checkFalsy: true, nullable: true })
      .default([])
      .isArray()
      .withMessage('权限资源是一个数组'),
    body('authority_ids.*').isMongoId().withMessage('权限资源中有非法ID'),
  ])(req, res, next)
}
