import React from 'react';
import { useDropzone, DropzoneOptions, FileWithPath } from 'react-dropzone';
import { Icon } from '@iconify/react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { arrayMove } from 'react-sortable-hoc';
import { getSessionId } from './cookie';
import { uploadFilesEndPoint } from '../utils/endpoint';
import { showErrorNotification } from '../utils/notify';
import { upload } from './upload';
import { Progress } from '@nextui-org/react';
import { atom, useAtomValue, useSetAtom } from 'jotai';

export interface UploadFileInfoProps {
  fileName: string;
  progress: number;
}

interface FileThumbnailProps {
  uploadedFileInfo: UploadFileInfoProps;
}
export const uploadedFilesAtom = atom<UploadFileInfoProps[]>([]);

const DragHandle = SortableHandle(() => (
  <div className='absolute w-full h-full'></div>
));

const FileThumbnail: React.FC<FileThumbnailProps> = ({ uploadedFileInfo }) => {
  const progress = uploadedFileInfo.progress;
  const fileName = uploadedFileInfo.fileName;
  const isUploading = progress !== undefined && progress < 100;
  const setUploadedFiles = useSetAtom(uploadedFilesAtom);
  const onDelete = (fileName: string) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.fileName !== fileName),
    );
  };

  return (
    <div className='relative'>
      <div className='relative flex items-center justify-center border-dashed text-center bg-gray-100 bg-opacity-50 border-2 border-gray-300 rounded-lg m-3'>
        <div className='flex flex-col items-center justify-center px-4 py-4 gap-2 w-32 h-18'>
          <DragHandle /> {/* Drag only by this handle */}
          <Icon icon='mdi:file-outline' className='text-2xl' />
          <p className='text-sm truncate w-full'>{fileName}</p>
          {isUploading && <Progress value={progress} size='sm'></Progress>}
          {!isUploading && <p className='text-xs'>Drag to sort</p>}
        </div>
      </div>
      <div
        className='absolute flex items-center justify-center top-1 right-1 text-black cursor-pointer z-10'
        onClick={(e) => {
          e.stopPropagation();
          onDelete(fileName);
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

const SortableItem = SortableElement<FileThumbnailProps>(
  ({ uploadedFileInfo }: FileThumbnailProps) => {
    return <FileThumbnail uploadedFileInfo={uploadedFileInfo} />;
  },
);

const SortableList = SortableContainer(() => {
  const uploadedFileInfos = useAtomValue(uploadedFilesAtom);

  return (
    <div className='flex flex-row justify-start items-start gap-0'>
      {uploadedFileInfos.map((uploadedFileInfo, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          uploadedFileInfo={uploadedFileInfo}
        />
      ))}
    </div>
  );
});

const FileThumbnailArea: React.FC = () => {
  const uploadedFileInfos = useAtomValue(uploadedFilesAtom);
  const setUploadedFiles = useSetAtom(uploadedFilesAtom);
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const newUploadedFileInfos = arrayMove(
      uploadedFileInfos,
      oldIndex,
      newIndex,
    );
    setUploadedFiles(newUploadedFileInfos);
  };

  return <SortableList onSortEnd={onSortEnd} axis='xy' useDragHandle={true} />;
};

interface FileDropAreaProps {
  allowFileTypes?: string[];
}

const FileDropArea: React.FC<FileDropAreaProps> = ({ allowFileTypes }) => {
  const setUploadedFiles = useSetAtom(uploadedFilesAtom);
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      if (allowFileTypes) {
        if (allowFileTypes.includes(file.type)) {
          uploadFile(file);
        } else {
          showErrorNotification('Invalid file type of ' + file.name);
          return;
        }
      } else {
        uploadFile(file);
      }
    });
  };

  const uploadFile = async (file: File) => {
    upload({
      file: file,
      chunkSize: 512 * 1024,
      endpoint: uploadFilesEndPoint,
      sessionId: getSessionId() as string,
      onStart: () => {
        setUploadedFiles((prev) => [
          ...prev,
          { fileName: file.name, progress: 0 },
        ]);
      },
      onProgress: (percentage) => {
        setUploadedFiles((prev) =>
          prev.map((prevFile) =>
            prevFile.fileName === file.name
              ? { fileName: prevFile.fileName, progress: percentage }
              : prevFile,
          ),
        );
      },
      onSucess: () => {},
      onError: (error) => {
        console.error('Error:', error);
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  } as DropzoneOptions);

  return (
    <div className='flex flex-col items-center justify-center gap-y-4'>
      <div
        {...getRootProps()}
        className='flex items-center justify-center border-dashed text-center bg-gray-100 bg-opacity-50 h-48 w-96 border-2 border-gray-300 cursor-pointer rounded-lg text-black text-xl space-x-unit-xs'
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className=''>Drop the files here ...</p>
        ) : (
          <div>
            <p>Drag 'n' drop some files here</p>
            <p>or click to select files</p>
          </div>
        )}
      </div>
      <FileThumbnailArea />
    </div>
  );
};

export default FileDropArea;
