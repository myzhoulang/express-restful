import Role from './schema'
import { RoleDocument } from './typings'
import { ObjectId } from 'mongoose'

export const filterFileds = '-__v'

const service = {
  async getOneByTitle(title: string, fields?: string): Promise<RoleDocument> {
    try {
      return await Role.getOneByTitle(title).select(`${fields || ''} ${filterFileds}`)
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getAuthoriesForRoles(roles: ObjectId | Array<ObjectId>) {
    try {
      return await Role.getAuthorityByRoleIds(roles)
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default service
