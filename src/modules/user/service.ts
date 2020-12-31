import User from './schema'
import { UserDocument } from './typings'

export const filterFileds = '-__v -password'

const userService = {
  async query(queries: IListQueryFields): Promise<[Array<UserDocument>, number]> {
    const { fields, sort, direction, page, size, ...query } = queries
    const maxSize = Math.min(size, 20)
    return await Promise.all([
      User.find(query)
        .skip((page - 1) * maxSize)
        .limit(maxSize)
        .sort({ [sort]: direction })
        .select(`${fields || ''} ${filterFileds}`),
      User.find(query).count(),
    ])
  },

  async getByEmail(email: string): Promise<UserDocument> {
    return User.getOneByEmail(email)
  },

  async getByPhone(phone: string): Promise<UserDocument> {
    return User.getOneByPhone(phone)
  },

  async getById(id: unknown, fields?: string): Promise<UserDocument | null> {
    return await User.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  async create(body: UserDocument): Promise<UserDocument | Error> {
    const user = await this.getByPhone(body.phone)
    if (!user) {
      return await User.create(body)
    }
    return Promise.reject({ status: 409, message: `手机号 ${body.phone} 已存在` })
  },

  async update(id: unknown, body: UserDocument): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(id, body)
  },

  async deleteById(id: unknown): Promise<UserDocument | null> {
    return await User.findByIdAndDelete(id)
  },
}

export default userService
