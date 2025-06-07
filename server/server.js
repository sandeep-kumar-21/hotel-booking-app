import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import ConnectDB from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'

const app = express()
const port = process.env.PORT || 4000

ConnectDB();
app.use(cors())

// MiddleWare
app.use(express.json())
app.use(clerkMiddleware())

// API to listen to Clerk Webhooks
app.use('/api/clerk', clerkWebhooks)

app.get('/', (req, res) => {
  res.send('API is working!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
