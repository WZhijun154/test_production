import React from 'react';
import { Card } from '@nextui-org/react';

function LandingPageCard() {
  // Render the Image component only when the URL is ready
  return (
    <Card className='w-[512px] p-4 bg-main-100 flex-col flex' isHoverable>
      <p className='text-xl text-main-900 tracking-wider'>IMAGE UPSCALER</p>
      <p className='text-base text-cool-gray-900'>
        Upscale your images with the power of AI
      </p>
    </Card>
  );
}

function LandingCardForUpscaler() {
  return <div className='w-full flex flex-col'>Upscaler</div>;
}

function Bar() {
  return <div className='w-full h-[4px] bg-main-500'></div>;
}

function Introduction() {
  return (
    <div className='w-full h-[512px] flex flex-col bg-main-900 items-center justify-center bg-custom-gradient'>
      <p className=' text-72px  text-main-100'>Welcome to Image io !</p>
      <p className=' text-48px text-cool-gray-100'>
        Enhance your images with the power of AI
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <div className='flex flex-col w-full justify-center items-center'>
      <Bar></Bar>
      <Introduction></Introduction>
      <LandingCardForUpscaler />
    </div>
  );
}
