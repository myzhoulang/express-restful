import { ObjectId } from 'mongoose'
import Log from './schema'
import { LogDocument } from './typings'
import config from '../../config/'

export const filterFileds = config.filterFields.join(' ')

const logService = {
  /**
   * 查询日志列表
   * @param queries 查询条件JSON
   */
  async query(queries: IListQueryFields): Promise<[Array<LogDocument | null>, number]> {
    const { fields, sort, direction, page, size, ...query } = queries
    const maxSize = Math.min(size)
    return await Promise.all([
      Log.find(query)
        .skip((page - 1) * maxSize)
        .limit(maxSize)
        .sort({ [sort]: direction })
        .select(`${fields || ''} ${filterFileds}`),
      Log.find(query).count(),
    ])
  },

  /**
   *
   * @param id 日志ID
   * @param fields 返回结果中需要过滤掉的字段
   */
  async getById(id: unknown, fields?: string): Promise<LogDocument | null> {
    return await Log.findById(id).select(`${fields || ''} ${filterFileds}`)
  },

  /**
   * 创建日志
   * @param body 日志信息
   */
  async create(body: LogDocument): Promise<LogDocument> {
    return await Log.create(body)
  },
}

export default logService
