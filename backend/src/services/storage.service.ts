import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const isS3Configured = (): boolean => {
  const keyId = config.aws.accessKeyId;
  const secret = config.aws.secretAccessKey;
  return !!(
    keyId &&
    secret &&
    keyId !== 'mock_key' &&
    keyId !== 'your_aws_access_key_id' &&
    secret !== 'mock_secret' &&
    secret !== 'your_aws_secret_access_key'
  );
};

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const BUCKET = config.aws.s3BucketName;
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const ensureLocalDir = (subDir: string): string => {
  const dir = path.join(LOCAL_UPLOAD_DIR, subDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const storageService = {
  async uploadFile(
    key: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<string> {
    if (!isS3Configured()) {
      const [folder, filename] = key.split('/');
      const dir = ensureLocalDir(folder || 'default');
      const filepath = path.join(dir, filename || `${Date.now()}.jpg`);
      fs.writeFileSync(filepath, buffer);
      const url = `/uploads/${key}`;
      logger.info(`[LOCAL STORAGE] File saved locally: ${filepath}`);
      return url;
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ServerSideEncryption: 'AES256',
    });

    await s3Client.send(command);
    const url = `https://${BUCKET}.s3.${config.aws.region}.amazonaws.com/${key}`;
    logger.info(`[S3 STORAGE] Upload successful: ${key}`);
    return url;
  },

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    if (!isS3Configured()) {
      return `/uploads/${key}`;
    }
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  },

  async deleteFile(key: string): Promise<void> {
    if (!isS3Configured()) {
      const filepath = path.join(LOCAL_UPLOAD_DIR, key);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      logger.info(`[LOCAL STORAGE] File deleted: ${filepath}`);
      return;
    }
    const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
    await s3Client.send(command);
    logger.info(`[S3 STORAGE] Delete successful: ${key}`);
  },

  async uploadPdf(key: string, buffer: Buffer): Promise<string> {
    return this.uploadFile(key, buffer, 'application/pdf');
  },
};
