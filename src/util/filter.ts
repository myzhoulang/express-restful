import config from '../config/index'

interface IObj {
  [key: string]: any
}

function body(body: IObj) {
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
