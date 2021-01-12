import Authority from './schema'
import { IAuthority } from './typings'

export const filterFileds = '-__v'

const service = {
  async getOneByTitle(title: string, fields?: string): Promise<IAuthority> {
    try {
      return await Authority.getOneByTitle(title).select(`${fields || ''} ${filterFileds}`)
    } catch (error) {
      throw 'Server Error'
    }
  },

  async getByCode(code: string, fields?: string): Promise<IAuthority> {
    try {
      return await Authority.getOneByCode(code).select(`${fields || ''} ${filterFileds}`)
    } catch (error) {
      throw 'Server Error'
    }
  },
}

export default service
