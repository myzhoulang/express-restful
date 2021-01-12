import { Document, Model, UpdateQuery, DocumentDefinition, FilterQuery } from 'mongoose'

interface FilterQueryList {
  page?: number
  size?: number
  fields?: string
  sort?: string
  direction?: 'DESC' | ' ASC'
}

const service = {
  // 查询列表
  async query<T extends Document>(
    model: Model<T>,
    queries: FilterQueryList,
  ): Promise<[Array<Document<T>>, number]> {
    try {
      const { fields, sort, direction, page = 1, size = 20, ...query } = queries
      const maxSize = Math.min(size, 20)
      return await Promise.all([
        model
          .find(query)
          .skip((page - 1) * maxSize)
          .limit(maxSize)
          .sort({ [sort || 'updated_at']: direction || 'DESC' })
          .select(`${fields || ' -__v -password'}`),
        model.find(query).count(),
      ])
    } catch (error) {
      return Promise.reject({ status: 500, message: '服务器错误' })
    }
  },

  // 根据 ID 查询单个
  async getOneById<T extends Document>(
    model: Model<T>,
    id: unknown,
    fields?: string,
  ): Promise<T | null> {
    try {
      const mergeFields = `${fields || ' '} -__v -password`
      return await model.findById(id, mergeFields)
    } catch (error) {
      return Promise.reject({ status: 500, message: '服务器错误' })
    }
  },

  // 根据 ID 删除
  async deleteOneById<T extends Document>(model: Model<T>, id: string): Promise<T | null> {
    try {
      return await model.findByIdAndDelete(id)
    } catch (error) {
      return Promise.reject({ status: 500, message: '服务器错误' })
    }
  },

  // 根据 ID 更新用户
  async updateOneById<T extends Document>(
    model: Model<T>,
    id: string,
    body: UpdateQuery<T>,
  ): Promise<T | null> {
    try {
      return await model.findByIdAndUpdate(id, body, { new: true })
    } catch (error) {
      return Promise.reject({ status: 500, message: '服务器错误' })
    }
  },

  // 创建
  async create<T extends Document>(
    model: Model<T>,
    body: DocumentDefinition<T>,
  ): Promise<T | Error> {
    try {
      return await model.create(body)
    } catch (error) {
      return Promise.reject({ status: 500, message: '服务器错误' })
    }
  },
}

export default service
