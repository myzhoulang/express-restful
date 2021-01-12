import { ObjectId, Document, Model, Query, Aggregate } from 'mongoose'

export enum status {
  '已冻结' = 0,
  '正常' = 1,
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

export interface RoleModel extends Model<RoleDocument> {
  getOneByTitle(this: Model<RoleDocument>, name: string): Query<RoleDocument, RoleDocument>
  getAuthorityByRoleIds(this: Model<RoleDocument>, id: unknown): any
  getRolesByIds(
    this: Model<RoleDocument>,
    ids: Array<unknown>,
  ): Query<Array<RoleDocument>, RoleDocument>
}
