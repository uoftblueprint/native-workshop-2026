# Project structure

This workshop is a small app on purpose. The folders match how a lot of React Native projects split their code.

## app/

Screens and routes. Expo Router turns each file into a screen.

- `index.tsx` is the home screen.
- `level.tsx`, `receipt-scanner.tsx`, and `lights.tsx` are the three exercises.
- `_layout.tsx` sets up the stack navigation.

## components/

UI that more than one screen can use: cards, buttons, the header, and simple icons.

## features/

Logic for each exercise, kept separate from the screen. These files are easier to test because they do not need a phone.

- `features/level` converts motion into degrees and decides when the phone is level.
- `features/receipt-scanner` takes the photo and runs the mocked receipt reading. A real cloud reader is an optional extra in the README, not part of the TODOs.
- `features/lights` talks to the lightbox API, remembers the one light saved on this phone, and decides what counts as a shake.

## assets/

Images and other static files. Optional sample receipts go in `assets/receipts/`.

## config/

Shared settings. The lightbox URL lives in `config/workshop.ts`. The instructor sets that before the workshop.

## docs/

Notes about the project, like this file.

## How this maps to larger apps

Bigger React Native apps usually separate:

- routes and screens
- reusable components
- feature logic
- API and service code
- assets
- configuration

You do not need more folders than that to start. Add a folder when a group of files has a job.
