import { ObjectId, Schema, Document, Model } from 'mongoose'

export enum status {
  '已冻结',
  '正常',
}

export enum gender {
  '女',
  '男',
}

export interface IUser {
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
  gender: gender
  age?: number
  status: status
  tags?: Array<string>
  teams?: Array<string>
  created_by: ObjectId
  created_by_name: string
  created_at: Date
  updated_by: ObjectId
  updated_by_name: string
  updated_at: Date
  system?: Schema.Types.ObjectId
  roles?: Array<ObjectId>
  auths?: Array<string>
}

export interface UserDocument extends Document, IUser {}
// model 静态方法定义
export interface UserModelConstructor extends Model<UserDocument> {
  getOneByEmail(this: Model<UserDocument>, email: string): Promise<UserDocument>
  getOneByPhone(this: Model<UserDocument>, phone: string): Promise<UserDocument>
  setLoginCountAndAt(this: Model<UserDocument>, id: unknown): void
}
