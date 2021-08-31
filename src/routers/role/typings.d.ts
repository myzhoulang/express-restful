import { ObjectId, Document, Model, Query } from 'mongoose'

export enum status {
  '已冻结' = 0,
  '正常' = 1,
}

export interface IRole {
  code: string
  title: string
  desc: string
  status: status
  created_by: ObjectId
  created_by_name: string
  created_at: Date
  updated_by: ObjectId
  updated_by_name: string
  updated_at: Date
  system: string
  authority_ids: Array<ObjectId>
  auth: Array<IRole>
  is_built_in: boolean
}

export interface RoleDocument extends Document, IRole {}

export interface Auths {
  codes: Array<string>
  titles: Array<string>
}
export interface RoleModel extends Model<RoleDocument> {
  getRolesByIds(
    this: Model<RoleDocument>,
    ids: Array<unknown>,
  ): Query<Array<RoleDocument>, RoleDocument>
}
