import React from 'react';
import {
  Image,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Spinner,
  Link,
} from '@nextui-org/react';

import { UpscaleStatus, FileInfoPropsForBgRemover } from './file';

interface ImageUpscaleTaskCardProps {
  file: any;
  width?: string;
  height?: string;
}

export function ImageUpscaleTaskCard({ file }: ImageUpscaleTaskCardProps) {
  const {
    fileName,
    fileUrlOnClient,
    upscaleStatus,
    fileUrl,
    upscaleMethod,
    deleteMethod,
  } = file;

  const isSuccessful = upscaleStatus === UpscaleStatus.SUCCEEDED;

  return (
    <Card className='bg-gray-400' isFooterBlurred>
      {upscaleStatus === UpscaleStatus.NOT_READY ||
      upscaleStatus === undefined ? (
        // <div className='flex items-center justify-center h-80'>
        //   <Spinner color='primary' size='lg'>
        //     Loading...
        //   </Spinner>
        // </div>
        <Image
          alt='Card background'
          className='object-cover rounded-xl w-full h-80'
          src={fileUrlOnClient}
          isBlurred
        />
      ) : (
        <Image
          alt='Card background'
          className='object-cover rounded-xl w-full h-80'
          src={fileUrl}
          isBlurred
        />
      )}
      <CardFooter className='gap-4 flex flex-col before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
        <small className='text-black'>{fileName}</small>
        <small className='text-black'>{upscaleStatus}</small>

        <div className='flex flex-row items-center justify-end gap-2 w-full'>
          <Button
            color={isSuccessful ? 'success' : 'primary'}
            size='sm'
            variant='shadow'
            onClick={isSuccessful ? () => {} : () => upscaleMethod(file)}
            isLoading={
              upscaleStatus === UpscaleStatus.STARTED ||
              upscaleStatus === UpscaleStatus.IN_PROGRESS
            }
          >
            {isSuccessful ? (
              <Link
                href={`/compare/${encodeURIComponent(
                  file.fileUrl,
                )}/${encodeURIComponent(file.upscaledUrl)}`}
              >
                Details
              </Link>
            ) : (
              'Upscale'
            )}
          </Button>
          <Button color='danger' size='sm' onClick={deleteMethod}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// export function ImageBgRemoveTaskCard({
//   file,
// }: {
//   file: FileInfoPropsForBgRemover;
// }) {
//   const {
//     fileName,
//     bgRemoveStatus,
//     fileUrl,
//     bgRemoveMethod,
//     deleteMethod,
//     fileUrlOnClient,
//   } = file;

//   const isSuccessful = false;

//   return (
//     <Card className='bg-gray-400' isFooterBlurred>
//       {false ? (
//         <div className='flex items-center justify-center h-80'>
//           <Spinner color='primary' size='lg'>
//             Loading...
//           </Spinner>
//         </div>
//       ) : (
//         <Image
//           alt='Card background'
//           className='object-cover rounded-xl w-full h-80'
//           src={fileUrlOnClient}
//           isBlurred
//         />
//       )}
//       <CardFooter className='gap-4 flex flex-col before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
//         <small className='text-black'>{fileName}</small>
//         <small className='text-black'>{bgRemoveStatus}</small>

//         <div className='flex flex-row items-center justify-end gap-2 w-full'>
//           <Button
//             color={isSuccessful ? 'success' : 'primary'}
//             size='sm'
//             variant='shadow'
//             onClick={isSuccessful ? () => {} : () => bgRemoveMethod(file)}
//             isLoading={
//               bgRemoveStatus === UpscaleStatus.STARTED ||
//               bgRemoveStatus === UpscaleStatus.IN_PROGRESS
//             }
//           >
//             {isSuccessful ? (
//               <Link
//                 href={`/compare/${encodeURIComponent(
//                   file.fileUrlOnClient,
//                 )}/${encodeURIComponent(file.upscaledUrl)}`}
//               >
//                 Details
//               </Link>
//             ) : (
//               'Remove BG'
//             )}
//           </Button>
//           <Button color='danger' size='sm' onClick={deleteMethod}>
//             Delete
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
