import Authority from './schema'
import { AuthorityDocument } from './typings'

export const filterFileds = '-__v'

const roleService = {
  async query(queries: IListQueryFields): Promise<[Array<AuthorityDocument>, number]> {
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

  async getById(id: unknown, fields?: string): Promise<AuthorityDocument | null> {
    return await Authority.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  async getOneByTitle(title: string, fields?: string): Promise<AuthorityDocument> {
    return await Authority.getOneByTitle(title).select(`${fields || ''} ${filterFileds}`)
  },

  async getByCode(code: string, fields?: string): Promise<AuthorityDocument> {
    return await Authority.getByCode(code).select(`${fields || ''} ${filterFileds}`)
  },

  async create(body: AuthorityDocument): Promise<AuthorityDocument | Error> {
    const authority = await this.getByCode(body.code)
    if (!authority) {
      return await Authority.create(body)
    }
    return Promise.reject({ status: 409, message: `权限标识符 ${body.title} 已被添加` })
  },

  async update(id: unknown, body: AuthorityDocument): Promise<AuthorityDocument | null> {
    return await Authority.findByIdAndUpdate(id, body)
  },

  async deleteById(id: unknown): Promise<AuthorityDocument | null> {
    return await Authority.findByIdAndDelete(id)
  },
}

export default roleService
