import React from 'react';
import { Button, Input } from '@nextui-org/react';

export default function Component() {
  // Render the Image component only when the URL is ready
  return (
    <div className='bg-gray-50 w-screen h-screen px-10'>
      {/* <div className='absolute top-48 left-96 flex flex-col gap-4'>
        <div className='text-gray-50 text-16px bg-blue-500 px-4 py-3 rounded-sm text-center w-[128px] h-[48px] flex items-center justify-center'>
          Rounded-sm
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded text-center w-[128px] h-[48px] flex items-center justify-center'>
          Rounded
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded-md text-center w-[128px] h-[48px] flex items-center justify-center'>
          rounded-md
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded-lg text-center w-[128px] h-[48px] flex items-center justify-center'>
          rounded-lg
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded-xl text-center w-[128px] h-[48px] flex items-center justify-center hyphens-auto'>
          rounded-xl
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded-2xl text-center w-[128px] h-[48px] flex items-center justify-center'>
          rounded-2xl
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded-3xl text-center w-[128px] h-[48px] flex items-center justify-center'>
          rounded-3xl
        </div>
        <div className='text-gray-200 text-16px bg-blue-500 px-4 py-3 rounded-full text-center w-[128px] h-[48px] flex items-center justify-center'>
          rounded-full
        </div>
      </div> */}

      <div className='flex flex-col items-center justify-center w-full h-full'>
        <div className='rounded-md px-4 py-3 bg-main-100 shadow-xl'>
          <Input className='shadow-inner' />
          <p className='text-16px font-normal text-main-900'>
            Our privacy policy has changed
          </p>
          <p className='text-12px font-light text-gray-100'>
            Make sure you know how these changes affect you.
          </p>
        </div>
      </div>
    </div>
  );
}
