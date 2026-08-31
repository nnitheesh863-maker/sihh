import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/env';
import { getSupabaseClient, isSupabaseReady } from '../config/supabase';
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
  /**
   * Upload a file buffer using Supabase Storage, AWS S3, or Local storage fallback
   */
  async uploadFile(
    key: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<string> {
    // 1. Try Supabase Storage if configured
    if (isSupabaseReady()) {
      try {
        const supabase = getSupabaseClient()!;
        const { data, error } = await supabase.storage
          .from('onion-images')
          .upload(key, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('onion-images')
            .getPublicUrl(key);

          logger.info(`[SUPABASE STORAGE] Upload successful: ${publicUrlData.publicUrl}`);
          return publicUrlData.publicUrl;
        }
        logger.warn(`[SUPABASE STORAGE] Error: ${error?.message}, falling back to S3/Local`);
      } catch (err) {
        logger.warn('[SUPABASE STORAGE] Failed upload, attempting AWS S3/Local fallback');
      }
    }

    // 2. Try AWS S3 if configured
    if (isS3Configured()) {
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
      });

      await s3Client.send(command);
      const url = `https://${BUCKET}.s3.${config.aws.region}.amazonaws.com/${key}`;
      logger.info(`[AWS S3] Upload successful: ${key}`);
      return url;
    }

    // 3. Fallback to Local Filesystem
    const [folder, filename] = key.split('/');
    const dir = ensureLocalDir(folder || 'default');
    const filepath = path.join(dir, filename || `${Date.now()}.jpg`);
    fs.writeFileSync(filepath, buffer);
    const url = `/uploads/${key}`;
    logger.info(`[LOCAL STORAGE] File saved locally: ${filepath}`);
    return url;
  },

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    if (isSupabaseReady()) {
      const supabase = getSupabaseClient()!;
      const { data } = supabase.storage.from('onion-images').getPublicUrl(key);
      return data.publicUrl;
    }
    if (!isS3Configured()) {
      return `/uploads/${key}`;
    }
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  },

  async deleteFile(key: string): Promise<void> {
    if (isSupabaseReady()) {
      const supabase = getSupabaseClient()!;
      await supabase.storage.from('onion-images').remove([key]);
      logger.info(`[SUPABASE STORAGE] Deleted: ${key}`);
      return;
    }
    if (!isS3Configured()) {
      const filepath = path.join(LOCAL_UPLOAD_DIR, key);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      logger.info(`[LOCAL STORAGE] File deleted: ${filepath}`);
      return;
    }
    const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
    await s3Client.send(command);
    logger.info(`[AWS S3] Delete successful: ${key}`);
  },

  async uploadPdf(key: string, buffer: Buffer): Promise<string> {
    return this.uploadFile(key, buffer, 'application/pdf');
  },
};
