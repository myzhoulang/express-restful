import mongoose, { Schema } from 'mongoose'
import { createCollection, timestamps } from '../../util/db'
import { RoleDocument, RoleModelConstructor } from './typings'
import Authority from '../authority/schema'

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

// 根据角色 ID 获取权限标识符
RoleSchema.statics.getAuthorityByRoleIds = function (ids: Array<string>) {
  const mongoIds = ids.map((item) => mongoose.Types.ObjectId(item))
  console.log(mongoIds)
  return this.aggregate([
    {
      $lookup: {
        //关联
        from: 'authorities', //关联的表名
        localField: 'authority_ids', //本身的外键
        foreignField: '_id', //需要关联表的外键
        as: 'authority',
      },
    },
    {
      $match: {
        //筛选条件
        _id: {
          $in: mongoIds,
        },
      },
    },

    {
      $group: {
        _id: null,
        auths_code: {
          $addToSet: '$authority.code',
        },
        auth_titles: {
          $addToSet: '$authority.title',
        },
      },
    },

    {
      $project: {
        _id: 0,
        codes: {
          $reduce: {
            input: '$auths_code',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
        titles: {
          $reduce: {
            input: '$auth_titles',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
      },
    },
  ])
} as RoleModelConstructor['getAuthorityByRoleIds']

const Role = createCollection<RoleDocument>('Role', RoleSchema) as RoleModelConstructor
export default Role
