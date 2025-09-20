import pool from '../config/database.js';

export const createBooking = async (eventId, userId, seats, client) => {
  try {
    await client.query('BEGIN');
    
    const eventQuery = 'SELECT available_seats FROM events WHERE id = $1 FOR UPDATE';
    const eventResult = await client.query(eventQuery, [eventId]);
    const availableSeats = eventResult.rows[0]?.available_seats;
    
    if (!availableSeats || availableSeats < seats) {
      await client.query('ROLLBACK');
      return { error: 'Not enough available seats' };
    }
    
    const bookingQuery = `
      INSERT INTO bookings (event_id, user_id, seats_booked) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const bookingValues = [eventId, userId, seats];
    const bookingResult = await client.query(bookingQuery, bookingValues);
    
    const updateEventQuery = `
      UPDATE events 
      SET available_seats = available_seats - $1 
      WHERE id = $2
    `;
    await client.query(updateEventQuery, [seats, eventId]);
    
    await client.query('COMMIT');
    return bookingResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

export const getUserBookings = async (userId, limit = 10, offset = 0) => {
  const query = `
    SELECT b.*, e.title as event_title, e.date as event_date
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.user_id = $1
    ORDER BY b.booked_at DESC
    LIMIT $2 OFFSET $3
  `;
  const values = [userId, limit, offset];
  const result = await pool.query(query, values);
  return result.rows;
};

export const getBookingById = async (id) => {
  const query = 'SELECT * FROM bookings WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const deleteBooking = async (bookingId, client) => {
  try {
    await client.query('BEGIN');
    
    const bookingQuery = 'SELECT * FROM bookings WHERE id = $1 FOR UPDATE';
    const bookingResult = await client.query(bookingQuery, [bookingId]);
    const booking = bookingResult.rows[0];
    
    if (!booking) {
      await client.query('ROLLBACK');
      return { error: 'Booking not found' };
    }
    
    const deleteQuery = 'DELETE FROM bookings WHERE id = $1';
    await client.query(deleteQuery, [bookingId]);
    
    const updateEventQuery = `
      UPDATE events 
      SET available_seats = available_seats + $1 
      WHERE id = $2
    `;
    await client.query(updateEventQuery, [booking.seats_booked, booking.event_id]);
    
    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

export const isBookingOwner = async (bookingId, userId) => {
  const query = 'SELECT user_id FROM bookings WHERE id = $1';
  const result = await pool.query(query, [bookingId]);
  return result.rows[0]?.user_id === userId;
};