import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() }).single('file')

import { operator } from '../../middleware/operator'
import { putFile } from './upload'

const router: Router = Router()

// 获取所有
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (error) => {
    console.log(req.file)
    putFile(req.file).catch((e) => {
      console.log(e)
    })
  })
})

export { router as upload }
