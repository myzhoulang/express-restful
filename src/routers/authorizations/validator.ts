import { body, ValidationChain } from 'express-validator'

const validatorLogin: () => ValidationChain[] = () => {
  return [
    body('email').trim().not().isEmpty().escape(),
    body('password').trim().notEmpty().withMessage('密码不能为空'),
  ]
}

export { validatorLogin }
