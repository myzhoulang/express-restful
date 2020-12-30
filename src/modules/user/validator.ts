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
    query('name').optional(),
    query('email')
      .optional({ checkFalsy: true, nullable: true })
      .isEmail()
      .withMessage('非法的email'),
    query('phone')
      .optional({ checkFalsy: true, nullable: true })
      .isMobilePhone('zh-CN')
      .withMessage('非法的手机号'),
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
    body('name')
      .trim()
      .notEmpty()
      .withMessage('姓名不能为空')
      .isString()
      .withMessage('姓名是一个字符串')
      .isLength({ min: 2, max: 10 })
      .withMessage('姓名长度在2-10位'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('手机号不能为空')
      .isMobilePhone('zh-CN')
      .withMessage('手机号格式有误'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('邮箱不能为空')
      .isEmail()
      .withMessage('邮箱格式有误'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('账号密码不能为空')
      .isString()
      .withMessage('账号密码是一个字符串')
      .isLength({ min: 6, max: 18 })
      .withMessage('账号密码最小6位，最大18位'),
    body('nick_name')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('用户昵称是一个字符串')
      .isLength({ max: 10 })
      .withMessage('用户昵称在2-10位'),
    body('job')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('用户职称是一个字符串')
      .isLength({ max: 10 })
      .withMessage('用户职称在2-10位'),
    // body('department')
    //   .optional({ checkFalsy: true, nullable: true })
    //   .default('')
    //   .isString()
    //   .withMessage('用户部门是一个字符串')
    //   .isLength({ min: 2, max: 10 })
    //   .withMessage('用户职称在2-10位'),
    body('avatar')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      /**
       * FIXME:
       *  修改成 path 形式 并且以固定的后缀结尾（.png,.gif,.jpg, .jpeg, .webp） /a/.jpg
       **/

      .isURL()
      .withMessage('用户头像是一个url'),
    body('motto')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('用户座右铭是一个字符串')
      .isLength({ max: 20 })
      .withMessage('座右铭最多20个字符'),
    body('gender')
      .optional({ checkFalsy: true, nullable: true })
      .default(1)
      .isIn([1, 2])
      .withMessage('性别参数只能是 0 | 1')
      .toInt(),

    body('age')
      .optional({ checkFalsy: true, nullable: true })
      .default(null)
      .isInt()
      .custom((value) => value > 0 && value <= 200)
      .withMessage('年龄区间在 1-200 之间'),
    body('status')
      .optional({ checkFalsy: true, nullable: true })
      .default(1)
      .isIn([0, 1])
      .withMessage('用户状态只能是 0 | 1'),
    body('tags')
      .optional({ checkFalsy: true, nullable: true })
      .default([])
      .isArray()
      .withMessage('标签是一个数组'),
    body('desc')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('描述是一个字符串')
      .isLength({ max: 40 })
      .withMessage('描述字段最多40个字符'),

    body('team')
      .optional({ checkFalsy: true, nullable: true })
      .default([])
      .isArray()
      .withMessage('团队是一个数组'),

    body('team.*').isMongoId().withMessage('团队有非法ID'),
    body('roles')
      .optional({ checkFalsy: true, nullable: true })
      .default([])
      .isArray()
      .withMessage('角色是一个数组'),
    body('roles.*').isMongoId().withMessage('角色有非法ID'),
    // body('system').notEmpty().withMessage('需要选择一个系统').isMongoId().withMessage('非法的值'),
  ])(req, res, next)
}

// patch
export const validatorUpdateBody = (req: Request, res: Response, next: NextFunction) => {
  return validate([
    body('name')
      .trim()
      .optional({ checkFalsy: false, nullable: true })
      .isString()
      .withMessage('姓名是一个字符串')
      .isLength({ min: 2, max: 10 })
      .withMessage('姓名长度在2-10位'),
    body('phone')
      .trim()
      .optional({ checkFalsy: false, nullable: true })
      .isMobilePhone('zh-CN')
      .withMessage('手机号格式有误'),
    body('email')
      .trim()
      .optional({ checkFalsy: false, nullable: true })
      .isEmail()
      .withMessage('邮箱格式有误'),
    body('password')
      .trim()
      .optional({ checkFalsy: false, nullable: true })
      .isString()
      .withMessage('账号密码是一个字符串')
      .isLength({ min: 6, max: 18 })
      .withMessage('账号密码最小6位，最大18位'),
    body('nick_name')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('用户昵称是一个字符串')
      .isLength({ max: 10 })
      .withMessage('用户昵称在2-10位'),
    body('job')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('用户职称是一个字符串')
      .isLength({ max: 10 })
      .withMessage('用户职称在2-10位'),
    // body('department')
    //   .optional({ checkFalsy: true, nullable: true })
    //   .default('')
    //   .isString()
    //   .withMessage('用户部门是一个字符串')
    //   .isLength({ min: 2, max: 10 })
    //   .withMessage('用户职称在2-10位'),
    body('avatar')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      /**
       * FIXME:
       *  修改成 path 形式 并且以固定的后缀结尾（.png,.gif,.jpg, .jpeg, .webp） /a/.jpg
       **/

      .isURL()
      .withMessage('用户头像是一个url'),
    body('motto')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('用户座右铭是一个字符串')
      .isLength({ max: 20 })
      .withMessage('座右铭最多20个字符'),
    body('gender')
      .optional({ checkFalsy: true, nullable: true })
      .default(1)
      .isIn([1, 2])
      .withMessage('性别参数只能是 0 | 1')
      .toInt(),

    body('age')
      .optional({ checkFalsy: true, nullable: true })
      .default(null)
      .isInt()
      .custom((value) => value > 0 && value <= 200)
      .withMessage('年龄区间在 1-200 之间'),
    body('status')
      .optional({ checkFalsy: true, nullable: true })
      .default(1)
      .isIn([0, 1])
      .withMessage('用户状态只能是 0 | 1'),
    // body('tags')
    //   .optional({ checkFalsy: true, nullable: true })
    //   .default([])
    //   .isArray()
    //   .withMessage('标签是一个数组'),
    body('desc')
      .trim()
      .optional({ checkFalsy: true, nullable: true })
      .default('')
      .isString()
      .withMessage('描述是一个字符串')
      .isLength({ max: 40 })
      .withMessage('描述字段最多40个字符'),

    /**
     * TODO:
     * 判断 team中的id 是否在团队中出现
     */
    // body('team')
    //   .optional({ checkFalsy: true, nullable: true })
    //   .default([])
    //   .isArray()
    //   .withMessage('团队是一个数组'),

    // body('team.*').isMongoId().withMessage('团队有非法ID'),

    body('roles')
      .optional({ checkFalsy: true, nullable: true })
      .default([])
      .isArray()
      .withMessage('角色是一个数组'),
    body('roles.*').isMongoId().withMessage('角色有非法ID'),
    // body('system')
    //   .optional({ checkFalsy: false, nullable: true })
    //   .isMongoId()
    //   .withMessage('非法的值'),
  ])(req, res, next)
}
