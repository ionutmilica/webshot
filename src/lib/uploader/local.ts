import { Uploader } from './uploader';
import { promisify } from 'util';
import * as fs from 'fs';

const renameAsync = promisify(fs.rename);

export class LocalUploader implements Uploader {
  private url: string;
  private rootPath: string;

  constructor(rootPath: string, url: string) {
    this.url = url;
    this.rootPath = rootPath;
  }

  async upload(from: string, to: string, contentType?: string): Promise<any> {
    // Rename will suck if we're using different partitions/docker
    return await renameAsync(from, `${this.rootPath}/${to}`);
  }

  getPublicUrl(file: string): string {
    return `${this.url}/${file}`;
  }
}
