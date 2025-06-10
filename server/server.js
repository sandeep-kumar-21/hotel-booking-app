import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import ConnectDB from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import userRouter from './routes/userRoutes.js'
import hotelRouter from './routes/hotelRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import roomRouter from './routes/roomRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'

const app = express()
const port = process.env.PORT || 4000

ConnectDB();
connectCloudinary();

// MiddleWare
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// API to listen to Clerk Webhooks
app.use('/api/clerk', clerkWebhooks)

app.get('/', (req, res) => {
  res.send('API is working!')
})
app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings', bookingRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})