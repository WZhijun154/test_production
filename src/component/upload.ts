import axios from "axios";

interface UploadProps {
    file: File,
    chunkSize: number,
    endpoint: string,
    sessionId: string,
    onStart?: () => void // Callback to handle upload start
    onProgress?: (percentage: number) => void // Callback to update progress in the UI
    onSucess?: () => void // Callback to handle successful upload
    onError?: (error: any) => void // Callback to handle upload error
}

export const upload = async ({ file, chunkSize, endpoint, sessionId, onStart, onProgress, onSucess, onError }: UploadProps): Promise<void> => {
    if (file === null) return;

    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedBytes = 0;

    if (onStart) {
        onStart();
    }
    for (let start = 0; start < file.size; start += chunkSize) {
        const chunk = file.slice(start, Math.min(start + chunkSize, file.size));
        const formData = new FormData();
        formData.append('chunk', chunk, file.name);
        formData.append('session_id', sessionId);
        formData.append('chunk_index', (start / chunkSize).toString());
        formData.append('total_chunks', totalChunks.toString());

        try {
            await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    
                },
                onUploadProgress: progressEvent => {
                    // Since we're not sure of the exact load this callback represents,
                    // we update the progress based on chunk completion instead.
                }
            });

            // Successfully uploaded a chunk
            uploadedBytes += chunk.size; // We assume the chunk was fully sent
            const percentage = (uploadedBytes / file.size) * 100;
            if (onProgress) {
                onProgress(percentage);  // Update progress
            }
        } catch (error) {
            if (onError) {
                onError(error);
            }
            // Consider how to handle retries or continuation here
            break;  // Stop uploading if any chunk fails
        }
    }
    if (uploadedBytes === file.size) {
        if (onSucess) {
            onSucess();
        }
    }
};


