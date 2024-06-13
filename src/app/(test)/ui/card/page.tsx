'use client';

import type { CardProps } from '@nextui-org/react';

import React from 'react';
import { Card, Image, CardBody, CardFooter, Button } from '@nextui-org/react';

interface CardWithThumbnailProps {
  props?: CardProps;
  imgSrc: string;
}

function CardWithThumbnail({ props, imgSrc }: CardWithThumbnailProps) {
  return (
    <Card className='w-[384px]' {...props}>
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

export default function Page() {
  return (
    <div className='flex flex-row items-center justify-center gap-4 h-screen'>
      <CardWithThumbnail imgSrc='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/airpods.png' />
      <CardWithThumbnail imgSrc='https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg' />
      <CardWithThumbnail imgSrc='https://images.pexels.com/photos/1921336/pexels-photo-1921336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
      <CardWithThumbnail imgSrc='https://images.pexels.com/photos/541484/sun-flower-blossom-bloom-pollen-541484.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' />
      <CardWithThumbnail imgSrc='https://images.pexels.com/photos/7377687/pexels-photo-7377687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' />
    </div>
  );
}
