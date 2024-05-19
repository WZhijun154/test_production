import React from 'react';
import { useDropzone, DropzoneOptions, FileWithPath } from 'react-dropzone';
import { showErrorNotification } from '../utils/notify';
import { FileInfoProps } from './file';

interface FileDropAreaProps {
  allowFileTypes?: string[];
  children?: React.ReactNode;
  setFiles: React.Dispatch<React.SetStateAction<FileInfoProps[]>>;
  uploadMethod?: any;
}

export const FileDropArea: React.FC<FileDropAreaProps> = ({
  allowFileTypes,
  children,
  uploadMethod,
  setFiles,
}) => {
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach(async (file) => {
      if (allowFileTypes && !allowFileTypes.includes(file.type)) {
        showErrorNotification('Invalid file type: ' + file.name);
        return;
      }

      if (uploadMethod) {
        const uploadMethodProps = {
          file: file,
          onStart: () => {
            const deleteMethod = () => {
              if (cancel) cancel();
              setFiles((prev) =>
                prev.filter((prevFile) => prevFile.fileName !== file.name),
              );
            };

            setFiles((prev) => [
              ...prev,
              { fileName: file.name, fileUrl: '', progress: 0, deleteMethod },
            ]);
          },
          onProgress: (progress: number) => {
            setFiles((prev) =>
              prev.map((prevFile) =>
                prevFile.fileName === file.name
                  ? { ...prevFile, progress }
                  : prevFile,
              ),
            );
          },
          onSuccess: (imageUrl: string) => {
            setFiles((prev) =>
              prev.map((prevFile) =>
                prevFile.fileName === file.name
                  ? {
                      ...prevFile,
                      progress: 100,
                      fileUrl: imageUrl,
                    }
                  : prevFile,
              ),
            );
            // set cancel to undefined to prevent unexisted cancel function to be called
            cancel = undefined;
          },
          onError: (error: any) => {
            setFiles((prev) =>
              prev.filter((prevFile) => prevFile.fileName !== file.name),
            );
            showErrorNotification('Failed to upload file');
            console.log(error);
          },
        };

        const result = uploadMethod(uploadMethodProps);
        const promise = result.promise;
        // the cancel is hoisted to the top, so it can be used in the deleteMethod
        let cancel = result.cancel;

        try {
          await promise;
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  } as DropzoneOptions);

  return (
    <div {...getRootProps()} className='overflow-clip'>
      <input {...getInputProps()} />
      <div className='relative'>
        {children}
        {isDragActive && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold rounded-lg'>
            Drop Here
          </div>
        )}
      </div>
    </div>
  );
};
