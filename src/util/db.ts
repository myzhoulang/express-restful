import * as http from 'http'
import mongoose, { ConnectOptions } from 'mongoose'
export function connect(opts?: ConnectOptions) {
  const { DB_URL, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT } = process.env

  const mongodbUrl = `mongodb://${DB_URL}:${DB_PORT}`

  const defaultMongodbOpt: ConnectOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: DB_USER,
    pass: DB_PASSWORD,
    dbName: DB_DATABASE,
    authSource: 'admin',
  }

  const mongodbOptions: ConnectOptions = Object.assign(defaultMongodbOpt, opts)
  mongoose
    .connect(mongodbUrl, mongodbOptions)
    .then(() => console.log('mongodb ok'))
    .catch((e) => {
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

export function gracefulShutdown(app: http.Server) {
  mongoose.connection.close(false, () => {
    app.close(() => {
      process.exit()
    })
  })
}

mongoose.set('toJSON', { useProjection: true })

export const timestamps = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
