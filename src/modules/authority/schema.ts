import { Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'
import { AuthorityDocument, AuthorityModelConstructor } from './typings'

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
    url: {
      type: Schema.Types.String,
    },
    system: {
      type: Schema.Types.ObjectId,
    },
  },
  timestamps,
)

AuthoritySchema.statics.getOneByTitle = function (title: string) {
  return this.findOne({ title })
} as AuthorityModelConstructor['getOneByTitle']

AuthoritySchema.statics.getByCode = function (code: string) {
  return this.findOne({ code })
} as AuthorityModelConstructor['getByCode']

const Authority = createCollection<AuthorityDocument>(
  'Authority',
  AuthoritySchema,
) as AuthorityModelConstructor

export default Authority
