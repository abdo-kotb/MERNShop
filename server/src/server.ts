import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'

import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler, notFound } from './middelwares/errorMiddleware.js'
import path from 'path'

colors.enable()

dotenv.config()

connectDB()

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API running...')
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(
    `Server running in "${process.env.NODE_ENV} mode" on port ${PORT}`.yellow
      .bold
  )
)
