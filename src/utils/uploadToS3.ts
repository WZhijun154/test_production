import { showErrorNotification } from './notify';
import { FileWithPath } from 'react-dropzone';

export interface uploadToS3Props {
  file: FileWithPath;
  onStart: () => void;
  onProgress: (progress: number) => void;
  onSuccess: (imageUrl: string) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export function uploadToS3({
  file,
  onStart,
  onProgress,
  onSuccess,
  onError,
  onCancel,
}: uploadToS3Props): { promise: Promise<string | null>; cancel: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<string | null>(async (resolve, reject) => {
    onStart(); // Call onStart before starting the upload process

    try {
      const response = await fetch(
        `/api/generate-presigned-url?fileName=${file.name}&fileType=${file.type}`
      );

      if (!response.ok) {
        throw new Error('Failed to generate presigned URL');
      }

      const { uploadURL } = await response.json();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress); // Update progress
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const imageUrl = uploadURL.split('?')[0];
          onSuccess(imageUrl); // Call onSuccess with the image URL
          resolve(imageUrl);
        } else {
          const errorMessage = 'Failed to upload file';
          showErrorNotification(errorMessage);
          onError(new Error(errorMessage)); // Call onError with the error
          resolve(null);
        }
      };

      xhr.onerror = () => {
        const errorMessage = 'Failed to upload file';
        showErrorNotification(errorMessage);
        onError(new Error(errorMessage)); // Call onError with the error
        resolve(null);
      };

      xhr.onabort = () => {
        // const errorMessage = 'Upload canceled';
        // showErrorNotification(errorMessage);
        // onError(new Error(errorMessage)); // Call onError with the error
        onCancel?.(); // Call onCancel if provided
        resolve(null);
      };

      xhr.open('PUT', uploadURL, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    } catch (error) {
      const errorMessage = 'Failed to generate presigned URL';
      showErrorNotification(errorMessage);
      onError(error); // Call onError with the error
      reject(error);
    }
  });

  const cancel = () => {
    xhr.abort(); // Actively cancel the PUT request
  };

  return { promise, cancel };
}
