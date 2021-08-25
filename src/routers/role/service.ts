import { ObjectId } from 'mongoose'
import Role from './schema'
import { IRole, RoleDocument } from './typings'
import BaseService from '../../util/service/BaseRestFulService'

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
  getAuthorityByRoleIds(ids: Array<ObjectId>): Promise<IRole[][] | null> {
    return this.model
      .find({ _id: { $in: ids } })
      .populate({
        path: 'auth',
        select: 'title _id code type',
      })
      .then((data) => {
        return data.map((item) => {
          return item.auth
        })
      })
  }
}
