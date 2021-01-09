import mongoose from 'mongoose'
import Authority from './schema'
import { IAuthority } from './typings'

export const filterFileds = '-__v'

const service = {
  async query(queries: IListQueryFields): Promise<[Array<IAuthority>, number]> {
    try {
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
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getById(id: string, fields?: string): Promise<IAuthority | null> {
    try {
      return await Authority.findById(mongoose.Types.ObjectId(id))
        .select(`${fields || ''} ${filterFileds}`)
        .lean()
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getOneByTitle(title: string, fields?: string): Promise<IAuthority> {
    try {
      return await Authority.getOneByTitle(title)
        .select(`${fields || ''} ${filterFileds}`)
        .lean()
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getByCode(code: string, fields?: string): Promise<IAuthority> {
    try {
      return await Authority.getOneByCode(code)
        .select(`${fields || ''} ${filterFileds}`)
        .lean()
    } catch (error) {
      throw 'Server Error'
    }
  },

  async create(body: IAuthority): Promise<IAuthority | Error> {
    try {
      const authority = await this.getByCode(body.code)
      if (!authority) {
        return await Authority.create(body)
      }
      return Promise.reject({ status: 409, message: `权限标识符 ${body.title} 已被添加` })
    } catch (error) {
      throw 'Server Error'
    }
  },

  async update(id: unknown, body: IAuthority): Promise<IAuthority | null> {
    try {
      return await Authority.findByIdAndUpdate(id, body, { new: true, projection: '-__v' })
    } catch (error) {
      throw 'Server Error'
    }
  },

  async deleteById(id: unknown): Promise<IAuthority | null> {
    try {
      return await Authority.findByIdAndDelete(id)
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default service
