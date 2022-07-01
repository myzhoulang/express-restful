import config from '../config/index'

type Body = (data: Record<string, any> | null) => Record<string, any> | null

const filterBodyField: Body = (data) => {
  if (data) {
    config.black.body.forEach((field) => {
      delete data[field]
    })
  }
  return data
}

export default { filterBodyField }
