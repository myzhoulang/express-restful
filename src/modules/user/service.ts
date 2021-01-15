import User from './schema'
import { UserDocument } from './typings'
import service from '../../util/crud'
import Role from '../../modules/role/schema'

export default {
  async getByEmail(email: string, project?: string): Promise<UserDocument | null> {
    try {
      return await service.queryOne(User, { email }, project)
    } catch (error) {
      throw new Error(error)
    }
  },

  async getByPhone(phone: string, project?: string): Promise<UserDocument | null> {
    try {
      return await service.queryOne(User, { phone }, project)
    } catch (error) {
      throw new Error(error)
    }
  },

  async getUserAuthCodes(userId: string): Promise<Array<string>> {
    return service
      .getOneById(User, { _id: userId })
      .then((user) => {
        if (user && user.roles) {
          return Role.getAuthorityByRoleIds(user?.roles)
        }
        return []
      })
      .then(([auth]) => {
        return auth.codes
      })
  },
}
