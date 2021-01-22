import { config } from 'dotenv'
import { getApp } from './app'
import { gracefulShutdown } from './util/db'

config()
const startServer = () => {
  try {
    const { PORT } = process.env
    const app = getApp()
    const server = app.listen(PORT, () => {
      // Handle kill commands
      process.on('SIGTERM', () => gracefulShutdown(server))

      // Prevent dirty exit on code-fault crashes:
      process.on('uncaughtException', () => gracefulShutdown(server))

      // Prevent promise rejection exits
      process.on('unhandledRejection', () => gracefulShutdown(server))

      console.log(`server started at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}
startServer()
