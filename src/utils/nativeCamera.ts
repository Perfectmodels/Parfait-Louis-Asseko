import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const takePhoto = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Camera only available on native platforms');
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    return image.dataUrl || null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

export const pickFromGallery = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Gallery only available on native platforms');
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl || null;
  } catch (error) {
    console.error('Error picking from gallery:', error);
    return null;
  }
};
