'use client';
import BasicImageTaskApp from '../_components/basic-image-task-app';
import { filesAtomForColorizer } from '@/component/file';

export default function Colorizer() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForColorizer}
      title='Hello World'
      actionButtonText='Colorize'
      backendMethod='colorize_img'
    />
  );
}
