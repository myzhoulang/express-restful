import { check } from 'express-validator'
const validatorLogin = () => {
  return [
    check('user_name').trim().not().isEmpty().escape(),
    check('password').trim().not().isEmpty().withMessage('密码不能为空'),
  ]
}

export { validatorLogin }
