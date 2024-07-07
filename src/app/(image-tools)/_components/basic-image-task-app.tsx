'use client';
import React, { useState } from 'react';
import { FileDropArea } from '@/component/file-drop-area-v2';
import { uploadToFastAPI } from '@/utils/upload';
import { useAtomValue, useSetAtom } from 'jotai';
import { showErrorNotification } from '@/utils/notify';
import { BasicImageTaskInfo, BasicImageTaskStatus } from '@/component/file';
import { Card, useDisclosure } from '@nextui-org/react';
import { backendBaseUrl } from '@/utils/endpoint';
import { FileDropCard } from './file-drop-card';
import { CardWithThumbnail } from './card-with-thumbnail';
import { ImageCompareModal } from './image-compare-modal';

interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps) {
  return <h1 className='text-72px font-medium'>{title}</h1>;
}

function ControlPanel() {
  return (
    <Card className='w-[256px] h-[256px] flex flex-col items-center justify-center bg-content2 text-content-foreground2'>
      Control Panel
    </Card>
  );
}

interface BasicImageTaskAppProps {
  filesAtom: any;
  title: string;
  actionButtonText: string;
  backendMethod: string;
}

export default function BasicImageTaskApp({
  filesAtom,
  title,
  actionButtonText,
  backendMethod,
}: BasicImageTaskAppProps) {
  const files = useAtomValue(filesAtom) as BasicImageTaskInfo[];
  const setFiles = useSetAtom(filesAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentModalFile, setCurrentModalFile] =
    useState<BasicImageTaskInfo | null>(null);

  const setTaskStatus = (
    file: BasicImageTaskInfo,
    status: BasicImageTaskStatus,
  ) => {
    setFiles((prev: BasicImageTaskInfo[]) =>
      prev.map((prevFile: BasicImageTaskInfo) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, status: status }
          : prevFile,
      ),
    );
  };

  const setProcessedUrl = (file: BasicImageTaskInfo, url: string) => {
    setFiles((prev: BasicImageTaskInfo[]) =>
      prev.map((prevFile: BasicImageTaskInfo) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, processedUrl: url }
          : prevFile,
      ),
    );
  };

  const download = (file: BasicImageTaskInfo) => {
    window.location.href =
      backendBaseUrl + '/download?path=' + file.processedUrl;
    return;
  };

  async function process(file: BasicImageTaskInfo) {
    setTaskStatus(file, BasicImageTaskStatus.STARTED);
    setTaskStatus(file, BasicImageTaskStatus.IN_PROGRESS);
    const imageUrl = file.fileUrl;

    const response = await fetch(`${backendBaseUrl}/${backendMethod}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        file_name: file.fileName,
      }),
      redirect: 'follow',
      credentials: 'include', // Ensure cookies are included
    });

    if (!response.ok) {
      const errorMessage = 'Failed to remove background';
      setTaskStatus(file, BasicImageTaskStatus.FAILED);
      return;
    }

    setTaskStatus(file, BasicImageTaskStatus.SUCCEEDED);

    const result = await response.json();
    const output = result.output;
    setProcessedUrl(file, output);
    console.log(file);
  }

  const onDrop = async (files: File[]) => {
    files.forEach(async (file) => {
      const uploadMethodProps = {
        file: file,
        onStart: () => {
          const deleteMethod = () => {
            cancel && cancel();
            setFiles((prev: BasicImageTaskInfo[]) =>
              prev.filter(
                (prevFile: BasicImageTaskInfo) =>
                  prevFile.fileName !== file.name,
              ),
            );
          };

          setFiles((prev: BasicImageTaskInfo[]) => {
            const newFile = {
              fileName: file.name,
              fileUrl: '',
              progress: 0,
              deleteMethod,
              taskMethod: () => {},
              status: BasicImageTaskStatus.NOT_READY,
              processedUrl: '',
            };
            return [...prev, newFile];
          });

          const reader = new FileReader();
          reader.onload = () => {
            const fileUrlOnClient = reader.result as string;
            const image = new window.Image();
            image.onload = () => {
              setFiles((prev: BasicImageTaskInfo[]) => {
                return prev.map((prevFile: BasicImageTaskInfo) =>
                  prevFile.fileName === file.name
                    ? {
                        ...prevFile,
                        fileUrlOnClient: reader.result as string,
                        width: image.width,
                        height: image.height,
                      }
                    : prevFile,
                );
              });
            };
            image.src = fileUrlOnClient;
          };
          reader.readAsDataURL(file);
        },

        onProgress: (progress: number) => {
          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.map((prevFile: BasicImageTaskInfo) =>
              prevFile.fileName === file.name
                ? { ...prevFile, progress }
                : prevFile,
            ),
          );
        },

        onSuccess: (imageUrl: string) => {
          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.map((prevFile: BasicImageTaskInfo) =>
              prevFile.fileName === file.name
                ? {
                    ...prevFile,
                    progress: 100,
                    fileUrl: imageUrl,
                    // at this point, the fileUrl still not be set, so set it after this step
                    status: BasicImageTaskStatus.READY,
                  }
                : prevFile,
            ),
          );

          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.map((prevFile: BasicImageTaskInfo) =>
              prevFile.fileName === file.name
                ? { ...prevFile, taskMethod: () => process(prevFile) }
                : prevFile,
            ),
          );

          cancel = () => {};
        },

        onError: (error: any) => {
          setFiles((prev: BasicImageTaskInfo[]) =>
            prev.filter(
              (prevFile: { fileName: string }) =>
                prevFile.fileName !== file.name,
            ),
          );
          showErrorNotification('Failed to upload file');
          console.log(error);
        },
      };

      const result = uploadToFastAPI(uploadMethodProps);
      const promise = result.promise;

      let cancel = result.cancel;

      try {
        await promise;
      } catch (error) {
        console.log(error);
      }
    });
  };

  const openImageCompareModal = (file: BasicImageTaskInfo) => {
    setCurrentModalFile(file);
    onOpen();
  };

  return (
    <>
      <ImageCompareModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        leftImage={currentModalFile?.fileUrlOnClient as string}
        rightImage={
          (backendBaseUrl +
            '/download?path=' +
            currentModalFile?.processedUrl) as string
        }
      />
      <div className='flex flex-col gap-12 w-full items-center mt-[96px]'>
        <Title title={title} />
        <div className='flex-row flex gap-8'>
          <FileDropArea
            allowFileTypes={['image/jpeg', 'image/png', 'image/webp']}
            dropAction={onDrop}
          >
            <FileDropCard />
          </FileDropArea>
          <ControlPanel />
        </div>
        <div className='grid max-w-8xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {files.map((file) => (
            <CardWithThumbnail
              imgSrc={file.fileUrlOnClient as string}
              key={file.fileName}
              primaryAction={
                file.status === BasicImageTaskStatus.SUCCEEDED
                  ? () => download(file)
                  : file.taskMethod
              }
              secondaryAction={
                file.status === BasicImageTaskStatus.SUCCEEDED
                  ? () => openImageCompareModal(file)
                  : file.deleteMethod
              }
              isRunning={file.status === BasicImageTaskStatus.IN_PROGRESS}
              isSuccess={file.status === BasicImageTaskStatus.SUCCEEDED}
              isFailed={file.status === BasicImageTaskStatus.FAILED}
              isUploading={file.status === BasicImageTaskStatus.NOT_READY}
              progress={file.progress}
              caption={file.fileName}
              description={`${file.width}x${file.height}`}
              action_text={actionButtonText}
            />
          ))}
        </div>
      </div>
    </>
  );
}
