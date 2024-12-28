import { Request, Response, NextFunction } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';

export const validJWTProvided = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwtVerify(token, process.env.JWTSECRET!); // Use the secret key to verify
    res.locals.payload = payload;
    next();
  } catch {
    return res.status(403).send('Forbidden');
  }
};
