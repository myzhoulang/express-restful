import { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { createCollection, timestamps } from '../../util/db'
import config from '../../config/'
import { UserDocument, UserModelConstructor } from './typings'
const { Types } = Schema

export const userSchema = new Schema(
  {
    name: {
      type: Types.String,
      minlength: 2,
      maxlength: 10,
      required: true,
      trim: true,
    },
    phone: {
      type: Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: Types.String,
      required: true,
      trim: true,
    },
    password: {
      type: Types.String,
      required: true,
      trim: true,
      set(value) {
        return bcrypt.hashSync(value, config.saltRounds)
      },
    },
    last_login_time: {
      type: Types.Date,
    },
    login_count: {
      type: Types.Number,
      default: 0,
    },
    nick_name: {
      type: Types.String,
      maxlength: 10,
    },
    job: {
      type: Types.String,
      maxlength: 10,
    },
    department: {
      type: Types.String,
    },
    avatar: {
      type: Types.String,
      default: '',
    },
    motto: {
      type: Types.String,
      maxlength: 20,
      default: '',
    },
    gender: {
      type: Types.Number,
      enum: [0, 1],
      default: 1,
    },
    age: {
      type: Types.Number,
      max: 200,
      min: 1,
    },
    status: {
      type: Types.Number,
      enum: [0, 1],
      default: 1,
    },
    desc: {
      type: Types.String,
      maxlength: 40,
      trim: true,
      default: '',
    },
    tags: {
      type: [Types.String],
      default: [],
    },
    temas: {
      type: [Types.ObjectId],
      default: [],
    },
    created_by: {
      type: Types.ObjectId,
    },
    updated_by: {
      type: Types.ObjectId,
    },
    system: {
      type: Types.ObjectId,
    },
    roles: {
      type: [Types.ObjectId],
      default: [],
    },
    _v: {
      select: false,
    },
  },
  timestamps,
)

userSchema.statics.getOneByEmail = function (email: string) {
  return this.findOne({ email })
}

userSchema.statics.getOneByPhone = function (phone: string) {
  return this.findOne({ phone })
}

userSchema.statics.setLoginCount = async function (id: unknown) {
  const a = await this.findByIdAndUpdate(id, {
    $inc: { login_count: +1 },
    last_login_time: new Date(),
  })
} as UserModelConstructor['setLoginCount']

const User = createCollection<UserDocument>('User', userSchema) as UserModelConstructor

export default User
