import { ValidationError } from 'express-validator'
export interface Error {
  name?: string
  status: number
  message?: string
  header?: any
  errors?: ValidationError
}
