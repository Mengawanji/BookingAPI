import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import bookingRoutes from "./routes/bookings.js";

import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { createTablesAndIndexes } from "./config/init-db.js";
import { testConnection } from "./config/database.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Event Management/Booking API is running" });
});

app.use(notFound);
app.use(errorHandler);

export const initializeApp = async () => {
  try {
    await testConnection();
    await createTablesAndIndexes();
    logger.info("Database initialized successfully");
  } catch (err) {
    logger.fatal({ err }, "Database initialization failed");
    process.exit(1);
  }
};

export default app;