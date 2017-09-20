import { Request, Response } from 'express';
import Container = global.Container;

export default ({ screenshot }: Container) => {
  return async (req: Request, res: Response) => {
    const meta = await screenshot.process('http://bitempest.com');
    res.send(meta);
  };
};
