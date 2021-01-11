import Role from './schema'
import { RoleDocument } from './typings'
import { ObjectId } from 'mongoose'

export const filterFileds = '-__v'

const service = {
  async query(queries: IListQueryFields): Promise<[Array<RoleDocument>, number]> {
    try {
      const { fields, sort, direction, page, size, ...query } = queries
      const maxSize = Math.min(size)
      return await Promise.all([
        Role.find(query)
          .skip((page - 1) * maxSize)
          .limit(maxSize)
          .sort({ [sort]: direction })
          .select(`${fields || ''} ${filterFileds}`),
        Role.find(query).count(),
      ])
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getById(id: unknown, fields?: string): Promise<RoleDocument | null> {
    try {
      return await Role.findById(id).select(`${fields || ''} ${filterFileds}`)
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getOneByTitle(title: string, fields?: string): Promise<RoleDocument> {
    try {
      return await Role.getOneByTitle(title).select(`${fields || ''} ${filterFileds}`)
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getAuthoriesForRoles(roles: ObjectId | Array<ObjectId>) {
    try {
      return await Role.getAuthorityByRoleIds(roles)
    } catch (error) {
      throw 'Server Error'
    }
  },

  async create(body: RoleDocument): Promise<RoleDocument | Error> {
    try {
      const role = await this.getOneByTitle(body.title)
      if (!role) {
        return await Role.create(body)
      }
      return Promise.reject({ status: 409, message: `角色名称 ${body.title} 已被添加` })
    } catch (error) {
      throw 'Server Error'
    }
  },

  async update(id: unknown, body: RoleDocument): Promise<RoleDocument | null> {
    try {
      return await Role.findByIdAndUpdate(id, body, { new: true })
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default service
