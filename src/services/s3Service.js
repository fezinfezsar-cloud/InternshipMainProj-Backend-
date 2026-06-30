const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');

class S3Service {
  async uploadFile(file) {
    if (!file) return null;

    const isS3Configured = env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET;

    if (isS3Configured) {
      try {
        const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
        const s3 = new S3Client({
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY
          }
        });

        const extension = file.originalname.split('.').pop();
        const fileKey = `${uuidv4()}.${extension}`;

        await s3.send(new PutObjectCommand({
          Bucket: env.AWS_S3_BUCKET,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype
        }));

        return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;
      } catch (err) {
        console.error('S3 Upload failed, falling back to local upload...', err);
      }
    }

    // Local Fallback Upload
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const extension = file.originalname.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, file.buffer);
    
    // Returns relative path (served via express.static)
    return `/uploads/${fileName}`;
  }

  async deleteFile(fileUrl) {
    if (!fileUrl) return;

    if (fileUrl.startsWith('/uploads/')) {
      const fileName = fileUrl.replace('/uploads/', '');
      const filePath = path.join(__dirname, '../../public/uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return;
    }

    const isS3Configured = env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET;
    if (isS3Configured && fileUrl.includes('amazonaws.com')) {
      try {
        const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
        const s3 = new S3Client({
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY
          }
        });

        const fileKey = fileUrl.split('/').pop();
        await s3.send(new DeleteObjectCommand({
          Bucket: env.AWS_S3_BUCKET,
          Key: fileKey
        }));
      } catch (err) {
        console.error('S3 Delete failed:', err);
      }
    }
  }
}

module.exports = new S3Service();
