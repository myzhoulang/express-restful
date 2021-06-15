import { Schema, Model, model } from 'mongoose'
import xss from 'xss'
import { timestamps } from '../../util/db'
import { AuthorityDocument, AuthorityModel, IPathAndMethod } from './typings'

export const AuthoritySchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      minlength: 2,
      maxlength: 30,
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
    code: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      default: null,
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
    path: {
      type: Schema.Types.String,
    },
    method: {
      type: Schema.Types.String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    system: {
      type: Schema.Types.ObjectId,
    },
  },
  timestamps,
)

AuthoritySchema.statics.getOneByPathAndMethod = function (
  this: Model<AuthorityDocument>,
  query: IPathAndMethod,
  project?: string,
) {
  return this.findOne(query).select(project)
}

export default model<AuthorityDocument, AuthorityModel>('Authority', AuthoritySchema)
