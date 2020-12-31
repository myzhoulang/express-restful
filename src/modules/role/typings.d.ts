import { ObjectId, Document, Model, Query } from 'mongoose'

export enum status {
  '已冻结',
  '正常',
}

export interface IRole {
  title: string
  desc?: string
  status: status
  created_by: ObjectId
  created_by_name: string
  created_at: Date
  updated_by: ObjectId
  updated_by_name: string
  updated_at: Date
  system: string
  authority_ids: Array<ObjectId>
}

export interface RoleDocument extends Document, IRole {}

export interface RoleModelConstructor extends Model<RoleDocument> {
  getOneByName(this: Model<RoleDocument>, name: string): Query<RoleDocument, RoleDocument>
}
