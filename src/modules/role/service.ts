import Role from './schema'
import Authority from '../authority/schema'
import { RoleDocument } from './typings'
import { ObjectId } from 'mongoose'

export const filterFileds = '-__v'

const roleService = {
  async query(queries: IListQueryFields): Promise<[Array<RoleDocument>, number]> {
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
  },

  async getById(id: unknown, fields?: string): Promise<RoleDocument | null> {
    return await Role.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  async getOneByName(name: string, fields?: string): Promise<RoleDocument> {
    return await Role.getOneByName(name).select(`${fields || ''} ${filterFileds}`)
  },

  // async getAuthorityById(id: string) {
  //   return await Role.getAuthorityById(id)
  // },

  async getAuthoriesForRoles(roles: ObjectId | Array<ObjectId>) {
    return await Role.getAuthorityByRoleIds(roles)
  },

  async create(body: RoleDocument): Promise<RoleDocument | Error> {
    const role = await this.getOneByName(body.title)
    if (!role) {
      return await Role.create(body)
    }
    return Promise.reject({ status: 409, message: `角色名称 ${body.title} 已被添加` })
  },

  async update(id: unknown, body: RoleDocument): Promise<RoleDocument | null> {
    return await Role.findByIdAndUpdate(id, body)
  },

  async deleteById(id: unknown): Promise<RoleDocument | null> {
    return await Role.findByIdAndDelete(id)
  },
}

export default roleService
