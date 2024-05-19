'use client';
import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import ReactCompareImage from 'react-compare-image';
import { Icon } from '@iconify/react';
import { CircleIcon } from './icon';
import { FileDropArea } from '@/component/file-drop-area';
import { uploadToS3 } from '@/utils/uploadToS3';
import { filesAtomForUpscale } from '@/component/file';
import { useAtomValue, useSetAtom } from 'jotai';
import { Image } from '@nextui-org/react';
import { showErrorNotification } from '@/utils/notify';
import { FileThumbnail } from '@/component/file-thumbnail';

export default function Upscaler() {
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [upscaledImageUrl, setUpscaledImageUrl] = useState('');
  const files = useAtomValue(filesAtomForUpscale);
  const setFiles = useSetAtom(filesAtomForUpscale);

  async function onUpscaleButtonClick() {
    // use the first file
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = file.fileUrl;
      setOriginalImageUrl(imageUrl);

      const response = await fetch('/api/replicate/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replicateInput: {
            image: imageUrl,
            scale: 2,
            face_enhance: false,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const predictionId = result.id;

        // Step.5. Poll the GET request until the prediction is complete
        let getResult;
        let status;
        do {
          const getResponse = await fetch(
            `/api/replicate/upscale?id=${predictionId}`,
          );
          getResult = await getResponse.json();
          status = getResult.status;
          if (status !== 'succeeded') {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before polling again
          }
        } while (status !== 'succeeded' && status !== 'failed');

        if (status === 'succeeded') {
          setUpscaledImageUrl(getResult.output); // Assuming the output is an array with image URLs
        } else {
          console.error('Prediction failed');
        }
      } else {
        showErrorNotification('Server Error! Failed to upscale image');
      }
    } else {
      showErrorNotification('Please upload an image first');
    }
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen space-y-8 animate-appearance-in'>
      {/* {files.map((file) => (
        <Image src={file.fileUrl} />
      ))} */}

      <FileDropArea
        uploadMethod={uploadToS3}
        setFiles={setFiles}
        allowFileTypes={['image/jpeg', 'image/png', 'application/pdf', '']}
      >
        <div className='flex flex-col items-center justify-center p-6 bg-indigo-400 rounded-lg shadow-lg overflow-hidden relative transition-all'>
          <div className='flex flex-col items-center justify-center relative transition-all hover:scale-125'>
            <CircleIcon
              className='absolute text-white opacity-20 z-0'
              radius={120}
            />
            <CircleIcon
              className='absolute text-white opacity-20 z-0'
              radius={240}
            />
            <div className='flex flex-col items-center justify-center mt-6 border-dashed rounded-lg w-full h-64 px-60'>
              <Icon
                className='pointer-events-none text-4xl text-white'
                icon='bi:image-fill'
              />
              <div className='text-center w-full border-dotted'>
                <p className='mt-2 text-lg font-medium text-white'>
                  Add file or drop image files here
                </p>
                <p className='mt-1 text-sm text-white'>
                  Supports JPG, JPEG, PNG, WEBP or BMP up to 30MB and 2000x2000
                </p>
              </div>
            </div>
          </div>
        </div>
      </FileDropArea>

      <div className='flex flex-row gap-4'>
        {files.map((file) => (
          <FileThumbnail file={file} iconifyIcon='bi:image-fill' />
        ))}
      </div>

      <Button
        color='primary'
        onClick={onUpscaleButtonClick}
        className=' text-xl'
        size='lg'
      >
        Upscale
      </Button>

      <div className='flex flex-col w-[100px] items-center justify-center'>
        <ReactCompareImage
          leftImage={originalImageUrl}
          rightImage={upscaledImageUrl}
        />
      </div>
    </div>
  );
}
