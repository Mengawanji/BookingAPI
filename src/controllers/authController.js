import { hashPassword, verifyPassword } from '../utils/crypto.js';
import { generateToken } from '../utils/jwt.js';
import { createUser, findUserByEmail } from '../models/user.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password and create user
    const passwordHash = hashPassword(password);
    const user = await createUser(username, email, passwordHash);
    
    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = generateToken({ id: user.id, email: user.email });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};