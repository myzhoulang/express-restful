import { Model, UpdateQuery, DocumentDefinition, FilterQuery, ObjectId, Document } from 'mongoose'

export interface FilterQueryList {
  page?: number
  size?: number
  project?: string
  sort?: string
  direction?: 'DESC' | ' ASC'
}

export default class BaseRestFulService<T extends Document> {
  model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  async query(queries: FilterQueryList): Promise<[Array<T>, number]> {
    const { project, sort, direction, page = 1, size = 20, ...query } = queries
    const maxSize = Math.min(size, 20)
    return Promise.all([
      this.model
        .find(query)
        .skip((page - 1) * maxSize)
        .limit(maxSize)
        .sort({ [sort || 'updated_at']: direction || 'DESC' })
        .select(`${project ?? ''}`),
      this.model.find(query).countDocuments(),
    ])
  }

  // 查单个
  async queryOne(query: FilterQuery<T>, project?: string | undefined): Promise<T | null> {
    return this.model.findOne(query).select(`${project ?? ''}`)
  }

  // 查找指定的一组id是否在数据库中存在，并返回不存的id
  async findNoExistIds(query: FilterQuery<T>): Promise<Array<ObjectId>> {
    return this.model.find(query).then((data) => {
      const noExistIds: Array<ObjectId> = []
      const ids = query.id ?? []
      if (Array.isArray(ids)) {
        ids.forEach((id: ObjectId) => {
          const authority = data.find((auth) => auth._id === id)
          if (!authority) noExistIds.push(id)
        })
      }

      return noExistIds
    })
  }

  /**
   * @description 根据 ID 查询单条数据
   * @param id      [string]  mongodb ObjectId 字符串
   * @param project [string]  指定返回数据中哪些字段需要过滤或需要返回
   * @returns 查找到的指定的一条数据资源, 如果没有返回null
   */
  async getOneById(id: string, project?: string): Promise<T | null> {
    return this.model.findById(id).select(`${project ?? ''}`)
  }

  /**
   * @description 根据 ID 删除单条数据
   * @param id      [string]  mongodb ObjectId 字符串
   * @returns 要删除的指定的一条数据资源, 如果没有返回null
   */
  async deleteOneById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id)
  }

  /**
   * @description 根据 ID 更新单条数据
   * @param id      [string]  mongodb ObjectId 字符串
   * @param body    [<T>]     需要更新的字段对象
   * @returns 需要更新的一条数据, 如果没有返回null
   */
  async updateOneById(id: string, body: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, body, { new: true, lean: true })
  }

  /**
   * @description 新增一条数据
   * @param body    [<T>]     需要创建数据的内容对象
   * @returns 新添加的的数据
   */
  async create(body: DocumentDefinition<T>): Promise<T> {
    return await this.model.create(body)
  }
}
