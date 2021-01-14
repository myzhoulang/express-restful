import service from '../../util/crud'
import Authority from './schema'
import { IAuthority, IPathAndMethod } from './typings'

export default {
  async getOneByTitle(title: string, project?: string): Promise<IAuthority | null> {
    try {
      return await service.queryOne(Authority, { title }, project)
    } catch (error) {
      throw new Error(error)
    }
  },

  async getByCode(code: string, project?: string): Promise<IAuthority | null> {
    try {
      return await service.queryOne(Authority, { code }, project)
    } catch (error) {
      throw new Error(error)
    }
  },

  async getOneByPathAndMethod(query: IPathAndMethod, project?: string): Promise<IAuthority | null> {
    try {
      return await service.queryOne(Authority, query, project)
    } catch (error) {
      throw new Error(error)
    }
  },
}
