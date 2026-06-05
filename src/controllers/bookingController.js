import pool from "../config/database.js";
import {
  createBooking,
  getUserBookings,
  deleteBooking,
  isBookingOwner,
} from "../models/booking.js";
import { getEventById } from "../models/event.js";
import logger from "../config/logger.js";

const createErrorResponse = (status, message, code) => ({
  error: { code, message, status },
});

export const bookEventSeats = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { seats } = req.body;
    const userId = req.user.id;

    const event = await getEventById(id);
    if (!event) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Event not found", "NOT_FOUND"));
    }

    if (new Date(event.date) <= new Date()) {
      return res
        .status(400)
        .json(createErrorResponse(400, "Cannot book seats for past events", "VALIDATION_ERROR"));
    }

    const booking = await createBooking(id, userId, parseInt(seats), client);

    if (booking.error) {
      return res
        .status(409)
        .json(createErrorResponse(409, booking.error, "CONFLICT"));
    }

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    logger.error({ error, eventId: req.params.id, userId: req.user.id }, "Book event error");
    next(error);
  } finally {
    client.release();
  }
};

export const listUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const bookings = await getUserBookings(userId, parseInt(limit), parseInt(offset));

    res.json({
      bookings,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: bookings.length,
      },
    });
  } catch (error) {
    logger.error({ error, userId: req.user.id }, "List bookings error");
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await getBookingById(id);
    if (!booking) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Booking not found", "NOT_FOUND"));
    }

    const isOwner = await isBookingOwner(id, userId);
    if (!isOwner) {
      return res
        .status(403)
        .json(createErrorResponse(403, "You can only cancel your own bookings", "FORBIDDEN"));
    }

    const result = await deleteBooking(id, client);

    if (result.error) {
      return res
        .status(404)
        .json(createErrorResponse(404, result.error, "NOT_FOUND"));
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    logger.error({ error, bookingId: req.params.id, userId: req.user.id }, "Cancel booking error");
    next(error);
  } finally {
    client.release();
  }
};