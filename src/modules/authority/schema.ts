import { ObjectId, Date, Document, Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'
export enum AuthorityStatus {
  '已冻结',
  '正常',
}

export interface IAuthority extends Document {
  _id: ObjectId
  title: string
  desc?: string
  code: string
  parent_id: ObjectId
  status: number
  created_by: ObjectId
  created_at: Date
  updated_by: ObjectId
  updated_at: Date
  icon?: string
  type: number
  url?: string
  system: string
}

export const AuthoritySchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      minlength: 2,
      maxlength: 30,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: Schema.Types.String,
      maxlength: 40,
      trim: true,
    },
    code: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      required: true,
      default: 0,
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
    icon: {
      type: Schema.Types.String,
    },
    type: {
      type: Schema.Types.Number,
      enum: [1, 2, 3],
      default: 3,
    },
    url: {
      type: Schema.Types.String,
    },
    system: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  timestamps,
)
const Authority = createCollection<IAuthority>('Authority', AuthoritySchema)
export default Authority
