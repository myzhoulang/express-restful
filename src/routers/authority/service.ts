import Authority from './schema'
import { IAuthority, IPathAndMethod, AuthorityDocument } from './typings'
import BaseRestFulService from '../../util/service/BaseRestFulService'

export default class extends BaseRestFulService<AuthorityDocument> {
  constructor() {
    super(Authority)
  }
  async getOneByTitle(title: string, project?: string): Promise<IAuthority | null> {
    return this.queryOne({ title }, project)
  }

  async getByCode(code: string, project?: string): Promise<IAuthority | null> {
    return this.queryOne({ code }, project)
  }

  async getOneByPathAndMethod(query: IPathAndMethod, project?: string): Promise<IAuthority | null> {
    return this.queryOne(query, project)
  }
}
