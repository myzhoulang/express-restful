import { Router, Request, Response, NextFunction } from 'express'
import { validator } from './validator'
import { operator } from '../../middleware/operator'
import allMethods from '../../middleware/allMethods'
import { UserDocument } from './typings'
import Service from './service'
import Excel from '../../util/Excel'
import Email from '../../util/service/Email'
import client from '../../util/redis'

const router: Router = Router()
const service = new Service()

// export
router.get('/export', (req: Request, res: Response, next: NextFunction) => {
  const excel = new Excel()
  const name = '用户信息'
  excel.addSheet(name, {
    properties: { defaultRowHeight: 30, tabColor: { argb: 'FF00FF00' } },
    views: [],
  })

  const header = excel.getHeader(name, 1)

  if (header) {
    header.height = 30
  }

  excel.setColumns(name, [
    {
      header: '姓名',
      key: 'name',
      width: 30,
    },
    {
      header: '手机号码',
      key: 'phone',
      width: 30,
    },
    {
      header: 'Email',
      key: 'email',
      width: 30,
    },
    {
      header: '性别',
      key: 'gender',
      width: 10,
    },
    {
      header: '创建时间',
      key: 'created_at',
      width: 30,
      alignment: {
        vertical: 'middle',
        horizontal: 'right',
      },
    },
    {
      header: '创建人',
      key: 'created_by_name',
      width: 30,
    },
  ])

  service
    .query(req.query)
    .then(([list]) => {
      excel.addDatas(
        name,
        list.map((user) => {
          const item = user.toJSON()
          const { gender, ...props } = item
          return {
            gender: gender === 1 ? '男' : '女',
            ...props,
          }
        }),
        'i',
      )
      if (header) {
        excel.setHeaderStyle(header, {})
      }

      return excel.writeFile(res, 'excel').then(() => {
        res.end()
      })
    })
    .catch(next)

  // const row = excel.sheets[0].getRow(2)
  // row.fill = {
  //   type: 'pattern',
  //   pattern: 'solid',
  //   fgColor: { argb: `FFFFFFFF` },
  //   bgColor: { argb: `FFFFFFFF` },
  // }
})

// 获取所有
router
  .route('/')
  .all(allMethods(['GET', 'POST']))
  .get((req: Request, res: Response, next: NextFunction) => {
    service
      .query(req.query)
      .then(([users, total]) => {
        req.setData(200, { users, total })
        next()
      })
      .catch(next)
  })
  .post(validator, operator, (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as UserDocument
    service
      .getByPhone(body.phone)
      .then((user) => {
        console.log('user', user)
        if (!user) {
          return service.create(body)
        } else {
          return Promise.reject({ status: 409, message: `手机号 ${body.phone} 已存在` })
        }
      })
      .then((user) => {
        req.setData(201, user)
        const email = new Email()
        // FIXME: 可以使用 UUID
        const emailCode = (Math.random() * 1000000) | 0
        client.set(String(user._id) + '_email_code', String(emailCode)).catch(next)
        email.send({
          from: '"Test" <604389771@qq.com>',
          to: user.email,
          subject: '[后台管理] 请验证您的邮箱地址.',
          html: `<p>系统已将该验证码发送到您的电子邮箱: ${emailCode}</p>`,
        })

        next()
      })
      .catch(next)
  })

// 根据 _id 获取单个
router
  .route('/:id')
  .all(allMethods(['GET', 'PATCH', 'DELETE']))
  .get(validator, (req: Request, res: Response, next: NextFunction) => {
    const { params, query } = req
    const id = params.id
    const project = query.project as string
    service
      .getOneById(id, project)
      .then((user: UserDocument | null) => {
        if (user) {
          req.setData(200, user)
        } else {
          req.setData(404, { message: `没有 ID 为${id}的用户` })
        }
        next()
      })
      .catch(next)
  })
  .patch(validator, operator, (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const body = req.body as UserDocument
    service
      .updateOneById(id, body)
      .then((user) => {
        if (user) {
          req.setData(200, user)
        } else {
          req.setData(404, { message: `没有 ID 为${id}的用户` })
        }
        next()
      })
      .catch(next)
  })
  .delete(validator, (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    service
      .deleteOneById(id)
      .then((result: UserDocument | null) => {
        if (result) {
          req.setData(204)
        } else {
          req.setData(404, { message: `没有 ID 为${id}的用户` })
        }
        next()
      })
      .catch(next)
  })

export { router as user }
