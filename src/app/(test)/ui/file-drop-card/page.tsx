'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Card } from '@nextui-org/react';
import React from 'react';

export default function FileDropCard() {
  return (
    <div className='flex w-full h-screen flex-col items-center justify-center'>
      <Card
        className='w-[640px] h-[256px] flex flex-col justify-center items-center'
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
    </div>
  );
}
