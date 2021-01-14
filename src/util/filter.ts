import { IObjectAny } from 'src/typings'
import config from '../config/index'

function body(body: IObjectAny) {
  if (body) {
    config.black.body.forEach((field: string) => {
      delete body[field]
    })
  }

  return JSON.stringify(body)
}

export default {
  body,
}
