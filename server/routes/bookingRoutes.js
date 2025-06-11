import express from 'express'
import { checkAvailabiltyAPI, createBooking, getUserBookings, getHotelBookings, stripePayment} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabiltyAPI)
bookingRouter.post('/book', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/hotel', protect, getHotelBookings)

bookingRouter.post('/stripe-payment/',protect,stripePayment)
export default bookingRouter