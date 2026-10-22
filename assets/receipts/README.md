# Sample receipts

For the instructor. Students do not need to add anything here.

The scanner uses the phone camera. These images are optional extras for slides or a demo.

1. Put image files in this folder. JPG or PNG is fine.
2. Register each one in `index.ts`:

```ts
export const sampleReceipts = {
  cafe: require("./cafe.jpg"),
};
```

3. Reload the app if something imports this file.

If this folder is empty, the workshop still runs. The scanner does not read these files.
