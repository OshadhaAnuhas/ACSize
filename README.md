# ACSize

ACSize is a fully offline, Android-first React Native application for estimating a room's approximate cooling demand and selecting a suitable generic AC profile. It was created for IT3133 Mobile Communication and Computing, ICA 03.

The app is an educational selection assistant, not professional HVAC design software. Its equipment catalogue, comparison capacities, electrical inputs, purchase tiers, energy results and comfort labels are fictional or illustrative.

## What works

- Seven real routes: Home, Room Setup, Recommendation, Room Lab, AC Library, AC Details and Saved Rooms.
- Three-step room setup with metric/imperial display, physical-value validation and preserved values.
- Pure, tested cooling, recommendation, energy and comfort calculations.
- Fourteen bundled generic AC profiles rendered dynamically with search and combined filters.
- Split/portable no-match behavior, alternatives and separate nominal/comparison capacities.
- Interactive Room Lab with a temporary scenario, automatic versus manually selected AC, Reset and Apply.
- Local AsyncStorage create/open/edit/update/delete flows with versioned saved records.
- No runtime API, remote image, remote font, login, cloud database or other network dependency.

## Run the project

Requirements: Node.js 20.19 or newer, npm, and Expo Go or an Android development environment.

```powershell
npm install
npm run typecheck
npm test
npx expo-doctor
npm start
```

Scan the Metro QR code with Expo Go for development. Expo Go requires Metro and therefore is not proof of installed offline operation.

For a local Android development build, install Android Studio/SDK, make `adb` available, then run:

```powershell
npx expo run:android
```

For an installable preview APK, sign in to an Expo account and run the configured internal-distribution build profile:

```powershell
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

The first build may ask to link an Expo project and create Android signing credentials. The `preview` profile in `eas.json` requests an APK with bundled application code. Development/build downloads may use the internet; the installed ACSize runtime does not. No cloud build has been run or verified yet.

## How the code is organized

- [App.tsx](./App.tsx) adds safe-area, shared room state and the root navigator.
- `src/navigation/` defines a typed native stack with Home/Library/Saved bottom tabs.
- `src/context/RoomContext.tsx` owns the working draft, temporary Lab scenario and hydrated saved records.
- `src/data/acProfiles.ts` is the single source of all 14 catalogue records.
- `src/services/` contains pure calculations plus the serialized AsyncStorage service.
- `src/screens/` contains one component for each of the seven routes.
- `__tests__/core.test.ts` checks the locked dataset and deterministic acceptance fixtures.

### State lifecycle

The working draft is what Room Setup and Recommendation use. It is not persistent until **Save Solution** succeeds. Room Lab copies that draft into a temporary scenario; **Reset** restores its entry snapshot and **Apply Changes** transfers it back to the draft. A saved record changes only after an explicit save or confirmed delete. `recommendedACId` is derived from the current room; `selectedACId` is a user's explicit test choice.

## Calculation rules

Cooling demand uses canonical metres:

```text
areaM2 = lengthM × widthM
baseBTUh = areaM2 × 700
factor = room + sunlight + windows + roof + (heightM - 2.7) × 0.03
rawBTUh = baseBTUh × (1 + factor) + max(0, occupants - 2) × 500
estimatedBTUh = round(rawBTUh / 100) × 100
```

The default 4 × 3 × 2.7 m bedroom produces 8,652 raw, rounds to 8,700 BTU/h and selects `SPL-09-INV`. Selection first chooses the smallest sufficient comparison-capacity class, then applies the user's Standard/Inverter/Eco priority. Portable comparison capacities are an application-specific fictional 80% convention, not certified SACC values.

Energy uses:

```text
monthlyKWh = inputKW × dailyHours × 30 × 0.65
additionalChargeLKR = monthlyKWh × illustrativeRate
```

The 0.65 value is a fixed average-use multiplier, not electrical power factor. The default Rs.40/kWh is a demonstration assumption, not an official Sri Lankan tariff or complete household bill.

Comfort Explorer classifies hypothetical temperature, humidity and airflow as Cool, Comfortable or Warm. It does not display a physical feels-like temperature and cannot change BTU or energy calculations.

## Offline acceptance check

1. Create a release/preview Android build and install it on a device.
2. Open every route once, then close the app.
3. Enable airplane mode and disable Wi-Fi.
4. Restart ACSize and complete Room Setup → Recommendation → Room Lab.
5. Search/filter the Library, open Details, select an AC, save a room, restart, reopen/edit it, and delete it.
6. Record the device/build identifier and result for submission evidence.

This repository can verify bundling without an Android SDK using `npx expo export --platform android`, but that is not equivalent to the installed-device airplane-mode test.

### Export preflight (2026-11-04)

- `npx expo export --platform android` passed after directing Windows temp output to `tmp/expo-export` inside the project. It produced one 2.1 MB Hermes Android bundle and local assets in the ignored `dist/` directory.
- A source scan of `src/`, `App.tsx`, `index.ts` and `app.json` found no runtime fetch, WebSocket, HTTP URL or remote asset reference.
- The first `npx expo-doctor` attempt could not reach npm; a later run with registry access passed all 20 checks.
- After the M7 code changes, `npx expo install --check` reported compatible installed versions using Expo's local dependency map, and a fresh Android Hermes export passed. The offline compatibility check carries Expo's reliability warning.
- `npm run typecheck`, `npm run lint` and all 24 automated tests passed. See the [acceptance status](Documentation/Acceptance_Status_2026-11-04.md) for the evidence and outstanding interactive checks.
- An installed Android build and airplane-mode restart have **not** been tested yet.
- A web export also passed after the latest changes. An interactive browser smoke test remains unverified because the browser automation helper failed to initialize and this sandbox blocked a localhost request.
- EAS CLI 27.4.1 runs, but `eas whoami` reports **Not logged in**; no Android SDK `adb` was found. A cloud preview APK has not been built.

If Windows blocks Hermes from writing to its default temp directory, run this PowerShell sequence before exporting:

```powershell
New-Item -ItemType Directory -Force -Path .\tmp\expo-export | Out-Null
$env:TEMP = (Resolve-Path .\tmp\expo-export).Path
$env:TMP = $env:TEMP
npx expo export --platform android
```

## Known limitations

- Supports bedrooms, living rooms and small offices only.
- Uses simplified heuristics and a maximum 24,000 BTU/h local split catalogue.
- Does not predict exact installation suitability, compressor cycling, real bills or physical comfort.
- The Git remote is [OshadhaAnuhas/ACSize](https://github.com/OshadhaAnuhas/ACSize). Pushes are made at completed phase checkpoints.
