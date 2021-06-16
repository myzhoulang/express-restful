import * as http from 'http'
import mongoose, { ConnectOptions } from 'mongoose'
export function connect(opts?: ConnectOptions) {
  const { DB_URL, DB_DATABASE } = process.env
  const mongodbUrl = `${DB_URL}/${DB_DATABASE}`

  const mongodbOptions: ConnectOptions = Object.assign(
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    },
    opts,
  )
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

export const timestamps = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
