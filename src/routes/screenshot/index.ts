import { Request, Response } from 'express';
import { getMeta } from '../../lib/meta';
import Container = global.Container;

export default ({ browser }: Container) => {
    return async (req: Request, res: Response) => {
        const page = await browser.newPage();
        res.status(200).send(await getMeta(page, 'http://bitempest.com'));
        await page.close();
    };
};
