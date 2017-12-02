import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { Uploader } from "./uploader";

export class S3Uploader implements Uploader {
  private s3: AWS.S3;
  private accessKey: string;
  private secretKey: string;
  private region: string;
  private bucket: string;

  /**
   * S3Manager constructor
   * @param {string} accessKey
   * @param {string} secretKey
   * @param bucket
   * @param {string} region
   */
  constructor(accessKey: string, secretKey: string, bucket: string, region: string) {
    AWS.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.bucket = bucket;
    this.region = region;
    this.s3 = new AWS.S3({ region });
  }

  /**
   * Upload local file to S3
   *
   * @param {string} from
   * @param {string} to
   * @param {string} contentType
   * @returns {Promise<void>}
   */
  async upload(
    from: string,
    to: string,
    contentType?: string,
  ) {
    const fileStream = fs.createReadStream(from);
    const params = {
      Bucket: this.bucket,
      Key: to,
      Body: fileStream,
      ContentType: contentType || 'image/png',
    };
    return this.s3.putObject(params).promise();
  }

  /**
   * It will compose the public url for bucket/key pair
   *
   * @param {string} key
   * @returns {string}
   */
  getPublicUrl(key: string): string {
    return `https://s3.${this.region}.amazonaws.com/${this.bucket}/${key}`;
  }

}
