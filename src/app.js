import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import bookRoutes from './routes/books.routes.js'
config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DB_NAME
})
const db = mongoose.connection

app.use('/books', bookRoutes)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`escuchando en el puerto http://localhost:${PORT}`)
})
