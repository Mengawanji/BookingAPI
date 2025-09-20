export const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  
  next();
};

export const validateEvent = (req, res, next) => {
  const { title, description, date, total_seats } = req.body;
  
  if (!title || !date || !total_seats) {
    return res.status(400).json({ error: 'Title, date, and total_seats are required.' });
  }
  
  if (new Date(date) <= new Date()) {
    return res.status(400).json({ error: 'Event date must be in the future.' });
  }
  
  if (total_seats <= 0) {
    return res.status(400).json({ error: 'Total seats must be a positive number.' });
  }
  
  next();
};

export const validateBooking = (req, res, next) => {
  const { seats } = req.body;
  
  if (!seats || seats <= 0) {
    return res.status(400).json({ error: 'Seats must be a positive number.' });
  }
  
  next();
};