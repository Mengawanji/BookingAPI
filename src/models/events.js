import pool from '../config/database.js';

export const createEvent = async (title, description, date, totalSeats, createdBy) => {
  const query = `
    INSERT INTO events (title, description, date, total_seats, available_seats, created_by) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const values = [title, description, date, totalSeats, totalSeats, createdBy];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getEvents = async (startDate, endDate, limit = 10, offset = 0) => {
  let query = 'SELECT * FROM events';
  let values = [];
  let paramCount = 0;
  
  if (startDate && endDate) {
    query += ` WHERE date BETWEEN $${++paramCount} AND $${++paramCount}`;
    values.push(startDate, endDate);
  } else if (startDate) {
    query += ` WHERE date >= $${++paramCount}`;
    values.push(startDate);
  } else if (endDate) {
    query += ` WHERE date <= $${++paramCount}`;
    values.push(endDate);
  }
  
  query += ` ORDER BY date LIMIT $${++paramCount} OFFSET $${++paramCount}`;
  values.push(limit, offset);
  
  const result = await pool.query(query, values);
  return result.rows;
};

export const getEventById = async (id) => {
  const query = `
    SELECT e.*, 
           COALESCE(SUM(b.seats_booked), 0) as booked_seats
    FROM events e
    LEFT JOIN bookings b ON e.id = b.event_id
    WHERE e.id = $1
    GROUP BY e.id
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateEvent = async (id, updates) => {
  const { title, description, date, total_seats } = updates;
  const query = `
    UPDATE events 
    SET title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        date = COALESCE($3, date), 
        total_seats = COALESCE($4, total_seats),
        available_seats = COALESCE($5, available_seats)
    WHERE id = $6 
    RETURNING *
  `;
  
  const event = await getEventById(id);
  const newAvailableSeats = total_seats 
    ? event.available_seats + (total_seats - event.total_seats) 
    : event.available_seats;
  
  const values = [title, description, date, total_seats, newAvailableSeats, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const isEventOwner = async (eventId, userId) => {
  const query = 'SELECT created_by FROM events WHERE id = $1';
  const result = await pool.query(query, [eventId]);
  return result.rows[0]?.created_by === userId;
};