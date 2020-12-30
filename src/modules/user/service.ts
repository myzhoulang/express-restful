import User from './schema'
import { IUserQuery, UserDocument } from './typings'

export const filterFileds = '-__v -password'

const userService = {
  async query(queries: IUserQuery): Promise<[Array<UserDocument>, number]> {
    const { fields, sort, direction, page, size, ...query } = queries
    return await Promise.all([
      User.find(query)
        .skip((page - 1) * size)
        .limit(size)
        .sort({ [sort]: direction })
        .select(`${fields || ''} ${filterFileds}`),
      User.find(query).count(),
    ])
  },

  async getByEmail(email: string) {
    return User.getOneByEmail(email)
  },

  async getByPhone(phone: string) {
    return User.getOneByPhone(phone)
  },

  async getById(id: unknown, fields?: string): Promise<UserDocument | null> {
    return await User.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  async create(body: UserDocument) {
    const user = await this.getByPhone(body.phone)
    if (!user) {
      return await User.create(body)
    }
    return Promise.reject({ status: 409, message: `email ${body.phone} 已被添加` })
  },

  async update(id: unknown, body: UserDocument) {
    return await User.findByIdAndUpdate(id, body)
  },

  async deleteById(id: unknown): Promise<UserDocument | null> {
    return await User.findByIdAndDelete(id)
  },
}

export default userService
