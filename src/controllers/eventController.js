import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  isEventOwner,
} from "../models/event.js";
import logger from "../config/logger.js";

const createErrorResponse = (status, message, code) => ({
  error: { code, message, status },
});

export const createNewEvent = async (req, res, next) => {
  try {
    const { title, description, date, total_seats } = req.body;
    const createdBy = req.user.id;

    const event = await createEvent(title, description, date, total_seats, createdBy);

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    logger.error({ error, userId: req.user.id }, "Create event error");
    next(error);
  }
};

export const listEvents = async (req, res, next) => {
  try {
    const { start, end, limit = 10, offset = 0 } = req.query;

    const events = await getEvents(start, end, parseInt(limit), parseInt(offset));

    res.json({
      events,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: events.length,
      },
    });
  } catch (error) {
    logger.error({ error }, "List events error");
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await getEventById(id);
    if (!event) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Event not found", "NOT_FOUND"));
    }

    res.json({ event });
  } catch (error) {
    logger.error({ error, eventId: req.params.id }, "Get event error");
    next(error);
  }
};

export const updateEventDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await getEventById(id);
    if (!event) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Event not found", "NOT_FOUND"));
    }

    const isOwner = await isEventOwner(id, req.user.id);
    if (!isOwner) {
      return res
        .status(403)
        .json(createErrorResponse(403, "You can only update your own events", "FORBIDDEN"));
    }

    const bookedSeats = event.total_seats - event.available_seats;
    if (updates.total_seats && updates.total_seats < bookedSeats) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            400,
            `Cannot reduce total seats below ${bookedSeats} (already booked seats)`,
            "VALIDATION_ERROR"
          )
        );
    }

    const updatedEvent = await updateEvent(id, updates);

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    logger.error({ error, eventId: req.params.id, userId: req.user.id }, "Update event error");
    next(error);
  }
};