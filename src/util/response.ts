import { Response } from 'express'
import { ValidationError } from 'express-validator'

// 成功
export interface IResSuccessList<T> {
  total?: number
  message?: string
  list: Array<T>
}
export interface IResSuccessSign<T> {
  message?: string
  code?: number
  data?: T
}

// 成功
export interface IResErrorBody {
  message?: string
  code?: number
  errors?: Array<ValidationError>
}

const res = {
  200<T>(res: Response, data: IResSuccessList<T> | IResSuccessSign<T>) {
    res.status(200).json(data)
  },
  201<T>(res: Response, data: IResSuccessSign<T>) {
    return res.status(201).json(data)
  },
  204() {},
  400(res: Response, errors: IResErrorBody) {
    return res.status(400).json(errors)
  },
  401() {},
  403() {},
}

export default res
