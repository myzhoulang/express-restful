import { ObjectId, Date, Document, Model, Query } from 'mongoose'
export enum status {
  '已冻结' = 0,
  '正常' = 1,
}

export enum type {
  '目录' = 1,
  '菜单' = 2,
  '按钮' = 3,
}

export type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface IAuthority {
  title: string
  desc: string
  code: string
  parent_id: ObjectId
  status: number
  created_by: ObjectId
  created_by_name: string
  created_at: Date
  updated_by: ObjectId
  updated_by_name: string
  updated_at: Date
  icon: string
  type: number
  path: string
  method: Methods
  system: string
}

export interface AuthorityDocument extends Document, IAuthority {}

export interface IPathAndMethod {
  path: string
  method: Methods
  type: number
}
export interface AuthorityModel extends Model<AuthorityDocument> {
  getOneByTitle(
    this: Model<AuthorityDocument>,
    title: string,
  ): Query<AuthorityDocument, AuthorityDocument>

  getOneByCode(
    this: Model<AuthorityDocument>,
    code: string,
  ): Query<AuthorityDocument, AuthorityDocument>
}
