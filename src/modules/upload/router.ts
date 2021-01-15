import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() }).single('file')

import { operator } from '../../middleware/operator'
import { putFile, getFile } from './upload'

const router: Router = Router()

// 获取所有
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (error) => {
    const fileName = `/auth/${Date.now()}.png`
    putFile(fileName, req.file)
      .then((data) => {
        return getFile(fileName)
      })
      .then((data) => {
        console.log(data)
      })
      .catch((e) => {
        console.log(e)
      })
  })
})

export { router as upload }
