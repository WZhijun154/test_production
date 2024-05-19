'use client';
import { useEffect, useState } from 'react';
import { awsS3 } from '@/utils/amazons3/config';
import { Image } from '@nextui-org/react';

export const getImageUrl = async (fileName: string) => {
  console.log(process.env.NEXT_PUBLIC_S3_ACCESS_POINT_ARN);

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_ACCESS_POINT_ARN, // Use Access Point ARN here
    Key: fileName,
    Expires: 10, // URL expiry time in seconds
  };

  console.log('Fetching image from S3 using Access Point');

  try {
    const url = await awsS3.getSignedUrlPromise('getObject', params);
    console.log('Image URL:', url);
    return url;
  } catch (err) {
    console.error('Error fetching image from S3 using Access Point', err);
    return null;
  }
};

export default function Component() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const fetchedUrl = await getImageUrl(
        'wp4511676-scenery-night-digital-art-wallpapers.jpg',
      );
      setUrl(fetchedUrl);
    };

    fetchUrl();
  }, []);

  // Render the Image component only when the URL is ready
  return (
    <div>{url ? <Image src={url} alt='image' /> : <p>Loading image...</p>}</div>
  );
}
