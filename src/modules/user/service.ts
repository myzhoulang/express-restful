import User from './schema'
import { UserDocument } from './typings'
import service from '../../util/crud'

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
}
