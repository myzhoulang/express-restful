import mongoose, { ObjectId } from 'mongoose'
import Authority from './schema'
import { IAuthority } from './typings'

export const filterFileds = '-__v'

const roleService = {
  async query(queries: IListQueryFields): Promise<[Array<IAuthority>, number]> {
    const { fields, sort, direction, page, size, ...query } = queries
    const maxSize = Math.min(size)
    return await Promise.all([
      Authority.find(query)
        .skip((page - 1) * maxSize)
        .limit(maxSize)
        .sort({ [sort]: direction })
        .select(`${fields || ''} ${filterFileds}`),
      Authority.find(query).count(),
    ])
  },

  async getById(id: string, fields?: string): Promise<IAuthority | null> {
    return await Authority.findById(mongoose.Types.ObjectId(id))
      .select(`${fields || ''} ${filterFileds}`)
      .lean()
  },

  async getOneByTitle(title: string, fields?: string): Promise<IAuthority> {
    return await Authority.getOneByTitle(title)
      .select(`${fields || ''} ${filterFileds}`)
      .lean()
  },

  async getByCode(code: string, fields?: string): Promise<IAuthority> {
    return await Authority.getOneByCode(code)
      .select(`${fields || ''} ${filterFileds}`)
      .lean()
  },

  async create(body: IAuthority): Promise<IAuthority | Error> {
    const authority = await this.getByCode(body.code)
    if (!authority) {
      return await Authority.create(body)
    }
    return Promise.reject({ status: 409, message: `权限标识符 ${body.title} 已被添加` })
  },

  async update(id: unknown, body: IAuthority): Promise<IAuthority | null> {
    return await Authority.findByIdAndUpdate(id, body)
  },

  async deleteById(id: unknown): Promise<IAuthority | null> {
    return await Authority.findByIdAndDelete(id)
  },
}

export default roleService
