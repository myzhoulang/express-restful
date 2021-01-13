import { promisify } from 'util'
import redis from 'redis'

const { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  db: REDIS_DB,
  password: REDIS_PASSWORD,
})

export default {
  get(key: string) {
    return promisify(client.get).bind(client)(key)
  },
  set(key: string, value: string) {
    return promisify(client.set).bind(client)(key, value)
  },
}
