import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as dotEnv from 'dotenv';
import api from './routes';
import secretMiddleware from './middleware/secret';

dotEnv.config();

export default () => {
    const app = express();

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    app.use('/api/v1', secretMiddleware('secret'), api({}));

    const server = app.listen(5000, () => {
        console.log(`Server started listening on port: ${5000}.`);
    });

    const close = async (callback = () => {}) => {
        server.close(callback);
    };

    return { server, close };
};
