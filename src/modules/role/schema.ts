import mongoose, { Schema, Model, model } from 'mongoose'
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

// 根据角色 ID 获取权限标识符
RoleSchema.statics.getAuthorityByRoleIds = function (
  this: Model<RoleDocument>,
  ids: Array<string>,
) {
  const mongoIds = ids.map((item) => mongoose.Types.ObjectId(item))
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
}

export default model<RoleDocument, RoleModel>('Role', RoleSchema)
