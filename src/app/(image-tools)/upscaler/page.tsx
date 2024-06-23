'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { FileDropArea } from '@/component/file-drop-area-v2';
import { uploadToS3, uploadToFastAPI } from '@/utils/upload';
import { filesAtomForUpscale } from '@/component/file';
import { useAtomValue, useSetAtom } from 'jotai';
import { showErrorNotification } from '@/utils/notify';
import { ImageFileInfoPropsForUpscale, UpscaleStatus } from '@/component/file';
import {
  Card,
  Progress,
  Button,
  Image,
  CardBody,
  CardFooter,
  CardProps,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { backendBaseUrl } from '@/utils/endpoint';
import ReactCompareImage from 'react-compare-image';

function FileDropCard() {
  return (
    <Card
      className='w-[768px] h-[256px] flex flex-col justify-center items-center dark:bg-default-100/50'
      style={{
        boxShadow:
          '0 2px 0 hsla(0, 0%, 100%, 0.2), inset 0 2px 2px hsla(0, 0%, 0%, 0.7)',
      }}
    >
      <Icon icon='bytesize:upload' className=' text-48px' />
      <p className='text-30px text-default-600'>
        Add file or drop image files here
      </p>
      <p className='text-16px text-default-400'>
        Supports JPG, JPEG, PNG, WEBP or BMP up to 30MB and 2000x2000
      </p>
    </Card>
  );
}

function Title() {
  return <h1 className='text-72px font-medium'>Image Upscaler</h1>;
}

interface CardWithThumbnailProps {
  props?: CardProps;
  imgSrc: string;
  isRunning?: boolean;
  isSuccess?: boolean;
  isFailed?: boolean;
  isUploading?: boolean;
  secondaryAction?: () => void;
  primaryAction?: () => void;
  progress?: number;
  caption?: string;
  description?: string;
}

function ControlPanel() {
  return (
    <Card className='w-[256px] h-[256px] flex flex-col items-center justify-center dark:bg-default-100/50'>
      Control Panel
    </Card>
  );
}

function CardWithThumbnail({
  props,
  imgSrc,
  isRunning = false,
  isSuccess = false,
  isFailed = false,
  isUploading = false,
  progress = 100,
  caption,
  description,
  primaryAction,
  secondaryAction,
}: CardWithThumbnailProps) {
  let progressBar;
  if (isSuccess) {
    progressBar = <Progress size='sm' value={100} color='success' />;
  } else if (isRunning) {
    progressBar = <Progress isIndeterminate size='sm' />;
  } else if (isFailed) {
    progressBar = <Progress size='sm' value={100} color='warning' />;
  } else if (isUploading) {
    progressBar = <Progress size='sm' value={progress} />;
  } else {
    progressBar = <Progress size='sm' value={100} />;
  }

  let primaryButton;
  if (isSuccess) {
    primaryButton = (
      <Button color='success' onClick={primaryAction}>
        Download
      </Button>
    );
  } else if (isRunning) {
    primaryButton = <Button isDisabled>Upscale</Button>;
  } else if (isFailed) {
    primaryButton = (
      <Button color='warning' onClick={primaryAction}>
        Retry
      </Button>
    );
  } else {
    primaryButton = (
      <Button color='primary' onClick={primaryAction}>
        Upscale
      </Button>
    );
  }

  let secondaryButton;
  if (isSuccess) {
    secondaryButton = (
      <Button color='default' variant='light' onClick={secondaryAction}>
        See Details
      </Button>
    );
  } else if (isRunning) {
    secondaryButton = (
      <Button isDisabled variant='light' onClick={secondaryAction}>
        Cancel
      </Button>
    );
  } else if (isFailed) {
    secondaryButton = (
      <Button color='default' variant='light' onClick={secondaryAction}>
        Cancel
      </Button>
    );
  } else {
    secondaryButton = (
      <Button color='default' variant='light' onClick={secondaryAction}>
        Cancel
      </Button>
    );
  }

  return (
    <Card
      className='w-[256px] dark:bg-default-100/50 animate-appearance-in'
      {...props}
    >
      <CardBody className='px-3 pb-1 gap-4'>
        <Image
          alt='Card image'
          className='aspect-square w-full object-cover object-center'
          src={imgSrc}
          isBlurred
          loading='lazy'
        />
        <div className='flex flex-col px-2'>
          <p className='text-large font-medium truncate overflow-hidden'>
            {caption}
          </p>
          <p className='text-small text-default-400'>{description}</p>
        </div>
      </CardBody>
      <CardFooter className='justify-end gap-2'>
        {isUploading ? (
          <Button variant='light' isLoading>
            Uploading
          </Button>
        ) : (
          <>
            {secondaryButton}
            {primaryButton}
          </>
        )}
      </CardFooter>
      {progressBar}
    </Card>
  );
}

interface ImageCompareModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  leftImage: string;
  rightImage: string;
}

