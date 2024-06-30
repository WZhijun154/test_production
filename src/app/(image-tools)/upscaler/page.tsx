'use client';
import BasicImageTaskApp from '../_components/basic-image-task-app';
import { filesAtomForUpscaler } from '@/component/file';

export default function Upscaler() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForUpscaler}
      title='Hello World'
      actionButtonText='Upscale'
      backendMethod='upscale_img'
    />
  );
}
