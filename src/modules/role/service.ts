import { ObjectId } from 'mongoose'
import service from '../../util/crud'
import Role from './schema'
import { RoleDocument } from './typings'

export default {
  async getOneByTitle(title: string, project?: string): Promise<RoleDocument | null> {
    try {
      return await service.queryOne(Role, { title }, project)
    } catch (error) {
      throw new Error(error)
    }
  },

  async getAuthoriesForRoles(roles: ObjectId | Array<ObjectId>) {
    try {
      return await Role.getAuthorityByRoleIds(roles)
    } catch (error) {
      throw new Error(error)
    }
  },
}
