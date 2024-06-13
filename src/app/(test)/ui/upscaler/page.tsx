'use client';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  CardProps,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';

interface CardWithThumbnailProps {
  props?: CardProps;
  imgSrc: string;
}

function CardWithThumbnail({ props, imgSrc }: CardWithThumbnailProps) {
  return (
    <Card className='w-[256px]' {...props}>
      <CardBody className='px-3 pb-1 gap-4'>
        <Image
          alt='Card image'
          className='aspect-square w-full object-cover object-center'
          src={imgSrc}
        />
        <div className='flex flex-col px-2'>
          <p className='text-large font-medium'>Card with thumbnail</p>
          <p className='text-small text-default-400'>
            This is a card with a thumbnail image on top.
          </p>
        </div>
      </CardBody>
      <CardFooter className='justify-end gap-2'>
        <Button variant='light' color='default'>
          Cancel
        </Button>
        <Button color='primary'>Continue</Button>
      </CardFooter>
    </Card>
  );
}

function FileDropCard() {
  return (
    <Card
      className='w-[768px] h-[256px] flex flex-col justify-center items-center'
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

function ControlPanel() {
  return (
    <Card className='w-[256px] h-[256px] flex flex-col items-center justify-center'>
      Control Panel
    </Card>
  );
}

function Title() {
  return <h1 className='text-72px font-semibold'>Image Upscaler</h1>;
}

export default function Upscaler() {
  return (
    <div className='flex flex-col gap-12 w-full items-center mt-[96px]'>
      <Title />
      <div className='flex-row flex gap-8'>
        <FileDropCard />
        <ControlPanel />
      </div>
      <div className='grid max-w-8xl grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        <CardWithThumbnail imgSrc='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/airpods.png' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/1921336/pexels-photo-1921336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
        <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
      </div>
    </div>
  );
}
