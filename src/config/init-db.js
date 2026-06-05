import { pool } from "./database.js";

export const createTablesAndIndexes = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (available_seats <= total_seats AND available_seats >= 0)
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        seats_booked INTEGER NOT NULL,
        booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (seats_booked > 0)
      );
    `);


    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id)`);


    // Commit transaction
    await client.query('COMMIT');
    console.log('Tables and indexes created successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables and indexes:', error.message);
  } finally {
    client.release();
  }
};