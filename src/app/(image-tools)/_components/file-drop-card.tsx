import { Card } from '@nextui-org/react';
import { Icon } from '@iconify/react';

export function FileDropCard() {
  return (
    <Card
      className='w-[768px] h-[256px] flex flex-col justify-center items-center dark:bg-default-100/50'
      style={{
        boxShadow:
          '0 2px 0 hsla(0, 0%, 100%, 0.2), inset 0 2px 2px hsla(0, 0%, 0%, 0.7)',
      }}
    >
      <Icon icon='bytesize:upload' className='text-48px' />
      <p className='text-30px text-default-600'>
        Add file or drop image files here
      </p>
      <p className='text-16px text-default-400'>
        Supports JPG, JPEG, PNG, WEBP or BMP up to 30MB and 2000x2000
      </p>
    </Card>
  );
}
