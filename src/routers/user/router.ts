import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import { operator } from '../../middleware/operator'
import { UserDocument } from './typings'
import Service from './service'
import Excel from '../../util/Excel'

const router: Router = Router()
const service = new Service()

// export
router.get('/export', (req: Request, res: Response, next: NextFunction) => {
  const excel = new Excel()
  const name = '用户信息'
  excel.addSheet(name)

  const header = excel.getHeader(name, 1)
  if (header) {
    excel.setHeaderStyle(header, {
      height: 20,
    })
  }

  excel.setColumns(name, [
    {
      header: '姓名',
      key: 'name',
    },
    {
      header: '手机号码',
      key: 'phone',
    },
    {
      header: 'Email',
      key: 'email',
    },
    {
      header: '性别',
      key: 'gender',
    },
    {
      header: '创建时间',
      key: 'created_at',
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
      )
      return excel.writeFile(res, 'excel').then(() => {
        res.end()
        console.log('export success')
      })
    })
    .catch(next)
})

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query)
    .then(([users, total]) => {
      req.setData(200, { users, total })
      next()
    })
    .catch(next)
})

// 根据 _id 获取单个
router.get('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const { params, query } = req
  const id = params.id
  const project = query.project as string
  service
    .getOneById(id, project)
    .then((user: UserDocument | null) => {
      if (user) {
        req.setData(200, user.toJSON({ useProjection: true }))
      } else {
        req.setData(404, { message: `没有 ID 为${id}的用户` })
      }
      next()
    })
    .catch(next)
})

// 新增
router.post(
  '/',
  validatorAddOrRepacleBody,
  operator,
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as UserDocument
    service
      .getByPhone(body.phone)
      .then((user) => {
        if (!user) {
          return service.create(body)
        } else {
          return Promise.reject({ status: 409, message: `手机号 ${body.phone} 已存在` })
        }
      })
      .then((user) => {
        req.setData(201, user)
        next()
      })
      .catch(next)
  },
)

// update
router.patch(
  '/:id',
  [validObjectId, validatorUpdateBody],
  operator,
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const body = req.body as UserDocument
    service
      .updateOneById(id, body)
      .then((user) => {
        if (user) {
          req.setData(200, user.toJSON({ useProjection: true }))
        } else {
          req.setData(404, { message: `没有 ID 为${id}的用户` })
        }
        next()
      })
      .catch(next)
  },
)

// 删除指定 id 的用户
router.delete('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
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
