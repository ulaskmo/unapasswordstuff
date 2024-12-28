import Joi from 'joi';
import { ObjectId } from 'mongodb';

export interface User {
  name: string;
  phonenumber: string;
  email: string;
  id?: ObjectId;
  dateJoined?: Date;
  lastUpdated?: Date;
  password?: string;
  hashedPassword?: string;
}

export const ValidateUser = (user: User) => {
  const schema = Joi.object<User>({
    name: Joi.string().min(3).required(),
    phonenumber: Joi.string().min(10).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
  });

  return schema.validate(user);
};
