import * as PromiseRouter from 'express-promise-router';
import screenshot from './screenshot';
import { Container } from '../container';

export default (opts: Container) => {
  const router = PromiseRouter();

  router.get('/health', async (req: any, res: any): Promise<void> =>
    res.send('Hello!'),
  );
  router.post('/screenshot', screenshot(opts));

  return router;
};
