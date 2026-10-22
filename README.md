# Mobile Workshop

You are going to use real phone features: motion, the camera, haptics, and a networked light.

The screens are already built. Your job is the small TODOs.

Some TODOs include a `notUsedYet(...)` line. Delete that line when you use the values inside it.

Use Node 22. If you use nvm, run `nvm use` first.

Use a physical phone. A simulator will not tilt, shake, or show a real camera.

## Start here

Install everything:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Open Expo Go on your phone and scan the QR code.

Keep your laptop and phone on the same network.

## 1. Level

This one feels like the level in a phone's measuring tools. Tilt until the screen turns green.

Open:

`app/level.tsx`

and:

`features/level/level.ts`

### TODO 1

Connect `DeviceMotion` to the provided state.

Look for:

`TODO LEVEL 1`

Hints:

- `addListener` is already set up. Fill in the function it calls.
- `event.rotation.gamma` is the left-to-right tilt, in radians.
- Pass that number to `setRollRadians`. Delete the `notUsedYet(...)` line.

Check it:

Move your phone. The debug value should start changing.

### TODO 2

Convert the rotation from radians into degrees.

Look for:

`TODO LEVEL 2`

Hints:

- A full circle is 360 degrees, or `2 * Math.PI` radians.
- `Math.PI` is built in.
- Keep the sign. Tilting left and right should not both become positive.

Check it:

```bash
npm run test:level
```

The big number should stop saying 999 and start following the phone.

### TODO 3

Decide when the phone is close enough to zero to call it level.

Look for:

`TODO LEVEL 3`

Hints:

- `degrees === 0` is too strict. The sensor will not sit perfectly still.
- Use a small tolerance, a couple of degrees.
- Check both directions, so negative degrees count too.

Check it:

The screen should turn green when you are close to 0°.

```bash
npm run test:level
```

### TODO 4

Tap the phone once when it becomes level. Do not keep tapping while it stays there.

Look for:

`TODO LEVEL 4`

Hints:

- `wasLevelRef.current` is the previous reading.
- You want the moment it changes from not level to level.
- `Haptics.impactAsync` plays a single tap. `ImpactFeedbackStyle` has Light, Medium, and Heavy.
- Leave the line that stores `wasLevelRef.current`. It is already in the right place.

Check it:

You should feel one tap when you reach level. Tip the phone away and come back. You should feel one tap again.

## 2. Receipt scanner

You are going to take a real photo. We're mocking the OCR part today so we can focus on the camera.

Open:

`app/receipt-scanner.tsx`

and:

`features/receipt-scanner/captureReceipt.ts`

### TODO 1

Ask for camera permission when the button is pressed.

Look for:

`TODO RECEIPT 1`

Hints:

- `requestPermission` comes from `useCameraPermissions`.
- Call it. You do not need to save the result yourself.
- The screen already decides what to show from `permission`.

Check it:

The permission prompt should appear. After you allow it, the camera preview shows up.

### TODO 2

Take a picture and return the file URI.

Look for:

`TODO RECEIPT 2`

Hints:

- If `camera` is missing, throw an error that says the camera is not ready.
- Call `takePictureAsync` on the camera. It returns a promise.
- The photo has a `uri`. If that is missing, throw. Otherwise return it.

Check it:

```bash
npm run test:receipt
```

### TODO 3

Connect the photo to the screen.

Look for:

`TODO RECEIPT 3`

Hints:

- `cameraFromRef(cameraRef)` gives you the camera, or null.
- `captureReceipt` returns a uri. `setPhotoUri` shows it.
- `mockAnalyzeReceipt` takes that uri and returns the merchant and total. Save it with `setReceipt`.

Check it:

Take a photo of anything. You should see the picture, then Workshop Cafe and $14.82.

## 3. Lightbox

This talks to a workshop server that puts a light on the projector. You do not configure the URL. If the screen says it is not configured, ask the instructor.

Open:

`app/lights.tsx`

`features/lights/lightApi.ts`

and:

`features/lights/shake.ts`

### TODO 1

Create a light.

Look for:

`TODO LIGHTS 1`

Hints:

- Send a POST request with `fetch`.
- `workshopUrl('/api/lights')` is the address.
- The body is JSON: `{ name }`. Set the `Content-Type` header to `application/json`.
- Pass the response to `readResponse`.

