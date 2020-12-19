import { config } from 'dotenv'
import { getApp } from './app'

config()
const startServer = () => {
  try {
    const { PORT } = process.env
    const app = getApp()
    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}
startServer()
