'use client';
import BasicImageTaskApp from '../_components/basic-image-task-app';
import { filesAtomForDenoiser } from '@/component/file';

export default function Denoiser() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForDenoiser}
      title='Hello World'
      actionButtonText='Denoise'
      backendMethod='denoise_img'
    />
  );
}
