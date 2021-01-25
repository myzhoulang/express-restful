import { body } from 'express-validator'
const validatorLogin = () => {
  return [
    body('name').trim().not().isEmpty().escape(),
    body('password').trim().notEmpty().withMessage('密码不能为空'),
  ]
}

export { validatorLogin }
