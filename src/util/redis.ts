import { promisify } from 'util'
import redis from 'redis'

let client: redis.RedisClient

export function redisInit(): redis.RedisClient {
  const { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env

  client = redis.createClient({
    // docker-componse
    // host: 'redis',
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    db: REDIS_DB,
    password: REDIS_PASSWORD,
  })

  client.on('connect', () => {
    console.log(`redis ok`)
  })
  client.on('error', function (err) {
    console.error('redis', err)
  })
  return client
}

export default {
  get(key: string): Promise<string | null> {
    return promisify(client.get).bind(client)(key)
  },
  set(key: string, value: string): Promise<unknown> {
    return promisify(client.set).bind(client)(key, value)
  },
}
