'use client';
import React from 'react';
import {
  BgRemoveStatus,
  FileInfoPropsForBgRemover,
  filesAtomForBgRemover,
} from '@/component/file';
import { useAtomValue, useSetAtom } from 'jotai';
import { FileDropArea } from '@/component/file-drop-area';
import { uploadToFastAPI } from '@/utils/upload';
import { ImageBgRemoveTaskCard } from '@/component/image-task-card';
import { backendBaseUrl } from '@/utils/endpoint';
import { showErrorNotification } from '@/utils/notify';

export default function BgRemover() {
  const files = useAtomValue(filesAtomForBgRemover);
  const setFiles = useSetAtom(filesAtomForBgRemover);

  const setBgRemovedUrl = (file: FileInfoPropsForBgRemover, url: string) => {
    setFiles((prev: FileInfoPropsForBgRemover[]) =>
      prev.map((prevFile: FileInfoPropsForBgRemover) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, bgRemovedUrl: url }
          : prevFile,
      ),
    );
  };

  const bgRemove = async (file: FileInfoPropsForBgRemover) => {
    const imageUrl = file.fileUrl;
    const sessionId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('session-id='))
      ?.split('=')[1];
    if (!sessionId) {
      showErrorNotification('Session ID not found');
      return;
    }
    const response = await fetch(`${backendBaseUrl}/remove_bg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        session_id: sessionId,
        file_name: file.fileName,
      }),
      redirect: 'follow',
    });

    if (!response.ok) {
      const errorMessage = 'Failed to remove background';
      showErrorNotification(errorMessage);
    }

    const result = await response.json();
    const output = result.output;
    setBgRemovedUrl(file, output);
    console.log(file);
  };

  return (
    <div className='flex flex-col items-center justify-center w-screen space-y-8 animate-appearance-in pt-12'>
      <FileDropArea
        uploadMethod={uploadToFastAPI}
        setFiles={setFiles}
        appendAttributes={{
          bgRemoveStatus: BgRemoveStatus.READY,
        }}
        appendMethodsToFiles={{
          bgRemoveMethod: bgRemove,
        }}
        enableClientDataReader
      >
        <div className='flex flex-col items-center justify-center p-6 bg-indigo-400 rounded-lg shadow-lg overflow-hidden relative transition-all'>
          <div className='flex flex-col items-center justify-center relative transition-all hover:scale-125'>
            <div className='flex flex-col items-center justify-center mt-6 border-dashed rounded-lg w-full h-64 px-60'>
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
      {files.map((file: FileInfoPropsForBgRemover) => (
        <div key={file.fileName} className='flex items-center space-x-4'>
          <div className='w-24 h-24 bg-gray-200 rounded-lg'></div>
          <div className='flex flex-col space-y-2'>
            <div>{file.fileName}</div>
            <div>{file.progress}%</div>
          </div>
        </div>
      ))}
      {files.map((file: FileInfoPropsForBgRemover) => (
        <ImageBgRemoveTaskCard file={file} />
      ))}
    </div>
  );
}
