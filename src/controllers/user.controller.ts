import { Request, Response } from 'express';
import { usersCollection } from '../database';
import * as argon2 from 'argon2';
import { ValidateUser, User } from '../models/user';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phonenumber } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Missing required fields: name, email, or password' });
      return;
    }

    const validation = ValidateUser(req.body);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const newUser: User = {
      name,
      email,
      phonenumber,
      hashedPassword,
      dateJoined: new Date(),
      lastUpdated: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('User creation error:', error.message);
    } else {
      console.error('Unexpected error during user creation:', error);
    }
    res.status(500).json({ message: 'Internal server error during user creation' });
  }
};
