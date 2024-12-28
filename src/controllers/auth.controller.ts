import { Request, Response } from 'express';
import { usersCollection } from '../database';
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';
import { User } from '../models/user';

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user || !(await argon2.verify(user.hashedPassword!, password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwtSign(
      { email: user.email, name: user.name },
      process.env.JWTSECRET || 'default_secret',
      { expiresIn: process.env.JWTEXPIRES || '5m' }
    );

    res.status(200).json({ accessToken: token });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login error:', error.message);
    } else {
      console.error('Unexpected error during login:', error);
    }
    res.status(500).json({ message: 'Internal server error during login' });
  }
};
