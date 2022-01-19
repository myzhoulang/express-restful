import Authority from './schema'
import { IAuthority, IPathAndMethod, AuthorityDocument } from './typings'
import BaseRestFulService from '../../util/service/BaseRestFulService'

export default class extends BaseRestFulService<AuthorityDocument> {
  constructor() {
    super(Authority)
  }
  /**
   * @description 根据标题查找一条权限资源数据
   * @param title  标题名称
   * @param project 指定返回数据中哪些字段需要过滤或需要返回
   * @returns 查找到的一条权限资源数据, 如果没有返回null
   */
  async getOneByTitle(title: string, project?: string): Promise<IAuthority | null> {
    return this.queryOne({ title }, project)
  }
  /**
   * @description 根据code查找一条权限资源数据
   * @param code  权限资源code
   * @param project 指定返回数据中哪些字段需要过滤或需要返回
   * @returns 查找到的一条权限资源数据, 如果没有返回null
   */
  async getByCode(code: string, project?: string): Promise<IAuthority | null> {
    return this.queryOne({ code }, project)
  }
  /**
   * @description 根据path、method、type 查找一条数据
   * @param query   包含 path、method、type的对象
   * @param project 指定返回数据中哪些字段需要过滤或需要返回
   * @returns 查找到的一条权限资源数据, 如果没有返回null
   */
  async getOneByPathAndMethod(query: IPathAndMethod, project?: string): Promise<IAuthority | null> {
    return this.queryOne(query, project)
  }
}
