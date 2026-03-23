import { promises as fs } from 'fs';
import path from 'path';

type Options = {
  baseDir?: string;
  targetDirMain?: string;
  targetDirDefault?: string;
  personFile?: string;
  destDir?: string;
};

export async function resetUserDir({
  baseDir = '.',
  targetDirMain = '../back/files',

  personFile = 'defaultdata/person.json',
  targetDirDefault = 'user1',
}: Options = {}) {
  const absBase = path.resolve(process.cwd(), baseDir);
  const absTarget = path.resolve(absBase, targetDirMain);
  const absPerson = path.resolve(absBase, personFile);
  const absDest = path.resolve(absBase, targetDirMain, targetDirDefault);
  const destPerson = path.join(absDest, path.basename(personFile));

  // 1) Ensure target directory exists

  await fs.mkdir(absTarget, { recursive: true });

  // 2) Delete all contents inside target dir (keep the dir itself)

  await fs.rm(absTarget, { recursive: true, force: true });
  //await fs.mkdir(absTarget, { recursive: true });

  // 3) Ensure destination directory exists
  await fs.mkdir(absDest, { recursive: true });

  // 4) Verify person.json exists and copy it
  await fs.access(absPerson); // throws if missing
  await fs.copyFile(absPerson, destPerson);

  return {
    emptied: absTarget,
    copiedFrom: absPerson,
    copiedTo: destPerson,
  };
}


async function dirExists(path: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch (err: any) {
    if (err?.code === 'ENOENT') return false; // doesn't exist
    throw err; // other errors (permissions, etc.)
  }
}


export async function createUserDirIfNotExist(targetDirDefault: string) {
  const baseDir = '.';
  const targetDirMain = '../back/files';

  const personFile = 'defaultdata/person.json';


  const absBase = path.resolve(process.cwd(), baseDir);
  const absTarget = path.resolve(absBase, targetDirMain);
  const absPerson = path.resolve(absBase, personFile);
  const absDest = path.resolve(absBase, targetDirMain, targetDirDefault);
  const destPerson = path.join(absDest, path.basename(personFile));
  if (!await dirExists(absDest)) {
    // hello world 
    // 1) Ensure destination directory exists
    await fs.mkdir(absDest, { recursive: true });

    // 2) Verify person.json exists and copy it
    await fs.access(absPerson); // throws if missing
    await fs.copyFile(absPerson, destPerson);
    setTimeout(() => { }, 500);
    return {
      emptied: absTarget,
      copiedFrom: absPerson,
      copiedTo: destPerson,
    };
  }
  return undefined
}