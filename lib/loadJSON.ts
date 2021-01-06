import loadFile from './loadFile';

export default (file: string): Promise<{ [key: string]: any }> =>
  loadFile(file).then((content: string): { [key: string]: any } =>
    JSON.parse(content)
  );
