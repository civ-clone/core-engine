import { promises as fs } from 'fs';

export default (file: string): Promise<string> =>
  fs.access(file).then(() =>
    fs.readFile(file, {
      encoding: 'utf8',
    })
  );
