'use client';

import FileDropArea from './fileDropArea';
import { Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { mergePdfEndPoint, downloadEndPoint } from './utils';
import { getSessionId } from './cookie';
import axios from 'axios';
import { showSuccessNotification } from './notify';
import { useAtomValue, useSetAtom } from 'jotai';
import { uploadedFilesAtom } from './fileDropArea';
import { UploadFileInfoProps } from './fileDropArea';

enum MergeState {
  UNAIVIABLE = 'UNAIVIABLE',
  STANDBY = 'STANDBY',
  MERGING = 'MERGING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export default function PdfMergeApp() {
  // const [uploadedFiles, setUploadedFiles] = useState<UploadFileInfo[]>([]);
  const uploadedFiles = useAtomValue(uploadedFilesAtom);
  const setUploadedFiles = useSetAtom(uploadedFilesAtom);

  const [mergeState, setMergeState] = useState<MergeState>(
    MergeState.UNAIVIABLE,
  );
  const [mergedFileName, setMergedFileName] = useState<string>('');

  const afterSetUploadedFiles = (newFiles: UploadFileInfoProps[]) => {
    setMergeState(
      newFiles.length > 1 ? MergeState.STANDBY : MergeState.UNAIVIABLE,
    );
  };

  // Effect hook to react to changes in uploadedFiles
  useEffect(() => {
    afterSetUploadedFiles(uploadedFiles);
  }, [uploadedFiles]); // Dependency array includes uploadedFiles

  const mergeButtonHandler = async () => {
    if (mergeState == MergeState.DONE) {
      window.location.href =
        downloadEndPoint + '/' + getSessionId() + '/' + mergedFileName;
      return;
    }
    const fileNames = uploadedFiles.map((file) => file.filename);
    const encodedSessionId = encodeURIComponent(getSessionId() as string);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 500000,
    };
    const request_body = {
      file_names: fileNames,
      session_id: encodedSessionId,
    };

    try {
      setMergeState(MergeState.MERGING);
      const response = await axios.post(mergePdfEndPoint, request_body, config);
      if (response.status == 200) {
        setMergedFileName(response.data.output_file_name);
        setMergeState(MergeState.DONE);
        showSuccessNotification(
          'Your pdf files has been merged, clicked to download!',
        );
      }
    } catch (error) {
      console.error(error);
      setMergeState(MergeState.ERROR);
    }
  };

  const getButtonText = (mergeState: MergeState) => {
    switch (mergeState) {
      case MergeState.STANDBY:
        return 'Merge PDFs';
      case MergeState.MERGING:
        return 'Merging...';
      case MergeState.DONE:
        return 'Download Merged PDF';
      case MergeState.ERROR:
        return 'Error: Try Again';
      default:
        return 'Merge PDFs'; // Default case, should not ideally be hit
    }
  };

  const getButtonColor = (mergeState: MergeState) => {
    switch (mergeState) {
      case MergeState.STANDBY:
        return 'primary';
      case MergeState.MERGING:
        return 'primary';
      case MergeState.DONE:
        return 'success';
      case MergeState.ERROR:
        return 'warning';
      default:
        return 'primary'; // Default case, should not ideally be hit
    }
  };

  return (
    <div className='flex flex-col items-center w-full h-screen'>
      <h1 className='text-black text-3xl font-bold mb-2 mt-16'>
        Merge PDF Files Online
      </h1>
      <h2 className=' text-gray-500 text-2xl mb-12'>
        Combine multiple PDFs into one
      </h2>
      <div className='flex flex-col items-center justify-center gap-y-4 w-full'>
        <FileDropArea
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          allowFileTypes={['application/pdf']}
        />
        <Button
          color={getButtonColor(mergeState)}
          isDisabled={
            mergeState == MergeState.UNAIVIABLE ||
            mergeState == MergeState.MERGING
          }
          isLoading={mergeState == MergeState.MERGING}
          onClick={mergeButtonHandler}
        >
          {getButtonText(mergeState)}
        </Button>
      </div>
    </div>
  );
}
