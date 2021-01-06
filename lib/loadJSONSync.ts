import loadFileSync from './loadFileSync';

export default (file: string): { [key: string]: any } =>
  JSON.parse(loadFileSync(file));
