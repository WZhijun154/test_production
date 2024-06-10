'use client';
import React from 'react';
import ReactCompareImage from 'react-compare-image';

export default function CompareResult({
  params,
}: {
  params: { imageUrl: string; upscaledUrl: string };
}) {
  const decodedImageUrl = decodeURIComponent(params.imageUrl);
  const decodedUpscaledUrl = decodeURIComponent(params.upscaledUrl);

  return (
    <div className='w-full h-screen flex flex-col items-center'>
      <div className='w-1/2'>
        <ReactCompareImage
          leftImage={decodedImageUrl}
          rightImage={decodedUpscaledUrl}
        />
      </div>
    </div>
  );
}
