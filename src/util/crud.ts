import { Document, Model, UpdateQuery, DocumentDefinition } from 'mongoose'

const service = {
  // 查询列表
  async query<T extends Document>(
    model: Model<T>,
    queries: any,
  ): Promise<[Array<Document<T>>, number]> {
    try {
      const { fields, sort, direction, page, size, ...query } = queries
      const maxSize = Math.min(size, 20)
      return await Promise.all([
        model
          .find(query)
          .skip((page - 1) * maxSize)
          .limit(maxSize)
          .sort({ [sort]: direction })
          .select(`${fields || ' -__v -password'}`),
        model.find(query).count(),
      ])
    } catch (error) {
      throw 'Server Error'
    }
  },

  // 根据 ID 查询单个
  async getOneById<T extends Document>(
    model: Model<T>,
    id: string,
    fields: string,
  ): Promise<T | null> {
    try {
      return await model.findById(id).select(`${fields || ''} '-__v -password'`)
    } catch (error) {
      throw 'Server Error'
    }
  },

  // 根据 ID 删除
  async deleteOneById<T extends Document>(model: Model<T>, id: string): Promise<T | null> {
    try {
      return await model.findByIdAndDelete(id)
    } catch (error) {
      throw 'Server Error'
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
      throw 'Server Error'
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
      throw 'Server Error'
    }
  },
}

export default service
