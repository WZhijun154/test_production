import { FileInfoProps } from './file';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Progress } from '@nextui-org/react';

interface FileThumbnailProps {
  file: FileInfoProps;
  iconifyIcon: string;
}

export const FileThumbnail: React.FC<FileThumbnailProps> = ({
  file,
  iconifyIcon,
}) => {
  const progress = file.progress;
  const fileName = file.fileName;
  const isUploading = progress !== undefined && progress < 100;

  return (
    <div className='relative'>
      <div className='relative flex items-center justify-center border-dashed text-center bg-gray-100 bg-opacity-50 border-2 border-gray-300 rounded-lg m-3'>
        <div className='flex flex-col items-center justify-center px-4 py-4 gap-2 w-32 h-18'>
          <Icon icon={iconifyIcon} className='text-2xl' />
          <p className='text-sm truncate w-full'>{fileName}</p>
          {isUploading && <Progress value={progress} size='sm'></Progress>}
        </div>
      </div>
      <div
        className='absolute flex items-center justify-center top-1 right-1 text-black cursor-pointer z-10'
        onClick={(e) => {
          e.stopPropagation();
          file.deleteMethod && file.deleteMethod();
        }}
      >
        <Icon
          icon='mingcute:close-circle-fill'
          className='text-xl text-center opacity-100 hover:scale-125 transition-transform duration-300 ease-in-out'
        />
      </div>
    </div>
  );
};
