import React from 'react';
import { useDropzone, DropzoneOptions, FileWithPath } from 'react-dropzone';
import { showErrorNotification } from '../utils/notify';

interface AppendMethods {
  [key: string]: any; // You can replace `any` with a more specific type if known
}

interface AppendAttributes {
  [key: string]: any; // You can replace `any` with a more specific type if known
}

interface FileDropAreaProps {
  allowFileTypes?: string[];
  children?: React.ReactNode;
  setFiles: React.Dispatch<React.SetStateAction<any>>;
  uploadMethod?: any;
  appendMethodsToFiles?: AppendMethods;
  appendAttributes?: AppendAttributes;
  enableClientDataReader?: boolean;
}

export const FileDropArea: React.FC<FileDropAreaProps> = ({
  allowFileTypes,
  children,
  uploadMethod,
  appendMethodsToFiles,
  appendAttributes,
  enableClientDataReader,
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
              setFiles((prev: any[]) =>
                prev.filter(
                  (prevFile: { fileName: string }) =>
                    prevFile.fileName !== file.name,
                ),
              );
            };

            setFiles((prev: any) => [
              ...prev,
              { fileName: file.name, fileUrl: '', progress: 0, deleteMethod },
            ]);

            if (enableClientDataReader) {
              const reader = new FileReader();
              reader.onload = () => {
                setFiles((prev: any[]) =>
                  prev.map((prevFile: { fileName: string }) =>
                    prevFile.fileName === file.name
                      ? { ...prevFile, fileUrlOnClient: reader.result }
                      : prevFile,
                  ),
                );
              };
              reader.readAsDataURL(file);
            }
          },
          onProgress: (progress: number) => {
            setFiles((prev: any[]) =>
              prev.map((prevFile: { fileName: string }) =>
                prevFile.fileName === file.name
                  ? { ...prevFile, progress }
                  : prevFile,
              ),
            );
          },
          onSuccess: (imageUrl: string) => {
            setFiles((prev: any[]) =>
              prev.map((prevFile: { fileName: string }) =>
                prevFile.fileName === file.name
                  ? {
                      ...prevFile,
                      progress: 100,
                      fileUrl: imageUrl,
                      // append methods to the file
                      ...appendMethodsToFiles,
                      // append attribtues to the file
                      ...appendAttributes,
                    }
                  : prevFile,
              ),
            );
            // set cancel to undefined to prevent unexisted cancel function to be called
            cancel = undefined;
          },
          onError: (error: any) => {
            setFiles((prev: any[]) =>
              prev.filter(
                (prevFile: { fileName: string }) =>
                  prevFile.fileName !== file.name,
              ),
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
