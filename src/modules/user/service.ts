import { filterFileds } from '../../util/response'
import User from './schema'
import { IUserQuery } from './typings'

const userService = {
  query(queries: IUserQuery) {
    const { fields, sort, direction, page, size, ...query } = queries
    return User.find(query)
      .skip((page - 1) * size)
      .limit(size)
      .sort({ [sort]: direction })
      .select(`${fields || ''} ${filterFileds}`)
  },
}

export default userService
