import mongoose, { Schema } from 'mongoose'
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
      default: null,
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
    created_by_name: {
      type: Types.String,
    },
    updated_by: {
      type: Types.ObjectId,
    },
    updated_by_name: {
      type: Types.String,
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

// 在userSchema上定义静态方法
userSchema.statics.getOneByEmail = async function (email: string) {
  return await this.findOne({ email })
} as UserModelConstructor['getOneByEmail']

userSchema.statics.getOneByPhone = async function (phone: string) {
  return await this.findOne({ phone })
} as UserModelConstructor['getOneByPhone']

userSchema.statics.setLoginCountAndAt = async function (id: unknown) {
  return await this.findByIdAndUpdate(id, {
    $inc: { login_count: +1 },
    last_login_time: new Date(),
  })
} as UserModelConstructor['setLoginCountAndAt']

const User = createCollection<UserDocument>('User', userSchema) as UserModelConstructor

export default User
