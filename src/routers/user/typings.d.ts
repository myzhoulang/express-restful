import { ObjectId, Schema, Document, Model } from 'mongoose'
import { IRole } from '../role/typings'
import { IAuthority } from '../authority/typings'

export enum Status {
  '已冻结' = 0,
  '正常' = 1,
}

export enum Gender {
  '女' = 0,
  '男' = 1,
}

export interface IUser {
  _id: string
  name: string
  phone: string
  email: string
  password: string
  gender: Gender
  status: Status
  created_by: ObjectId
  created_by_name: string
  created_at: Date
  updated_by: ObjectId
  updated_by_name: string
  updated_at: Date
  last_login_time: Date
  login_count: number
  nick_name: string
  job: string
  department: string
  avatar: string
  motto: string
  age: number
  tags: Array<string>
  teams: Array<string>
  system: Schema.Types.ObjectId
  role_ids: Array<ObjectId>
  auths: Array<IAuthority>
  roles: Array<IRole>
}

// export interface UserDocument extends Document, IUser {}
export type UserDocument = Document & IUser
// model 静态方法定义
export interface UserModel extends Model<UserDocument> {
  setLoginCountAndAt(id: unknown): void
}
