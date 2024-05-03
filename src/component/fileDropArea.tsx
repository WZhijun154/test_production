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
import { uploadFilesEndPoint } from './utils';
import axios from 'axios';
import { showErrorNotification } from './notify';

interface FileThumbnailProps {
  fileName: string;
  onDelete: (fileName: string) => void;
}

const DragHandle = SortableHandle(() => (
  <div className='absolute w-full h-full'></div>
));

const FileThumbnail: React.FC<FileThumbnailProps> = ({
  fileName,
  onDelete,
}) => {
  return (
    <div className='relative'>
      <div className='relative flex items-center justify-center border-dashed text-center bg-gray-100 bg-opacity-50 border-2 border-gray-300 rounded-lg m-3'>
        <div className='flex flex-col items-center justify-center px-4 py-4 gap-2 w-32 h-18'>
          <DragHandle /> {/* Drag only by this handle */}
          <Icon icon='mdi:file-outline' className='text-2xl' />
          <p className='text-sm truncate w-full'>{fileName}</p>
          <p className='text-xs'>Drag to sort</p>
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
  ({ fileName, onDelete }: FileThumbnailProps) => {
    return <FileThumbnail fileName={fileName} onDelete={onDelete} />;
  },
);

interface SortableListProps {
  fileNames: string[];
  onDelete: (fileName: string) => void;
}

const SortableList = SortableContainer<SortableListProps>(
  ({ fileNames, onDelete }: SortableListProps) => {
    return (
      <div className='flex flex-row justify-start items-start gap-0'>
        {fileNames.map((fileName, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            fileName={fileName}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  },
);

interface FileThumbnailAreaProps {
  fileNames: string[];
  onDelete: (fileName: string) => void;
  onSort: (newFileNames: string[]) => void;
}

const FileThumbnailArea: React.FC<FileThumbnailAreaProps> = ({
  fileNames,
  onDelete,
  onSort,
}) => {
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const newFileNames = arrayMove(fileNames, oldIndex, newIndex);
    onSort(newFileNames);
    console.log(newFileNames);
  };

  return (
    <SortableList
      fileNames={fileNames}
      onDelete={onDelete}
      onSortEnd={onSortEnd}
      axis='xy'
      useDragHandle={true}
    />
  );
};

export interface UploadFileInfo {
  filename: string;
}

interface FileDropAreaProps {
  uploadedFiles: UploadFileInfo[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFileInfo[]>>;
  allowFileTypes?: string[];
}

const FileDropArea: React.FC<FileDropAreaProps> = ({
  uploadedFiles,
  setUploadedFiles,
  allowFileTypes,
}) => {
  // const [uploadedFiles, setUploadedFiles] = useState<UploadFileInfo[]>([]);

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

  const onDelete = (fileName: string) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.filename !== fileName),
    );
  };

  const handleSort = (newFileNames: string[]) => {
    setUploadedFiles(
      newFileNames.map(
        (filename) =>
          uploadedFiles.find(
            ((file) => file.filename === filename)!,
          ) as UploadFileInfo,
      ),
    );
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    const session_id = encodeURIComponent(getSessionId() as string);
    formData.append('file', file);
    formData.append('session_id', session_id);

    const response = await axios.post(uploadFilesEndPoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      const data = response.data;
      setUploadedFiles((prev) => [...prev, { filename: data.filename }]);
      console.log('Success:', data);
    } else {
      console.error('Error:', response.statusText);
    }
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
      <FileThumbnailArea
        fileNames={uploadedFiles.map((file) => file.filename)}
        onDelete={onDelete}
        onSort={handleSort}
      />
    </div>
  );
};

export default FileDropArea;