function ImageCompareModal({
  isOpen,
  onOpenChange,
  leftImage,
  rightImage,
}: ImageCompareModalProps) {
  return (
    <Modal
      size='xl'
      shouldBlockScroll={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody>
            <ModalHeader className='flex-col gap-2 px-0 justify-center items-start'>
              <p className='text-30px text-default-600 font-normal'>Details</p>
              <p className='text-16px text-default-400 font-normal'>
                Drag the slider to compare the original and upscaled images.
              </p>
            </ModalHeader>
            <div className='pb-4'>
              <ReactCompareImage
                leftImage={leftImage}
                rightImage={rightImage}
              />
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}

export default function Upscaler() {
  const files = useAtomValue(filesAtomForUpscale);
  const setFiles = useSetAtom(filesAtomForUpscale);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentModalFile, setCurrentModalFile] =
    useState<ImageFileInfoPropsForUpscale | null>(null);

  const setUpscaleStatus = (
    file: ImageFileInfoPropsForUpscale,
    status: UpscaleStatus,
  ) => {
    setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
      prev.map((prevFile: ImageFileInfoPropsForUpscale) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, upscaleStatus: status }
          : prevFile,
      ),
    );
  };

  const setUpscaledUrl = (file: ImageFileInfoPropsForUpscale, url: string) => {
    setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
      prev.map((prevFile: ImageFileInfoPropsForUpscale) =>
        prevFile.fileName === file.fileName
          ? { ...prevFile, upscaledUrl: url }
          : prevFile,
      ),
    );
  };

  const download = (file: ImageFileInfoPropsForUpscale) => {
    window.location.href =
      backendBaseUrl + '/download?path=' + file.upscaledUrl;
    return;
  };

  async function upscaleImage(file: ImageFileInfoPropsForUpscale) {
    setUpscaleStatus(file, UpscaleStatus.STARTED);
    setUpscaleStatus(file, UpscaleStatus.IN_PROGRESS);
    const imageUrl = file.fileUrl;

    // const response = await fetch('/api/replicate/upscale', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     replicateInput: {
    //       image: imageUrl,
    //       scale: 2,
    //       face_enhance: false,
    //     },
    //   }),
    // });

    const response = await fetch(`${backendBaseUrl}/upscale_img`, {
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
      setUpscaleStatus(file, UpscaleStatus.FAILED);
      return;
    }

    setUpscaleStatus(file, UpscaleStatus.SUCCEEDED);

    const result = await response.json();
    const output = result.output;
    setUpscaledUrl(file, output);
    console.log(file);
  }

  const onDrop = async (files: File[]) => {
    // when drop, upload the file to s3
    files.forEach(async (file) => {
      const uploadMethodProps = {
        file: file,
        onStart: () => {
          const deleteMethod = () => {
            cancel && cancel();
            setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
              prev.filter(
                (prevFile: ImageFileInfoPropsForUpscale) =>
                  prevFile.fileName !== file.name,
              ),
            );
          };

          setFiles((prev: ImageFileInfoPropsForUpscale[]) => {
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
            const fileUrlOnClient = reader.result as string;
            const image = new window.Image();
            image.onload = () => {
              setFiles((prev: ImageFileInfoPropsForUpscale[]) => {
                return prev.map((prevFile: ImageFileInfoPropsForUpscale) =>
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
          setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
            prev.map((prevFile: ImageFileInfoPropsForUpscale) =>
              prevFile.fileName === file.name
                ? { ...prevFile, progress }
                : prevFile,
            ),
          );
        },

        onSuccess: (imageUrl: string) => {
          setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
            prev.map((prevFile: ImageFileInfoPropsForUpscale) =>
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

          setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
            prev.map((prevFile: ImageFileInfoPropsForUpscale) =>
              prevFile.fileName === file.name
                ? { ...prevFile, upscaleMethod: () => upscaleImage(prevFile) }
                : prevFile,
            ),
          );

          cancel = () => {};
        },

        onError: (error: any) => {
          setFiles((prev: ImageFileInfoPropsForUpscale[]) =>
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

  const openImageCompareModal = (file: ImageFileInfoPropsForUpscale) => {
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
            currentModalFile?.upscaledUrl) as string
        }
      />
      <div className='flex flex-col gap-12 w-full items-center mt-[96px]'>
        <Title />
        <div className='flex-row flex gap-8'>
          <FileDropArea
            allowFileTypes={['image/jpeg', 'image/png']}
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
                file.upscaleStatus === UpscaleStatus.SUCCEEDED
                  ? () => download(file)
                  : file.upscaleMethod
              }
              secondaryAction={
                file.upscaleStatus === UpscaleStatus.SUCCEEDED
                  ? () => openImageCompareModal(file)
                  : file.deleteMethod
              }
              isRunning={file.upscaleStatus === UpscaleStatus.IN_PROGRESS}
              isSuccess={file.upscaleStatus === UpscaleStatus.SUCCEEDED}
              isFailed={file.upscaleStatus === UpscaleStatus.FAILED}
              isUploading={file.upscaleStatus === UpscaleStatus.NOT_READY}
              progress={file.progress}
              caption={file.fileName}
              description={`${file.width}x${file.height}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
