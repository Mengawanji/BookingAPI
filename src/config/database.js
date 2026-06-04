import pg from 'pg';
const {Pool} = pg;
import dotenv from 'dotenv';
import logger from "./config/logger.js";

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
    logger.info("Database connected successfully");
    client.release();
  } catch (error) {
    logger.fatal({ error }, "Database connection failed");
    process.exit(1);
  }
};

export { pool, testConnection };