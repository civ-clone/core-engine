import * as fs from 'fs';

export default (file: string): string => {
  fs.accessSync(file);

  return fs.readFileSync(file, {
    encoding: 'utf8',
  });
};
