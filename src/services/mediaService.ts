import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../lib/firebase';
import { StoredMediaFile } from '../types/admin';

export interface UploadResult {
  url: string;
  storagePath: string;
  fileName: string;
  size: number;
  contentType: string;
}

/**
 * Converts a base64 Data URL (e.g. from canvas or thumbnail editor) to a Blob.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads an image or video file to Firebase Cloud Storage.
 *
 * @param file The File or Blob to upload
 * @param folder Directory inside storage, e.g. 'photos', 'videos', 'thumbnails'
 * @param onProgress Callback function reporting percentage (0-100)
 */
export async function uploadMediaToStorage(
  file: File | Blob,
  folder: 'photos' | 'videos' | 'thumbnails' | 'avatars' | 'general' = 'photos',
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const isBlobOnly = !(file instanceof File);
  const originalName = isBlobOnly ? `capture_${Date.now()}.jpg` : file.name;
  const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `media/${folder}/${timestamp}_${cleanName}`;
  const contentType = file.type || (folder === 'videos' ? 'video/mp4' : 'image/jpeg');

  // If Firebase is configured, upload to real Firebase Cloud Storage
  if (isFirebaseConfigured() && storage) {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType,
      customMetadata: {
        originalName,
        uploadedAt: new Date().toISOString(),
      },
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('[MediaService] Upload failed:', error);
          reject(new Error(`Upload to Firebase Storage failed: ${error.message}`));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              url: downloadUrl,
              storagePath,
              fileName: originalName,
              size: file.size,
              contentType,
            });
          } catch (err: any) {
            reject(new Error(`Failed to retrieve download URL: ${err.message}`));
          }
        }
      );
    });
  }

  // Graceful Local Fallback: If Firebase Storage is not yet configured,
  // simulate progress and warn the user.
  console.warn(
    '[MediaService] Firebase Storage is not configured. Media cannot be permanently stored across devices until VITE_FIREBASE_STORAGE_BUCKET is provided.'
  );

  if (onProgress) {
    for (let p = 10; p <= 100; p += 25) {
      await new Promise((r) => setTimeout(r, 60));
      onProgress(p);
    }
  }

  // Convert to persistent base64 data URL for local preview testing so it won't break on refresh
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    url: dataUrl,
    storagePath: `local-demo/${folder}/${cleanName}`,
    fileName: originalName,
    size: file.size,
    contentType,
  };
}

/**
 * Deletes a file from Firebase Cloud Storage by its path.
 */
export async function deleteMediaFromStorage(storagePath?: string): Promise<void> {
  if (!storagePath || storagePath.startsWith('local-demo/')) return;
  if (isFirebaseConfigured() && storage) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      console.info('[MediaService] Deleted storage asset:', storagePath);
    } catch (err: any) {
      console.warn('[MediaService] Could not delete file from storage (might have been removed already):', err.message);
    }
  }
}
