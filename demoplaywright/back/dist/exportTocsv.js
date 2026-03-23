"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTocsv = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Converts an object to CSV and writes it to a file.
 * @param data - The object to convert.
 * @param filename - The name of the CSV file to create.
 */
class exportTocsv {
    constructor(userName) {
        this.username = userName;
    }
    getabsolutePath(relativePath) {
        return path.join(__dirname, '..', relativePath);
    }
    deleteAllFiles() {
        fs.readdir(this.getabsolutePath(`\\files\\${this.username}\\`), (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
            for (const file of files) {
                fs.unlink(this.getabsolutePath(`\\files\\${file}.json`), (err) => {
                    if (err) {
                        console.error(`Error deleting file ${file}:`, err);
                    }
                    else {
                        console.log(`Deleted file: ${file}`);
                    }
                });
            }
        });
    }
    writeObjectToJsonFile(fileName, objToSave) {
        const filePath = this.GetFilePath(fileName);
        const dirPath = path.dirname(filePath);
        // Create directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        // Write the file
        fs.writeFileSync(filePath, JSON.stringify(objToSave, null, 2), 'utf-8');
    }
    GetFilePath(fileName) {
        return this.getabsolutePath(`\\files\\${this.username}\\${fileName}.json`);
    }
    convertClassInstancesToJson(instances) {
        if (instances.length === 0)
            return "";
        var filename = instances[0].Type;
        this.writeObjectToJsonFile(filename, instances);
    }
    LoadInstances(fileName) {
        const filePath = this.GetFilePath(fileName);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        return data;
    }
    LoadInstanceById(id, objectName) {
        const list = this.LoadInstances(objectName);
        var filteredList = list.filter(item => item.Id === id);
        if (filteredList.length > 1) {
            throw new Error(`there are ${filteredList.length} items with id ${id}`);
        }
        if (filteredList.length == 0) {
            throw new Error(`there are no items with id ${id}`);
        }
        return filteredList[0];
    }
    addInstance(objectToAdd) {
        const list = this.LoadInstances(objectToAdd.Type);
        let maxId = 0;
        if (list.length > 0) {
            const ids = list.map(item => item.Id);
            maxId = Math.max(...ids);
        }
        objectToAdd.Id = maxId + 1;
        list.push(objectToAdd);
        this.convertClassInstancesToJson(list);
    }
    deleteInstance(id, objectName) {
        let list = this.LoadInstances(objectName);
        let maxId = 0;
        if (list.length > 0) {
            list = list.filter(item => item.Id !== id);
        }
        this.convertClassInstancesToJson(list);
    }
    updateInstance(objectToUpdate) {
        const list = this.LoadInstances(objectToUpdate.Type);
        const index = list.findIndex(item => item.Id === objectToUpdate.Id);
        list[index] = objectToUpdate;
        this.convertClassInstancesToJson(list);
    }
    save(objectToSave) {
        if (objectToSave.Id == 0) {
            this.addInstance(objectToSave);
        }
        else {
            this.updateInstance(objectToSave);
        }
    }
}
exports.exportTocsv = exportTocsv;
//# sourceMappingURL=exportTocsv.js.map