import * as PromiseRouter from 'express-promise-router';

export default (opts: any) => {
    const router = PromiseRouter();

    router.get('/', async (req: any, res: any) => {
        res.send('Hello!');
    });

    return router;
};
