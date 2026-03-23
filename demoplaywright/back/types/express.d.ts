
import { Request } from 'express';
import { exportTocsv } from '../src/exportTocsv';

declare module 'express-serve-static-core' {
    interface Request {
        exportInstance?: exportTocsv;
    }
}
