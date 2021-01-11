import User from './schema'
import { IUser, UserDocument } from './typings'

export const filterFileds = '-__v -password'

const userService = {
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

  async getById(id: unknown, fields?: string): Promise<IUser | null> {
    try {
      return await User.findById(id)
        .select(`${fields || ''} ${filterFileds}`)
        .lean()
    } catch (error) {
      throw 'Server Error'
    }
  },

  async create(body: UserDocument): Promise<UserDocument | Error> {
    try {
      const user = await this.getByPhone(body.phone)
      if (!user) {
        return await User.create(body)
      }
      return Promise.reject({ status: 409, message: `手机号 ${body.phone} 已存在` })
    } catch (error) {
      throw 'Server Error'
    }
  },

  async update(id: unknown, body: UserDocument): Promise<UserDocument | null> {
    try {
      return await User.findByIdAndUpdate(id, body, { new: true })
    } catch (error) {
      throw 'Server Error'
    }
  },

  async deleteById(id: unknown): Promise<UserDocument | null> {
    try {
      return await User.findByIdAndDelete(id)
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default userService
