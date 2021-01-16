import { ObjectId } from 'mongoose'
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

  async getAuthoriesForRoles(roles: ObjectId | Array<ObjectId>) {
    try {
      return await Role.getAuthorityByRoleIds(roles)
    } catch (error) {
      throw new Error(error)
    }
  }
}
