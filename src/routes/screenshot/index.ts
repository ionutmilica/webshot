import { Request, Response } from 'express';
import { Container } from '../../container';

export default ({ webShot }: Container) => {
  return async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
      return res.status(422).send({ message: 'An url attribute is expected.' });
    }

    try {
      res.status(200).send(await webShot.process(url));
    } catch {
      res.status(404).send({ message: 'Site not found.' });
    }
  };
};
