'use client';

import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

export default function MyPage() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  async function handleUpload(file: File) {
    const fileName = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);
    const response = await fetch(
      `/api/generate-presigned-url?fileName=${fileName}&fileType=${fileType}`,
    );
    const { uploadURL } = await response.json();
    console.log(uploadURL);
    await fetch(uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: file,
    });

    const imageUrl = uploadURL.split('?')[0];
    setImageUrl(imageUrl);
    return imageUrl;
  }

  async function handleFetch() {
    setLoading(true);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        const uploadedImageUrl = await handleUpload(file);

        console.log(uploadedImageUrl);

        // const response = await fetch('/api/replicate/predict', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ prompt: uploadedImageUrl }),
        // });

        // if (response.ok) {
        //   const prediction = await response.json();
        //   const predictionId = prediction.id;

        //   // Polling for prediction result
        //   let getResult;
        //   let status;
        //   do {
        //     const getResponse = await fetch(
        //       `/api/replicate/predict?id=${predictionId}`,
        //     );
        //     getResult = await getResponse.json();
        //     status = getResult.status;
        //     if (status !== 'succeeded') {
        //       await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before polling again
        //     }
        //   } while (status !== 'succeeded' && status !== 'failed');

        //   setLoading(false);

        //   if (status === 'succeeded') {
        //     setImageUrl(getResult.output[0]); // Assuming the output is an array with image URLs
        //   } else {
        //     console.error('Prediction failed');
        //   }
        // } else {
        //   setLoading(false);
        //   console.error('Error creating prediction');
        // }
      }
    };

    fileInput.click();
  }

  return (
    <div>
      <div>Hello world</div>
      <Button onClick={handleFetch} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch'}
      </Button>
      {imageUrl && <img src={imageUrl} alt='Generated Image' />}
    </div>
  );
}
