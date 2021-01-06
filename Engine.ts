import { EventEmitter } from 'events';
import Start from './Rules/Start';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import loadJSONSync from './lib/loadJSONSync';
import * as fsModule from 'fs';
import * as globModule from 'glob';
import * as path from 'path';
import { IOptions } from 'glob';

interface IGlob {
  sync(pattern: string, options?: IOptions): string[];
}

export interface IEngine {
  debug(callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  option(key: string, defaultValue: any): any;
  setOption(key: string, value: any): void;
  start(): void;
}

export class Engine extends EventEmitter implements IEngine {
  #options: {
    [key: string]: any;
  } = {};
  #started: boolean = false;

  debug(callback: (...args: any[]) => void): void {
    if (!this.option('debug')) {
      return;
    }

    return callback();
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    this.debug((): void =>
      console.log(`Engine#emit: ${String(event)}: ${args}`)
    );

    return super.emit(event, ...args);
  }

  getPackages(glob: IGlob = globModule, fs = fsModule): string[] {
    const packageDetails: { [key: string]: any } = loadJSONSync(
        './package.json'
      ),
      paths: string[] = packageDetails?.['civ-clone']?.paths || [
        './node_modules/@civ-clone/*',
      ],
      packages: string[] = [];

    paths.forEach((pathName: string) => {
      (glob.sync(pathName) || []).forEach((pathName: string) => {
        try {
          fs.accessSync(pathName);

          const packagePath: string = path.resolve(pathName, 'package.json');

          fs.accessSync(packagePath);

          const packageDetails: { [key: string]: any } = loadJSONSync(
            packagePath
          );

          if (typeof packageDetails.main === 'string') {
            const main: string = path.resolve(pathName, packageDetails.main);

            fs.accessSync(main);

            packages.push(main);

            return;
          }

          const index: string = path.resolve(pathName, 'index.js');

          fs.accessSync(index);

          packages.push(index);

          return;
        } catch (e) {
          this.emit('engine:plugins:load:read-path:failed', pathName);
        }
      });
    });

    return packages;
  }

  loadPlugins() {
    this.emit('engine:plugins:load');

    return Promise.all(
      this.getPackages().map(
        (packageName: string): Promise<any> =>
          import(packageName)
            .then((): boolean =>
              this.emit('engine:plugins:load:success', packageName)
            )
            .catch((): boolean =>
              this.emit('engine:plugins:load:failed', packageName)
            )
      )
    ).then(() => this.emit('engine:plugins-loaded'));
  }

  /**
   * Options are per-instance settings that affect only the current instance.
   */
  option(key: string, defaultValue: any = null): any {
    return this.#options[key] || defaultValue;
  }

  setOption(key: string, value: any): void {
    if (this.#options[key] !== value) {
      this.#options[key] = value;

      this.emit('option:changed', key, value);
    }
  }

  start(): void {
    if (this.#started) {
      return;
    }

    this.#started = true;

    this.emit('engine:initialise');

    this.loadPlugins().then((): void => {
      // TODO: it might be that this can be entirely removed and we don't need to rely on Events at all...
      this.emit('engine:start');

      ruleRegistryInstance.process(Start);
    });
  }
}

export const instance: Engine = new Engine();

export default Engine;
