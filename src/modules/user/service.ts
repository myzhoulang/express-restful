import { filterFileds } from '../../util/response'
import User from './schema'
import { IUserQuery } from './type.d'

const userService = {
  query(querys: IUserQuery) {
    const { fileds, sort, direction, page, size, ...query } = querys
    return User.find(query)
      .skip((page - 1) * size)
      .limit(size)
      .sort({ [sort]: direction })
      .select(`${fileds || ''} ${filterFileds}`)
  },
}

export default userService
