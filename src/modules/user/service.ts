import User from './schema'
import { UserDocument } from './typings'

const service = {
  async getByEmail(email: string): Promise<UserDocument> {
    try {
      return await User.getOneByEmail(email)
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getByPhone(phone: string): Promise<UserDocument> {
    try {
      return await User.getOneByPhone(phone)
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default service
