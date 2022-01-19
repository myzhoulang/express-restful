import * as http from 'http'
import mongoose, { ConnectOptions } from 'mongoose'

export function connect(opts?: ConnectOptions): void {
  const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_AUTHSOURCE, DB_PORT, DB_URL } = process.env

  // docker-componse
  // const mongodbUrl = `mongodb://mongo:${DB_PORT}`

  const mongodbUrl = `mongodb://${DB_URL}:${DB_PORT}`

  const defaultMongodbOpt: ConnectOptions = {
    // 不开启认证的情况下不要用以下配置
    // user: DB_USER,
    // pass: DB_PASSWORD,
    // authSource: DB_AUTHSOURCE,

    dbName: DB_DATABASE,
  }

  const mongodbOptions: ConnectOptions = Object.assign(defaultMongodbOpt, opts)

  mongoose
    .connect(mongodbUrl, mongodbOptions)
    .then(() => console.log('mongodb ok'))
    .catch((e) => {
      console.log('mongodb error', e)
      throw new Error(e)
    })

  process.on('exit', (code) => {
    mongoose.connection.close()
    console.log(`About to exit with code: ${code}`)
  })

  process.on('SIGINT', () => {
    console.log('Caught interrupt signal')
    process.exit()
  })
}

export function gracefulShutdown(app: http.Server): void {
  mongoose.connection.close(false, () => {
    app.close(() => {
      process.exit()
    })
  })
}

// mongoose.set('toJSON', { useProjection: true })

export const timestamps = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
