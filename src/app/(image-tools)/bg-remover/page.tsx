'use client';
import BasicImageTaskApp from '../_components/basic-image-task-app';
import { filesAtomForUpscaler } from '@/component/file';

export default function BgRemover() {
  return (
    <BasicImageTaskApp
      filesAtom={filesAtomForUpscaler}
      title='Hello World'
      actionButtonText='Remove'
      backendMethod='remove_bg'
    />
  );
}
