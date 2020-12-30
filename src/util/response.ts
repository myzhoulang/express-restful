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

export interface IServiceData {
  [key: string]: any
}
export interface IServiceResult {
  status: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 405 | 409 | 410 | 500 | 503
  message?: string
  data?: IServiceData
}

// 成功
export interface IResErrorBody {
  message?: string
  code?: number
  errors?: Array<ValidationError>
}

export const filterFileds = '-__v -password'
