import { Document, Model } from 'mongoose'

const service = {
  async query<T>(model: Model<Document<T>>, queries: any): Promise<[Array<Document<T>>, number]> {
    try {
      const { fields, sort, direction, page, size, ...query } = queries
      const maxSize = Math.min(size, 20)
      return await Promise.all([
        model
          .find(query)
          .skip((page - 1) * maxSize)
          .limit(maxSize)
          .sort({ [sort]: direction })
          .select(`${fields || ''}`),
        model.find(query).count(),
      ])
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default service
