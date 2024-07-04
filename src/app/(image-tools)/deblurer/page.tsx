'use client';
import BasicImageTaskApp from '../_components/basic-image-task-app';
import { filesAtomForDeblurer } from '@/component/file';

export default function Denoiser() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForDeblurer}
      title='Hello World'
      actionButtonText='Deblur'
      backendMethod='deblur_img'
    />
  );
}
