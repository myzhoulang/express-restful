import Log from './schema'
import Role from './schema'
import { LogDocument } from './typings'

export const filterFileds = '-__v'

const logService = {
  async query(queries: IListQueryFields): Promise<[Array<LogDocument>, number]> {
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

  async getById(id: unknown, fields?: string): Promise<LogDocument | null> {
    return await Role.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  async create(body: LogDocument) {
    return await Log.create(body)
  },
}

export default logService
