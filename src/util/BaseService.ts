import { Document, Model, UpdateQuery, DocumentDefinition, FilterQuery } from 'mongoose'

interface FilterQueryList {
  page?: number
  size?: number
  project?: string
  sort?: string
  direction?: 'DESC' | ' ASC'
}

export default class BaseService<T extends Document> {
  model: Model<T>
  constructor(model: Model<T>) {
    this.model = model
  }
  async query(queries: FilterQueryList): Promise<[Array<T>, number]> {
    try {
      const { project, sort, direction, page = 1, size = 20, ...query } = queries
      const maxSize = Math.min(size, 20)
      return await Promise.all([
        this.model
          .find(query)
          .skip((page - 1) * maxSize)
          .limit(maxSize)
          .sort({ [sort || 'updated_at']: direction || 'DESC' })
          .select(`${project ?? ''} -__v -password`),
        this.model.find(query).count(),
      ])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 查单个
  async queryOne(query: FilterQuery<T>, project?: string | undefined): Promise<T | null> {
    try {
      return await this.model.findOne(query).select(`${project ?? ''} -__v -password`)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 根据 ID 查询单个
  async getOneById(id: unknown, project?: string): Promise<T | null> {
    try {
      return await this.model.findById(id).select(`${project ?? ''} -__v -password`)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 根据 ID 删除
  async deleteOneById(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 根据 ID 更新用户
  async updateOneById(id: string, body: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, body, { new: true })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 创建
  async create(body: DocumentDefinition<T>): Promise<T | Error> {
    try {
      return await this.model.create(body)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
