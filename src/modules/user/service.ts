import User from './schema'
import { UserDocument } from './typings'
import BaseService from '../../util/BaseService'
import RoleService from '../role/service'

const roleService = new RoleService()

export default class extends BaseService<UserDocument> {
  constructor() {
    super(User)
  }

  async getByEmail(email: string, project?: string): Promise<UserDocument | null> {
    try {
      return await this.queryOne({ email }, project)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getByPhone(phone: string, project?: string): Promise<UserDocument | null> {
    try {
      return await this.queryOne({ phone }, project)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getUserAuthCodes(userId: string): Promise<Array<string>> {
    return this.getOneById({ _id: userId })
      .then((user) => {
        if (user && user.roles) {
          return roleService.getAuthorityByRoleIds(user?.roles)
        }
        return []
      })
      .then(([auth]) => {
        return auth?.codes || []
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}
