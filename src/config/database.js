import pg from 'pg';
const {Pool} = pg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool ( {
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) 
});

export default pool;


// Test connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export { pool, testConnection };