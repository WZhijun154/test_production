import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

export interface FileInfoProps {
  fileName: string;
  fileUrl: string;
  progress: number;
  fileUrlOnClient?: string;
  deleteMethod?: () => void;
}

export enum UpscaleStatus {
  NOT_READY = 'NOT_READY',
  READY = 'READY',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export interface FileInfoPropsForUpscale extends FileInfoProps {
  upscaleMethod: any;
  upscaleStatus: UpscaleStatus;
  upscaledUrl: string;
}

export const filesAtomForUpscale = atom<FileInfoPropsForUpscale[]>([]);

export enum BgRemoveStatus {
  NOT_READY = 'NOT_READY',
  READY = 'READY',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export interface FileInfoPropsForBgRemover extends FileInfoProps {
  bgRemoveMethod: any;
  bgRemovedUrl: string;
  bgRemoveStatus: BgRemoveStatus;
}

export const filesAtomForBgRemover = atom<FileInfoPropsForBgRemover[]>([]);
