import { ObjectId, Date, Schema } from 'mongoose'

export enum UserStatus {
  '已冻结',
  '正常',
}

export enum UserGender {
  '女',
  '男',
}

export interface IUser {
  _id?: ObjectId // 自动生成
  name: string
  phone: string
  email: string
  password: string
  last_login_time?: Date
  login_count?: number
  nick_name?: string
  job?: string
  department?: string
  avatar?: string
  motto?: string
  gender: UserGender
  age?: number
  status: UserStatus
  tags?: Array<string>
  teams?: Array<string>
  created_by?: ObjectId
  created_at?: Date
  updated_by?: ObjectId
  updated_at?: Date
  system?: Schema.Types.ObjectId
  roles?: Array<ObjectId>
}

export type QueryFields = 'name' | 'phone' | 'gender' | 'status'

export interface IQueryPage {
  page: number
  size: number
}

export interface IUserQuery extends IQueryPage {
  fields?: Array<QueryFields> | QueryFields
  sort: string
  direction?: number
  page: number
  size: number
  [key: string]: any
}
