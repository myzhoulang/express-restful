import { ObjectId, Date, Document, Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'

export enum RoleStatus {
  '已冻结',
  '正常',
}

export interface IRole extends Document {
  _id: ObjectId
  title: string
  desc?: string
  status: RoleStatus
  created_by: ObjectId
  created_at: Date
  updated_by: ObjectId
  updated_at: Date
  system: string
  authority_ids: Array<ObjectId>
}

export const RoleSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      minlength: 2,
      maxlength: 10,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: Schema.Types.String,
      maxlength: 40,
      trim: true,
    },
    status: {
      type: Schema.Types.Number,
      enum: [0, 1],
      default: 1,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    system: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    authority_ids: {
      type: [Schema.Types.ObjectId],
    },
  },
  timestamps,
)
const Role = createCollection<IRole>('Role', RoleSchema)
export default Role
