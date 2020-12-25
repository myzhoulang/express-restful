import { ValidationError } from 'express-validator'
export interface Error {
  status: number
  message?: string
  errors?: ValidationError
}
