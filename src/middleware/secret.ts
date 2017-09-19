import { Request, Response, NextFunction } from 'express';

export default (secret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.secret !== secret && req.query.secret !== secret) {
      res.status(403).json({ message: 'You need to provide the api key.' });
      return;
    }
    next();
  };
};
