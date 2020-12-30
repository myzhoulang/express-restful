import { filterFileds } from '../../util/response'
import User from './schema'
import { IUserQuery, QueryFields, UserModel } from './typings'

const userService = {
  async query(queries: IUserQuery): Promise<[Array<UserModel>, number]> {
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

  async getUserById(id: unknown, fields?: QueryFields): Promise<UserModel | null> {
    return await User.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  async deleteById(id: unknown): Promise<UserModel | null> {
    return await User.findByIdAndDelete(id)
  },
}

export default userService
