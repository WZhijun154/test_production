'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import CircleIcon from './_components/icon';
import { FileDropArea } from '@/component/file-drop-area-v2';
import { uploadToS3 } from '@/utils/upload';
import { filesAtomForUpscale } from '@/component/file';
import { useAtomValue, useSetAtom } from 'jotai';
import { showErrorNotification } from '@/utils/notify';
import { ImageUpscaleTaskCard } from '@/component/image-task-card';
import { FileInfoPropsForUpscale, UpscaleStatus } from '@/component/file';

export default function Upscaler() {
  const files = useAtomValue(filesAtomForUpscale);
  const setFiles = useSetAtom(filesAtomForUpscale);

  const setUploadStatus = (
    file: FileInfoPropsForUpscale,
    status: UpscaleStatus,
  ) => {
    setFiles((prev: FileInfoPropsForUpscale[]) =>
      prev.map((prevFile: FileInfoPropsForUpscale) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, upscaleStatus: status }
          : prevFile,
      ),
    );
  };

  const setUploadUrl = (file: FileInfoPropsForUpscale, url: string) => {
    setFiles((prev: FileInfoPropsForUpscale[]) =>
      prev.map((prevFile: FileInfoPropsForUpscale) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, upscaledUrl: url }
          : prevFile,
      ),
    );
  };

  async function upscaleImage(file: FileInfoPropsForUpscale) {
    setUploadStatus(file, UpscaleStatus.STARTED);

    const imageUrl = file.fileUrl;

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
          setUploadStatus(file, UpscaleStatus.IN_PROGRESS);
        }
      } while (status !== 'succeeded' && status !== 'failed');

      if (status === 'succeeded') {
        const upscaledUrl = getResult.output;
        setUploadUrl(file, upscaledUrl);
        setUploadStatus(file, UpscaleStatus.SUCCEEDED);
      } else {
        console.error('Prediction failed');
        setUploadStatus(file, UpscaleStatus.FAILED);
      }
    } else {
      showErrorNotification('Server Error! Failed to upscale image');
      setUploadStatus(file, UpscaleStatus.FAILED);
    }
  }

  const onDrop = async (files: File[]) => {
    // when drop, upload the file to s3
    files.forEach(async (file) => {
      const uploadMethodProps = {
        file: file,
        onStart: () => {
          const deleteMethod = () => {
            cancel && cancel();
            setFiles((prev: FileInfoPropsForUpscale[]) =>
              prev.filter(
                (prevFile: FileInfoPropsForUpscale) =>
                  prevFile.fileName !== file.name,
              ),
            );
          };

          setFiles((prev: FileInfoPropsForUpscale[]) => {
            const newFile = {
              fileName: file.name,
              fileUrl: '',
              progress: 0,
              deleteMethod,
              upscaleMethod: () => {},
              upscaleStatus: UpscaleStatus.NOT_READY,
              upscaledUrl: '',
            };
            return [...prev, newFile];
          });

          const reader = new FileReader();
          reader.onload = () => {
            setFiles((prev: FileInfoPropsForUpscale[]) => {
              return prev.map((prevFile: FileInfoPropsForUpscale) =>
                prevFile.fileName === file.name
                  ? { ...prevFile, fileUrlOnClient: reader.result as string }
                  : prevFile,
              );
            });
          };
          reader.readAsDataURL(file);
        },

        onProgress: (progress: number) => {
          setFiles((prev: FileInfoPropsForUpscale[]) =>
            prev.map((prevFile: FileInfoPropsForUpscale) =>
              prevFile.fileName === file.name
                ? { ...prevFile, progress }
                : prevFile,
            ),
          );
        },

        onSuccess: (imageUrl: string) => {
          setFiles((prev: FileInfoPropsForUpscale[]) =>
            prev.map((prevFile: FileInfoPropsForUpscale) =>
              prevFile.fileName === file.name
                ? {
                    ...prevFile,
                    progress: 100,
                    fileUrl: imageUrl,
                    // upscaleMethod: () => upscaleImage(prevFile),
                    upscaleStatus: UpscaleStatus.READY,
                  }
                : prevFile,
            ),
          );

          setFiles((prev: FileInfoPropsForUpscale[]) =>
            prev.map((prevFile: FileInfoPropsForUpscale) =>
              prevFile.fileName === file.name
                ? { ...prevFile, upscaleMethod: () => upscaleImage(prevFile) }
                : prevFile,
            ),
          );

          cancel = () => {};
        },

        onError: (error: any) => {
          setFiles((prev: FileInfoPropsForUpscale[]) =>
            prev.filter(
              (prevFile: { fileName: string }) =>
                prevFile.fileName !== file.name,
            ),
          );
          showErrorNotification('Failed to upload file');
          console.log(error);
        },
      };

      const result = uploadToS3(uploadMethodProps);
      const promise = result.promise;

      let cancel = result.cancel;

      try {
        await promise;
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className='flex flex-col items-center justify-center w-screen space-y-8 animate-appearance-in pt-12'>
      <FileDropArea
        allowFileTypes={['image/jpeg', 'image/png', 'application/pdf', '']}
        dropAction={onDrop}
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
          <ImageUpscaleTaskCard file={file} key={file.fileName} />
        ))}
      </div>
    </div>
  );
}
