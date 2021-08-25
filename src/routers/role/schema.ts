import { Schema, model } from 'mongoose'
import xss from 'xss'
import { timestamps } from '../../util/db'
import { RoleDocument, RoleModel } from './typings'

export const RoleSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      minlength: 2,
      maxlength: 10,
      required: true,
      unique: true,
      trim: true,
      set(value: string) {
        return xss(value)
      },
    },
    desc: {
      type: Schema.Types.String,
      maxlength: 40,
      trim: true,
      set(value: string) {
        return xss(value)
      },
    },
    status: {
      type: Schema.Types.Number,
      enum: [0, 1],
      default: 1,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      // required: true,
    },
    created_by_name: {
      type: Schema.Types.String,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updated_by_name: {
      type: Schema.Types.String,
    },
    system: {
      type: Schema.Types.ObjectId,
      // required: true,
    },
    authority_ids: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { ...timestamps, toJSON: { virtuals: true } },
)

RoleSchema.virtual('auth', {
  ref: 'Authority', // model
  localField: 'authority_ids', // RoleSchema 中的字段
  foreignField: '_id', // 关联表中的字段
  justOne: false,
})

export default model<RoleDocument, RoleModel>('Role', RoleSchema)
