import User from './schema'
import { UserDocument } from './typings'
import BaseService from '../../util/BaseService'

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
}
