import * as fs from 'fs';
import * as AWS from 'aws-sdk';

export interface S3Manager {
  /**
   * Upload local file to S3
   *
   * @param {string} from
   * @param {string} bucket
   * @param {string} key
   * @param contentType
   * @returns {Promise<any>}
   */
  upload(
    from: string,
    bucket: string,
    key: string,
    contentType?: string,
  ): Promise<any>;

  /**
   * It will compose the public url for bucket/key pair
   *
   * @param {string} bucket
   * @param {string} key
   * @returns {string}
   */
  getPublicUrl(bucket: string, key: string): string;
}

export default class S3ManagerImpl implements S3Manager {
  private s3: AWS.S3;
  private accessKey: string;
  private secretKey: string;
  private region: string;

  /**
   * S3Manager constructor
   * @param {string} accessKey
   * @param {string} secretKey
   * @param {string} region
   */
  constructor(accessKey: string, secretKey: string, region: string) {
    AWS.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.region = region;
    this.s3 = new AWS.S3({ region });
  }

  /**
   * Upload local file to S3
   *
   * @param {string} from
   * @param {string} bucket
   * @param {string} key
   * @param {string} contentType
   * @returns {Promise<void>}
   */
  async upload(
    from: string,
    bucket: string,
    key: string,
    contentType?: string,
  ) {
    const fileStream = fs.createReadStream(from);
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentType: contentType || 'image/png',
    };
    return this.s3.putObject(params).promise();
  }

  /**
   * It will compose the public url for bucket/key pair
   *
   * @param {string} bucket
   * @param {string} key
   * @returns {string}
   */
  getPublicUrl(bucket: string, key: string): string {
    return `https://s3.${this.region}.amazonaws.com/${bucket}/${key}`;
  }
}
