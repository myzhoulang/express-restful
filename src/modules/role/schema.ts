import { Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'
import { RoleDocument, RoleModelConstructor } from './typings'

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
      // required: true,
    },
    created_by_name: {
      type: Schema.Types.String,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      // required: true,
    },
    updated_by_name: {
      type: Schema.Types.String,
    },
    system: {
      type: Schema.Types.ObjectId,
      // required: true,
    },
    authority_ids: {
      type: [Schema.Types.ObjectId],
    },
  },
  timestamps,
)

RoleSchema.statics.getOneByName = function (name: string) {
  return this.findOne({ name })
} as RoleModelConstructor['getOneByName']

const Role = createCollection<RoleDocument>('Role', RoleSchema) as RoleModelConstructor
export default Role
