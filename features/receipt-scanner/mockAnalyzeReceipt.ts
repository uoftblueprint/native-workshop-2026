export type ReceiptResult = {
  merchant: string;
  total: number;
};

export async function mockAnalyzeReceipt(uri: string): Promise<ReceiptResult> {
  if (!uri) {
    throw new Error('There is no photo to read.');
  }

  // Fake on purpose. The photo is real. This text is not read from it.
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  return {
    merchant: 'Workshop Cafe',
    total: 14.82,
  };
}
