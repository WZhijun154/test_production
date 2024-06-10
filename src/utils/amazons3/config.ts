import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  s3UseArnRegion: true,
  signatureVersion: 'v4', // Ensure Signature Version 4 is used
});

export const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;

export const awsS3 = new AWS.S3({
  // s3ForcePathStyle: true, // Use path-style addressing
});
