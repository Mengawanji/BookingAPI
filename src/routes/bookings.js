import express from 'express';
import {
  bookEventSeats,
  listUserBookings,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, listUserBookings);
router.post('/events/:id/book', authenticate, validateBooking, bookEventSeats);
router.delete('/:id', authenticate, cancelBooking);

export default router;