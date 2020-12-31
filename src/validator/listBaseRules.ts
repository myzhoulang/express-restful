import { query } from 'express-validator'
const listBaseRules = [
  query('id').optional({ checkFalsy: true, nullable: true }).isMongoId().withMessage('非法ID'),
  query('page').default(1).toInt().isInt().withMessage('page 需要一个大于0的整数'),
  query('size').default(20).toInt().isInt().withMessage('size 需要一个大于0的整数'),
  query('direction')
    .default('DESC')
    .isIn(['DESC', 'ASC'])
    .withMessage('排序方向是 只能是 DESC 或 ASC')
    .customSanitizer((value: 'DESC' | 'ASC') => ({ DESC: -1, ASC: 1 }[value])),
]

export default listBaseRules