Check it:

```bash
npm run test:lights
```

Then add a light from the app. The projector should show it.

### TODO 2

Turn the light on and off.

Look for:

`TODO LIGHTS 2`

Hints:

- This one is a PATCH request.
- The path is `/api/lights/` plus the id. `workshopUrl` can build it.
- The JSON body is `{ isOn }`.
- `readResponse` parses the result.

Check it:

```bash
npm run test:lights
```

The button in the app should turn your light on and off.

### TODO 3

Decide what counts as a shake.

Look for:

`TODO LIGHTS 3`

Hints:

- A still phone is not a zero reading. Gravity keeps the combined strength near 1.
- Use `x`, `y`, and `z` together. A shake may be spread across them, and some numbers are negative.
- Pick a threshold that ignores a small bump and catches a real shake.

Check it:

```bash
npm run test:lights
```

### TODO 4

Connect the shake to disco mode.

Look for:

`TODO LIGHTS 4`

Hints:

- Call `isShake` with `reading.x`, `reading.y`, and `reading.z`.
- On a shake, play one haptic, then call `onDisco()`.
- Call `beginCooldown()` so one shake does not send a pile of requests. The listener already ignores readings during the cooldown.

Check it:

Shake the phone. You should feel a tap, and your light on the projector should enter disco mode.

## Extra: read the receipt for real

Skip this until the three receipt TODOs work. There is no test for it, and the workshop does not require it.

`mockAnalyzeReceipt` ignores the photo and always returns Workshop Cafe and $14.82. That is on purpose. This extra replaces that fake reading with a cloud reader, so the store and the total come from the picture.

On-device text recognition needs a custom native build, so it does not run in Expo Go. A cloud reader does. The phone sends the photo to an HTTP API, the API returns the words it saw, and your code picks out the merchant and the total.

Do this:

1. Finish the camera TODOs first. The photo has to be real.
2. Shrink the JPEG before you upload it. A full camera photo is larger than it needs to be.
3. `POST` the image with `fetch`.
4. Read the text in the response and find the store name and the total. Ignore subtotal lines.
5. Return `{ merchant, total }` from a function with the same shape as `mockAnalyzeReceipt`, and call that from the screen instead.

Any of these readers will work:

- [OCR.space](https://ocr.space/ocrapi) is the small version. Create a free key, then `POST` the image to `https://api.ocr.space/parse/image`. The response is one block of text. You find the store and the total yourself.
- [Google Cloud Vision](https://cloud.google.com/vision/docs/ocr) is the usual Google OCR API. Call `images:annotate` with `DOCUMENT_TEXT_DETECTION`. You still find the total yourself. The project needs the Vision API turned on, plus billing.
- [Document AI](https://cloud.google.com/document-ai/docs/processors-list) has an expense parser that returns the merchant and the total as fields. That is the receipt-shaped Google API. It takes more setup than Vision.

Keep the key off the phone if you can. A Google key inside the Expo app can be copied out of the project. The better place is the workshop server: the phone `POST`s the photo to something like `/api/receipts`, and that server calls Google and returns `{ merchant, total }`. For one day, an OCR.space key can live in `config/workshop.ts` next to the lightbox URL. Rotate it after the workshop.

The photo leaves the phone. Do not scan a receipt that shows a full card number.

Check it:

Photograph a flat, bright paper receipt with the total in frame. The screen should show that store and that total. Glare, folds, and a cropped total are what make it miss.

## If something breaks

Run the full check:

```bash
npm run check
```

That runs TypeScript, lint, and the tests. Test failures are expected until that TODO is done. Read the message.

Camera permission needed

Allow camera access when the phone asks. If you previously denied it, enable the camera for Expo Go in Settings.

Motion feels frozen

Use a physical phone, and allow motion access if iOS asks. Move the phone. The debug value on the level screen should change after TODO 1.

Can't reach the workshop server

Check that you are online. If the lightbox screen says it is not configured, ask the instructor.

Lightbox isn't configured yet

Ask your workshop instructor for help.

Expo Go says the project is incompatible

Update Expo Go. This workshop uses SDK 57.

Still stuck

Read the hint above the TODO again, then run the test script for that exercise. The failure text points at the behavior.
