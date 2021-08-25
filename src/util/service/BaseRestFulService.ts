import { Model, UpdateQuery, DocumentDefinition, FilterQuery, ObjectId, Document } from 'mongoose'

interface FilterQueryList {
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
        .select(`${project ?? ''} -password`),
      this.model.find(query).count(),
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

  // 根据 ID 查询单个
  async getOneById(id: unknown, project?: string): Promise<T | null> {
    return this.model
      .findById(id)
      .populate('authority_ids', '_id title')
      .then((data) => {
        return data
      })
    //.select(`${project ?? ''}`)
  }

  // 根据 ID 删除
  async deleteOneById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id)
  }

  // 根据 ID 更新用户
  async updateOneById(id: string, body: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, body, { new: true, lean: true })
  }

  // 创建
  async create(body: DocumentDefinition<T>): Promise<T> {
    return await this.model.create(body)
  }
}
