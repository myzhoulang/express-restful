import { Router, Request, Response, NextFunction } from 'express'
import exceljs, { Column } from 'exceljs'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import { operator } from '../../middleware/operator'
import { UserDocument } from './typings'
import Service from './service'

const router: Router = Router()
const service = new Service()

// export
router.get('/export', (req: Request, res: Response, next: NextFunction) => {
  const workbook = new exceljs.Workbook()
  workbook.creator = 'Me'
  workbook.lastModifiedBy = 'Her'
  workbook.created = new Date(1985, 8, 30)
  workbook.modified = new Date()
  workbook.lastPrinted = new Date(2016, 9, 27)
  workbook.properties.date1904 = true
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible',
    },
  ]
  const worksheet = workbook.addWorksheet('My Sheet')
  worksheet.columns = [
    {
      header: 'Id',
      key: 'id',
      width: 10,
      outlineLevel: 0,
      hidden: false,
      values: ['1'],
      style: {
        border: {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        },
      },
    },
    // {
    //   header: 'Name',
    //   key: 'name',
    //   width: 32,
    //   style: {
    //     border: {
    //       top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //       left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //       bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //       right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //     },
    //   },
    // },
    // {
    //   header: 'D.O.B.',
    //   key: 'dob',
    //   width: 10,
    //   outlineLevel: 1,
    //   alignment: { vertical: 'middle', horizontal: 'right' },
    //   style: {
    //     // font
    //     border: {
    //       top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //       left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //       bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //       right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    //     },
    //   },
    // },
  ]

  worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) })
  worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) })

  const row = worksheet.getRow(1)
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFB6C1' },
    bgColor: { argb: 'FFFFB6C1' },
  }

  const cell = worksheet.getCell('C1')
  cell.alignment = { vertical: 'bottom', horizontal: 'right' }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx')
  workbook.xlsx.write(res).then(function (data) {
    res.end()
    console.log('File write done........')
  })
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
