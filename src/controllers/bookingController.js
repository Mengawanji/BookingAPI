import pool from '../config/database.js';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  deleteBooking,
  isBookingOwner
} from '../models/booking.js';
import { getEventById } from '../models/event.js';

export const bookEventSeats = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { seats } = req.body;
    const userId = req.user.id;
    
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // if (new Date(event.date) <= new Date()) {
    //   return res.status(400).json({ error: 'Cannot book seats for past events' });
    // }
    
    const booking = await createBooking(id, userId, parseInt(seats), client);
    
    if (booking.error) {
      return res.status(409).json({ error: booking.error });
    }
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Book event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

export const listUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;
    
    const bookings = await getUserBookings(userId, parseInt(limit), parseInt(offset));
    
    res.json({
      bookings,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: bookings.length
      }
    });
  } catch (error) {
    console.error('List bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelBooking = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const isOwner = await isBookingOwner(id, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You can only cancel your own bookings.' });
    }
    
    const result = await deleteBooking(id, client);
    
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};