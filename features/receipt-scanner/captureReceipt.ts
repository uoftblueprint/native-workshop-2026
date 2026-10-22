export type ReceiptPhoto = {
  uri?: string;
};

export type ReceiptCamera = {
  takePictureAsync: (options?: { quality?: number }) => Promise<ReceiptPhoto | null | undefined>;
};

export async function captureReceipt(camera: ReceiptCamera | null): Promise<string> {
  if (!camera) {
    throw new Error('Camera is not ready yet.');
  }

  const photo = await camera.takePictureAsync({ quality: 0.7 });

  if (!photo?.uri) {
    throw new Error('The camera did not return a photo.');
  }

  return photo.uri;
}
