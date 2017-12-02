export interface Uploader {
  /**
   * Upload local file to provider
   *
   * @param {string} from
   * @param {string} key
   * @param contentType
   * @returns {Promise<any>}
   */
  upload(
    from: string,
    key: string,
    contentType?: string,
  ): Promise<any>;

  /**
   * It will compose the public url for the file
   *
   * @param {string} file
   * @returns {string}
   */
  getPublicUrl(file: string): string;
}
