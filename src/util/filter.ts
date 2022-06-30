import config from '../config/index'

const body = <T>(body: T):string => {
  if (body) {
    config.black.body.forEach((field) => {
      delete body[field]
    })
  }

  return JSON.stringify(body)
};

export default {
  body,
}
