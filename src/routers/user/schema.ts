import mongoose, { Schema, model } from 'mongoose'
import xss from 'xss'
import bcrypt from 'bcryptjs'
import { timestamps } from '../../util/db'
import config from '../../config/'
import { UserDocument, UserModel } from './typings'

const { Types } = Schema
const { String, Boolean, ObjectId, Number } = Types

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 10,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      set(value: string) {
        return bcrypt.hashSync(value, config.saltRounds)
      },
    },
    last_login_time: {
      type: Types.Date,
      default: null,
    },
    login_count: {
      type: Number,
      default: 0,
    },
    nick_name: {
      type: String,
      maxlength: 10,
    },
    job: {
      type: String,
      maxlength: 10,
    },
    department: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    motto: {
      type: String,
      maxlength: 20,
      default: '',
    },
    gender: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    age: {
      type: Number,
      max: 200,
      min: 1,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    desc: {
      type: String,
      maxlength: 40,
      trim: true,
      default: '',
      set(value: string) {
        return xss(value)
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    temas: {
      type: [ObjectId],
      default: [],
    },
    created_by: {
      type: ObjectId,
    },
    created_by_name: {
      type: String,
    },
    updated_by: {
      type: ObjectId,
    },
    updated_by_name: {
      type: String,
    },
    system: {
      type: ObjectId,
    },
    role_ids: {
      type: [Schema.Types.ObjectId],
    },
  },
  { ...timestamps, toJSON: { virtuals: true } },
)

// 用户 role_ids 对应的角色信息
UserSchema.virtual('roles', {
  ref: 'Role', // model
  localField: 'role_ids', // RoleSchema 中的字段
  foreignField: '_id', // 关联表中的字段
  justOne: false,
})

// 设置最后登录时间和统计登录次数
UserSchema.statics.setLoginCountAndAt = async function (id: mongoose.ObjectId) {
  return await this.findByIdAndUpdate(id, {
    $inc: { login_count: +1 },
    last_login_time: new Date(),
  })
}

export default model<UserDocument, UserModel>('User', UserSchema)
