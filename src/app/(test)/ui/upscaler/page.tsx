'use client';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  CardProps,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Link,
  Divider,
  Spacer,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import ReactCompareImage from 'react-compare-image';

interface CardWithThumbnailProps {
  props?: CardProps;
  imgSrc: string;
  isRunning?: boolean;
  isSuccess?: boolean;
  isFailed?: boolean;
  isUploading?: boolean;
}

function CardWithThumbnail({
  props,
  imgSrc,
  isRunning = false,
  isSuccess = false,
  isFailed = false,
  isUploading = false,
}: CardWithThumbnailProps) {
  let progressBar;
  if (isSuccess) {
    progressBar = <Progress size='sm' value={100} color='success' />;
  } else if (isRunning) {
    progressBar = <Progress isIndeterminate size='sm' />;
  } else if (isFailed) {
    progressBar = <Progress size='sm' value={100} color='warning' />;
  } else if (isUploading) {
    progressBar = <Progress size='sm' value={50} />;
  } else {
    progressBar = <Progress size='sm' value={100} />;
  }

  let primaryButton;
  if (isSuccess) {
    primaryButton = <Button color='success'>Download</Button>;
  } else if (isRunning) {
    primaryButton = <Button isDisabled>Upscale</Button>;
  } else if (isFailed) {
    primaryButton = <Button color='warning'>Retry</Button>;
  } else {
    primaryButton = <Button color='primary'>Upscale</Button>;
  }

  let secondaryButton;
  if (isSuccess) {
    secondaryButton = (
      <Button color='default' variant='light'>
        See Details
      </Button>
    );
  } else if (isRunning) {
    secondaryButton = (
      <Button isDisabled variant='light'>
        Cancel
      </Button>
    );
  } else if (isFailed) {
    secondaryButton = (
      <Button color='default' variant='light'>
        Cancel
      </Button>
    );
  } else {
    secondaryButton = (
      <Button color='default' variant='light'>
        Cancel
      </Button>
    );
  }

  return (
    <Card className='w-[256px] dark:bg-default-100/50' {...props}>
      <CardBody className='px-3 pb-1 gap-4'>
        <Image
          alt='Card image'
          className='aspect-square w-full object-cover object-center'
          src={imgSrc}
          isBlurred
          loading='lazy'
        />
        <div className='flex flex-col px-2'>
          <p className='text-large font-medium'>Card with thumbnail</p>
          <p className='text-small text-default-400'>
            This is a card with a thumbnail image on top.
          </p>
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

interface ControlPanelProps {
  action: any;
}

function ControlPanel({ action }: ControlPanelProps) {
  return (
    <Card className='w-[256px] h-[256px] flex flex-col items-center justify-center dark:bg-default-100/50'>
      <Button onClick={action}>Click Me!</Button>
    </Card>
  );
}

function Title() {
  return (
    <h1 className='text-72px font-medium text-foreground'>Image Upscaler</h1>
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
      size='lg'
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className='flex flex-col gap-12 w-full items-center mt-[96px]'>
      <Title />
      <ImageCompareModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        leftImage='https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'
        rightImage='https://images.pexels.com/photos/1921336/pexels-photo-1921336.jpeg'
      />
      <div className='flex-row flex gap-8'>
        <FileDropCard />
        <ControlPanel action={onOpen} />
      </div>
      <div className='grid max-w-8xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        <CardWithThumbnail
          imgSrc='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/airpods.png'
          isUploading
        />
        <CardWithThumbnail
          imgSrc='https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg'
          isFailed
        />
        <CardWithThumbnail
          imgSrc='https://images.pexels.com/photos/1921336/pexels-photo-1921336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          isSuccess
        />
        <CardWithThumbnail
          imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load'
          isRunning
        />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
      </div>
    </div>
  );
}
