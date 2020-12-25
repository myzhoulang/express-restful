import { ObjectId, Date, Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { createCollection, timestamps } from '../../util/db'
import config from '../../config/'

export enum UserStatus {
  '已冻结',
  '正常',
}

export enum UserGender {
  '女',
  '男',
}

export interface IUser {
  _id?: ObjectId // 自动生成
  name: string
  phone: string
  email: string
  password: string
  last_login_time?: Date
  login_count?: number
  nick_name?: string
  job?: string
  department?: string
  avatar?: string
  motto?: string
  gender: UserGender
  age?: number
  status: UserStatus
  tags?: Array<string>
  teams?: Array<string>
  created_by?: ObjectId
  created_at?: Date
  updated_by?: ObjectId
  updated_at?: Date
  system?: Schema.Types.ObjectId
  roles?: Array<ObjectId>
}

export type UserModel = IUser & Document

export const UserSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      minlength: 2,
      maxlength: 10,
      required: true,
      trim: true,
    },
    phone: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      set(value) {
        return bcrypt.hashSync(value, config.saltRounds)
      },
    },
    last_login_time: {
      type: Schema.Types.Date,
      default: Date.now,
    },
    login_count: {
      type: Schema.Types.Number,
      default: 0,
    },
    nick_name: {
      type: Schema.Types.String,
      maxlength: 10,
    },
    job: {
      type: Schema.Types.String,
    },
    department: {
      type: Schema.Types.String,
    },
    avatar: {
      type: Schema.Types.String,
      default: '',
    },
    motto: {
      type: Schema.Types.String,
      default: '',
    },
    gender: {
      type: Schema.Types.Number,
      enum: [0, 1],
      default: 1,
    },
    age: {
      type: Schema.Types.Number,
      max: 200,
      min: 1,
    },
    status: {
      type: Schema.Types.Number,
      enum: [0, 1],
      default: 1,
    },
    desc: {
      type: Schema.Types.String,
      maxlength: 40,
      trim: true,
      default: '',
    },
    tags: {
      type: [Schema.Types.String],
      default: [],
    },
    temas: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    created_by: {
      type: Schema.Types.ObjectId,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
    },
    system: {
      type: Schema.Types.ObjectId,
    },
    roles: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    _v: {
      select: false,
    },
  },
  timestamps,
)

const User = createCollection<UserModel>('User', UserSchema)

export default User
