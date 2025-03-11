import { Request, Response } from 'express';

export const homePage = (req: Request, res: Response) => {
  res.send('Welcome to Node.js with TypeScript!');
};
