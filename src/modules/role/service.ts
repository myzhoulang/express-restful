import mongoose, { ObjectId } from 'mongoose'
import Role from './schema'
import { RoleDocument } from './typings'
import BaseService from '../../util/BaseService'

export default class extends BaseService<RoleDocument> {
  constructor() {
    super(Role)
  }

  async getOneByTitle(title: string, project?: string): Promise<RoleDocument | null> {
    try {
      return await this.queryOne({ title }, project)
    } catch (error) {
      throw new Error(error)
    }
  }

  getAuthorityByRoleIds(ids: Array<ObjectId>) {
    return this.model.aggregate([
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
            $in: ids,
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
}
