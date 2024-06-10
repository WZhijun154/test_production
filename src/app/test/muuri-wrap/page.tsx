'use client';
import React from 'react';

export const ExampleCard = ({ body }) => {
  return (
    <div className='item w-40'>
      <div className='item-content'>
        <div className='card bg-gray-800 text-white p-4 rounded-lg shadow-lg'>
          <div className='card-header mb-4'>
            <h2 className='text-lg font-bold'>Card Title</h2>
            <p className='text-sm text-gray-400'>Card Description</p>
          </div>
          <div className='card-body mb-4 overflow-hidden text-wrap break-words'>
            <p>{body}</p>
          </div>
          <div className='card-footer'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center border-4 border-warning-200'></div>
  );
};

export default Page;
