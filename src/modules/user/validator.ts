import { check } from 'express-validator'
const validatorLogin = () => {
  return [
    check('name').trim().not().isEmpty().escape(),
    check('phone').trim().not().isEmpty().withMessage('密码不能为空'),
    check('email').trim().not().isEmpty().withMessage('密码不能为空'),
    check('password').trim().not().isEmpty().withMessage('密码不能为空'),
    check('nick_name').trim().not().isEmpty().withMessage('密码不能为空'),
    check('job').trim().not().isEmpty().withMessage('密码不能为空'),
    check('department').trim().not().isEmpty().withMessage('密码不能为空'),
    check('avatar').trim().not().isEmpty().withMessage('密码不能为空'),
    check('motto').trim().not().isEmpty().withMessage('密码不能为空'),
    check('gender').trim().not().isEmpty().withMessage('密码不能为空'),
    check('age').trim().not().isEmpty().withMessage('密码不能为空'),
    check('status').trim().not().isEmpty().withMessage('密码不能为空'),
    check('tags').trim().not().isEmpty().withMessage('密码不能为空'),
    check('teams').trim().not().isEmpty().withMessage('密码不能为空'),
    check('system').trim().not().isEmpty().withMessage('密码不能为空'),
    check('roles').trim().not().isEmpty().withMessage('密码不能为空'),
  ]
}

export { validatorLogin }
