import User from './schema'
import { UserDocument } from './typings'
import BaseService from '../../util/service/BaseRestFulService'
import RoleService from '../role/service'
import { IRole } from '../role/typings'

const roleService = new RoleService()

export default class extends BaseService<UserDocument> {
  constructor() {
    super(User)
  }
  /**
   * 根据用户邮箱查询一条用户数据
   * @param email 用户邮箱
   * @param project 投影字段映射
   * @returns mongo 文档 或者 null
   */
  async getByEmail(email: string, project?: string): Promise<UserDocument | null> {
    return this.queryOne({ email }, project)
  }

  /**
   * 根据用户手机号查询一条用户数据
   * @param phone 用户手机号
   * @param project 投影字段映射
   * @returns mongo 文档 或者 null
   */
  async getByPhone(phone: string, project?: string): Promise<UserDocument | null> {
    return this.queryOne({ phone }, project)
  }

  /**
   * 根据用户 id 获取用户所拥有的权限
   * @param userId
   * @returns 用户对应的权限code
   */
  async getUserAuthCodes(userId: string): Promise<Array<string>> {
    return this.getOneById( userId )
      .then((user) => {
        if (user && user.role_ids) {
          return roleService.getAuthorityByRoleIds(user?.role_ids)
        }
        return []
      })
      .then((auth) => {
        return auth?.flat(1).map((item: IRole) => item.code)
      })
  }

  /**
   * 获取用户信息会将 role_ids 中对应的角色信息联表查询出来
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getUserPopulateRole(userId: string): Promise<UserDocument | null> {
    return this.model.findById({ _id: userId }).populate({
      path: 'roles',
      select: 'title',
    })
  }
}
