import { Request, Response } from 'express';
import Container = global.Container;

export default ({ screenshot }: Container) => {
  return async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
      return res.status(422).send({ message: 'An url attribute is expected.' });
    }

    res.status(200).send(
      await screenshot.process(url)
    );
  };
};
