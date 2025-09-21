import express from 'express';
import {
  createNewEvent,
  listEvents,
  getEvent,
  updateEventDetails
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';
import { validateEvent } from '../middleware/validation.js';

const router = express.Router();

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, validateEvent, createNewEvent);
router.put('/:id', authenticate, updateEventDetails);

export default router;