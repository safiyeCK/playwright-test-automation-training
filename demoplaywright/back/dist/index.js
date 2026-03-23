"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exportTocsv_1 = require("./exportTocsv");
const baseclass_1 = require("./baseclass");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const resetUserDir_1 = require("./resetUserDir");
require('dotenv').config({ path: '.env.local' });
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Middleware to check for Authorization header
const checkAuthorizationHeader = (req, res, next) => {
    var _a;
    if (req.url.toLowerCase().includes('login') || req.url.toLowerCase().includes('reset/all')) {
        next();
        return;
    }
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        try {
            const decoded = jsonwebtoken_1.default.verify(authHeader !== null && authHeader !== void 0 ? authHeader : '', process.env.JWT_SECRET);
            if (typeof decoded === 'object' && decoded !== null && 'username' in decoded) {
                const username = (_a = decoded.username) !== null && _a !== void 0 ? _a : '';
                req.exportInstance = new exportTocsv_1.exportTocsv(username);
                // Optionally attach decoded info to request
                next();
                return;
            }
            else {
                res.status(403).json({ error: 'Invalid token payload' });
                return;
            }
        }
        catch (err) {
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
    var _a;
    const id = parseInt(req.params.id, 10);
    const objectName = req.params.objectName;
    res.send(JSON.stringify((_a = req.exportInstance) === null || _a === void 0 ? void 0 : _a.LoadInstanceById(id, objectName), null, 2));
});
app.post('/Login/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = req.body;
    if (loginData.username.startsWith("user") && loginData.password == "welkom01") {
        const token = jsonwebtoken_1.default.sign({ username: loginData.username, Role: "user" }, process.env.JWT_SECRET, { expiresIn: '1h' });
        yield (0, resetUserDir_1.createUserDirIfNotExist)(loginData.username);
        res.status(201).send(JSON.stringify(token));
        return;
    }
    res.status(401).send({ message: "invalid user" });
}));
app.get('/items/:objectName', (req, res) => {
    var _a;
    const objectName = req.params.objectName;
    res.send(JSON.stringify((_a = req.exportInstance) === null || _a === void 0 ? void 0 : _a.LoadInstances(objectName), null, 2));
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.post('/save/:objectName/', (req, res) => {
    setTimeout(() => {
        var _a;
        const item = new baseclass_1.EntityClass(req.params.objectName);
        Object.assign(item, req.body);
        (_a = req.exportInstance) === null || _a === void 0 ? void 0 : _a.save(item);
        res.status(200).send({ message: 'Person saved' });
    }, 200);
});
app.put('/save/:objectName/', (req, res) => {
    setTimeout(() => {
        var _a;
        const item = req.body;
        (_a = req.exportInstance) === null || _a === void 0 ? void 0 : _a.save(item);
        res.send({ message: 'Person saved' }).status(200);
    }, 200);
});
app.delete('/delete/:objectName/:id', (req, res) => {
    var _a;
    (_a = req.exportInstance) === null || _a === void 0 ? void 0 : _a.deleteInstance(parseInt(req.params.id, 10), req.params.objectName);
    res.status(200).send({ message: 'Person deleted' });
});
app.post('/reset/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let succcess = false;
    let retryCount = 0;
    while (!succcess) {
        try {
            yield (0, resetUserDir_1.resetUserDir)();
            succcess = true;
            setTimeout(() => {
                res.status(200).send({ message: 'All data reset' });
            }, 200);
        }
        catch (error) {
            retryCount++;
            console.error(`Reset attempt ${retryCount} failed: ${error.message}`);
            if (retryCount >= 3)
                break;
        }
    }
}));
//# sourceMappingURL=index.js.map