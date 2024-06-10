import { awsS3, S3_BUCKET } from '@/utils/amazons3/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const fileType = searchParams.get('fileType');

  if (!fileName || !fileType) {
    return new Response('fileName and fileType are required', { status: 400 });
  }

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  try {
    const uploadURL = await awsS3.getSignedUrlPromise('putObject', s3Params);
    return NextResponse.json({ uploadURL });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return new Response('Error generating presigned URL', { status: 500 });
  }
}
