import mongoose, { ObjectId } from 'mongoose'
import Role from './schema'
import { RoleDocument } from './typings'
import BaseService from '../../util/service/BaseRestFulService'
import AuthorityService from '../authority/service'

export default class extends BaseService<RoleDocument> {
  constructor() {
    super(Role)
  }

  create(body: RoleDocument): Promise<RoleDocument> {
    return super.create(body)
  }

  getOneByTitle(title: string, project?: string): Promise<RoleDocument | null> {
    return this.queryOne({ title }, project)
  }

  // 根据 角色id 获取权限集合
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

// {
//   codes: [1,2,],
//   titles: ['query', 'save']
// }
