import { captureReceipt, type ReceiptCamera } from './captureReceipt';

function check(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : '';
}

describe('captureReceipt', () => {
  it('takes one picture and returns the uri', async () => {
    const camera: ReceiptCamera = {
      takePictureAsync: jest.fn(async () => ({ uri: 'file:///receipt.jpg' })),
    };

    let uri = '';
    try {
      uri = await captureReceipt(camera);
    } catch (error) {
      if (messageOf(error).includes('has not been implemented yet')) {
        throw new Error('captureReceipt still has the placeholder. Call takePictureAsync and return the uri.');
      }
      throw error;
    }

    check(uri === 'file:///receipt.jpg', 'captureReceipt should return the uri of the photo the camera took.');
    check(
      (camera.takePictureAsync as jest.Mock).mock.calls.length === 1,
      'captureReceipt should take one picture.',
    );
  });

  it('fails clearly when the camera is missing', async () => {
    try {
      await captureReceipt(null);
      throw new Error('captureReceipt should throw when the camera is missing.');
    } catch (error) {
      const message = messageOf(error);
      if (message.includes('has not been implemented yet')) {
        throw new Error('captureReceipt still has the placeholder. Throw if the camera is missing.');
      }
      if (message === 'captureReceipt should throw when the camera is missing.') {
        throw error;
      }
      check(/camera/i.test(message), 'When the camera is missing, throw an error that says the camera is not ready.');
    }
  });

  it('fails clearly when the photo has no uri', async () => {
    const camera: ReceiptCamera = {
      takePictureAsync: jest.fn(async () => undefined),
    };

    try {
      await captureReceipt(camera);
      throw new Error('captureReceipt should throw when the photo has no uri.');
    } catch (error) {
      const message = messageOf(error);
      if (message.includes('has not been implemented yet')) {
        throw new Error('captureReceipt still has the placeholder. Throw if the photo has no uri.');
      }
      if (message === 'captureReceipt should throw when the photo has no uri.') {
        throw error;
      }
      check(
        /photo|image|uri/i.test(message),
        'When the camera returns no photo uri, throw an error that says so.',
      );
    }
  });
});
