import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  isEventOwner
} from '../models/event.js';

export const createNewEvent = async (req, res) => {
  try {
    const { title, description, date, total_seats } = req.body;
    const createdBy = req.user.id;
    
    const event = await createEvent(title, description, date, total_seats, createdBy);
    
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listEvents = async (req, res) => {
  try {
    const { start, end, limit = 10, offset = 0 } = req.query;
    
    const events = await getEvents(start, end, parseInt(limit), parseInt(offset));
    
    res.json({
      events,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: events.length
      }
    });
  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const isOwner = await isEventOwner(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied. You can only update your own events.' });
    }
    
    if (updates.total_seats && updates.total_seats < (event.total_seats - event.available_seats)) {
      return res.status(400).json({ 
        error: `Cannot reduce total seats below ${event.total_seats - event.available_seats} (already booked seats)` 
      });
    }
    
    const updatedEvent = await updateEvent(id, updates);
    
    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};