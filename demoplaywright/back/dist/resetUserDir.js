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
exports.resetUserDir = resetUserDir;
exports.createUserDirIfNotExist = createUserDirIfNotExist;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function resetUserDir() {
    return __awaiter(this, arguments, void 0, function* ({ baseDir = '.', targetDirMain = '../back/files', personFile = 'defaultdata/person.json', targetDirDefault = 'user1', } = {}) {
        const absBase = path_1.default.resolve(process.cwd(), baseDir);
        const absTarget = path_1.default.resolve(absBase, targetDirMain);
        const absPerson = path_1.default.resolve(absBase, personFile);
        const absDest = path_1.default.resolve(absBase, targetDirMain, targetDirDefault);
        const destPerson = path_1.default.join(absDest, path_1.default.basename(personFile));
        // 1) Ensure target directory exists
        yield fs_1.promises.mkdir(absTarget, { recursive: true });
        // 2) Delete all contents inside target dir (keep the dir itself)
        yield fs_1.promises.rm(absTarget, { recursive: true, force: true });
        //await fs.mkdir(absTarget, { recursive: true });
        // 3) Ensure destination directory exists
        yield fs_1.promises.mkdir(absDest, { recursive: true });
        // 4) Verify person.json exists and copy it
        yield fs_1.promises.access(absPerson); // throws if missing
        yield fs_1.promises.copyFile(absPerson, destPerson);
        return {
            emptied: absTarget,
            copiedFrom: absPerson,
            copiedTo: destPerson,
        };
    });
}
function dirExists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stat = yield fs_1.promises.stat(path);
            return stat.isDirectory();
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === 'ENOENT')
                return false; // doesn't exist
            throw err; // other errors (permissions, etc.)
        }
    });
}
function createUserDirIfNotExist(targetDirDefault) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseDir = '.';
        const targetDirMain = '../back/files';
        const personFile = 'defaultdata/person.json';
        const absBase = path_1.default.resolve(process.cwd(), baseDir);
        const absTarget = path_1.default.resolve(absBase, targetDirMain);
        const absPerson = path_1.default.resolve(absBase, personFile);
        const absDest = path_1.default.resolve(absBase, targetDirMain, targetDirDefault);
        const destPerson = path_1.default.join(absDest, path_1.default.basename(personFile));
        if (!(yield dirExists(absDest))) {
            // hello world 
            // 1) Ensure destination directory exists
            yield fs_1.promises.mkdir(absDest, { recursive: true });
            // 2) Verify person.json exists and copy it
            yield fs_1.promises.access(absPerson); // throws if missing
            yield fs_1.promises.copyFile(absPerson, destPerson);
            setTimeout(() => { }, 500);
            return {
                emptied: absTarget,
                copiedFrom: absPerson,
                copiedTo: destPerson,
            };
        }
        return undefined;
    });
}
//# sourceMappingURL=resetUserDir.js.map