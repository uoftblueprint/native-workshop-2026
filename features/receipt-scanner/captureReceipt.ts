export type ReceiptPhoto = {
  uri?: string;
};

export type ReceiptCamera = {
  takePictureAsync: (options?: { quality?: number }) => Promise<ReceiptPhoto | null | undefined>;
};

export async function captureReceipt(camera: ReceiptCamera | null): Promise<string> {
  // TODO RECEIPT 2
  // Take one picture and return its uri.
  //
  // Hints:
  // - If camera is missing, throw an error that says the camera is not ready.
  // - takePictureAsync takes the photo and returns a promise.
  // - The photo has a uri. If that is missing, throw. Otherwise return the uri string.
  throw new Error('TODO RECEIPT 2 has not been implemented yet.');
}
