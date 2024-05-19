import { atom } from "jotai";

export interface FileInfoProps {
    fileName: string;
    fileUrl: string;
    progress: number;
    deleteMethod?: () => void;
}

export const filesAtomForUpscale = atom<FileInfoProps[]>([]);