import * as fs from 'fs';
import * as path from 'path';
import { EntityClass } from './baseclass'

/**
 * Converts an object to CSV and writes it to a file.
 * @param data - The object to convert.
 * @param filename - The name of the CSV file to create.
 */
export class exportTocsv {

    private readonly username: string;
    public constructor(userName: string) {
        this.username = userName;
    }
    private getabsolutePath(relativePath: string) {
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
                    } else {
                        console.log(`Deleted file: ${file}`);
                    }
                });
            }
        });
    }

    private writeObjectToJsonFile<T>(fileName: string, objToSave:T) {
        const filePath=this.GetFilePath(fileName);
        const dirPath = path.dirname(filePath);

        // Create directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write the file
        fs.writeFileSync(filePath, JSON.stringify(objToSave, null, 2), 'utf-8');
    }
    private GetFilePath(fileName: string) {
        return this.getabsolutePath(`\\files\\${this.username}\\${fileName}.json`);
    }

    private convertClassInstancesToJson(instances: EntityClass[]) {
        if (instances.length === 0) return "";
        var filename = instances[0].Type;
       this.writeObjectToJsonFile(filename, instances);
    }

    LoadInstances(fileName: string): EntityClass[] {
        const filePath=this.GetFilePath(fileName);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data: EntityClass[] = JSON.parse(rawData);
        return data;
    }

    LoadInstanceById(id: Number, objectName: string): EntityClass {
        const list: EntityClass[] = this.LoadInstances(objectName);

        var filteredList = list.filter(item =>
            item.Id === id
        );
        if (filteredList.length > 1) {
            throw new Error(`there are ${filteredList.length} items with id ${id}`)
        }
        if (filteredList.length == 0) {
            throw new Error(`there are no items with id ${id}`)
        }
        return filteredList[0];
    }

    addInstance(objectToAdd: EntityClass) {
        const list: EntityClass[] = this.LoadInstances(objectToAdd.Type);
        let maxId = 0;
        if (list.length > 0) {
            const ids = list.map(item => item.Id)
            maxId = Math.max(...ids);
        }
        objectToAdd.Id = maxId + 1;
        list.push(objectToAdd);
        this.convertClassInstancesToJson(list);
    }

    deleteInstance(id: number, objectName: string) {
        let list: EntityClass[] = this.LoadInstances(objectName);
        let maxId = 0;
        if (list.length > 0) {
            list = list.filter(item => item.Id !== id);
        }

        this.convertClassInstancesToJson(list);
    }

    updateInstance(objectToUpdate: EntityClass) {
        const list: EntityClass[] = this.LoadInstances(objectToUpdate.Type);
        const index = list.findIndex(item => item.Id === objectToUpdate.Id);
        list[index] = objectToUpdate;
        this.convertClassInstancesToJson(list);
    }

    save(objectToSave: EntityClass) {
        if (objectToSave.Id == 0) {
            this.addInstance(objectToSave);
        }
        else {
            this.updateInstance(objectToSave);
        }
    }
}


