
import express, { NextFunction, Request, Response } from 'express';
import { exportTocsv } from './exportTocsv';
import { EntityClass } from './baseclass';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createUserDirIfNotExist, resetUserDir } from './resetUserDir';
require('dotenv').config({ path: '.env.local' });

interface User {
    username: string;
    Role: string;
}

interface Login {
    username: string;
    password: string;
}


const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());


// Middleware to check for Authorization header
const checkAuthorizationHeader = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.url.toLowerCase().includes('login') || req.url.toLowerCase().includes('reset/all')) {
        next();
        return;
    }


    const authHeader = req.headers['authorization'];
    if (authHeader) {

        try {
            const decoded = jwt.verify(authHeader ?? '', process.env.JWT_SECRET!);
            if (typeof decoded === 'object' && decoded !== null && 'username' in decoded) {
                const username = (decoded as { username?: string }).username ?? '';
                req.exportInstance = new exportTocsv(username);
                // Optionally attach decoded info to request
                next();
                return;
            } else {
                res.status(403).json({ error: 'Invalid token payload' });
                return;
            }
        } catch (err) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
        }

    }
    res.status(403).json({ error: 'NO token' });
};

// Apply middleware globally
app.use(checkAuthorizationHeader);


app.get('/', (req, res) => {
    res.send('Hello from TypeScript server!');
});

app.get('/item/:objectName/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const objectName = req.params.objectName;
    res.send(JSON.stringify(req.exportInstance?.LoadInstanceById(id, objectName), null, 2))
});

app.post('/Login/',async (req, res) => {
    const loginData: Login = req.body;
    if (loginData.username.startsWith("user") && loginData.password == "welkom01") {
        const token = jwt.sign(
            { username: loginData.username, Role: "user" },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' });
            await createUserDirIfNotExist(loginData.username);
        res.status(201).send(JSON.stringify(token));
        return;
    }
    res.status(401).send({ message: "invalid user" });
});

app.get('/items/:objectName', (req, res) => {
    const objectName = req.params.objectName;
    res.send(JSON.stringify(req.exportInstance?.LoadInstances(objectName), null, 2))
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.post('/save/:objectName/', (req, res) => {
    setTimeout(() => {
        const item: EntityClass = new EntityClass(req.params.objectName);
        Object.assign(item, req.body);
        req.exportInstance?.save(item);

        res.status(200).send({ message: 'Person saved' });
    }, 200);

});

app.put('/save/:objectName/', (req, res) => {
    setTimeout(() => {
        const item: EntityClass = req.body;
        req.exportInstance?.save(item);
        res.send({ message: 'Person saved' }).status(200);
    }, 200);
});

app.delete('/delete/:objectName/:id', (req, res) => {
    req.exportInstance?.deleteInstance(parseInt(req.params.id, 10), req.params.objectName);
    res.status(200).send({ message: 'Person deleted' });
});

app.post('/reset/all', async (req, res) => {
    let succcess = false;
    let retryCount = 0;
    while (!succcess) {
        try {
            await resetUserDir();
            succcess = true;
            setTimeout(() => {
                res.status(200).send({ message: 'All data reset' });

            }, 200);
        } catch (error: Error | any) {
            retryCount++;
            console.error(`Reset attempt ${retryCount} failed: ${error.message}`);
            if (retryCount >= 3) break;
        }
    }
});