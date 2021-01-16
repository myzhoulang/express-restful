import Authority from './schema'
import { IAuthority, IPathAndMethod, AuthorityDocument } from './typings'
import BaseService from '../../util/BaseService'

export default class extends BaseService<AuthorityDocument> {
  constructor() {
    super(Authority)
  }
  async getOneByTitle(title: string, project?: string): Promise<IAuthority | null> {
    try {
      return await this.queryOne({ title }, project)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getByCode(code: string, project?: string): Promise<IAuthority | null> {
    try {
      return await this.queryOne({ code }, project)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getOneByPathAndMethod(query: IPathAndMethod, project?: string): Promise<IAuthority | null> {
    try {
      return await this.queryOne(query, project)
    } catch (error) {
      throw new Error(error)
    }
  }
}
