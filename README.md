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

For an installable preview APK through EAS, configure an Expo account and preview build profile, then use `npx eas-cli@latest build --platform android --profile preview`. Development/build downloads may use the internet; the installed ACSize runtime does not.

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

## Known limitations

- Supports bedrooms, living rooms and small offices only.
- Uses simplified heuristics and a maximum 24,000 BTU/h local split catalogue.
- Does not predict exact installation suitability, compressor cycling, real bills or physical comfort.
- The repository has no configured Git remote; commits are local until the student adds their GitHub URL and pushes.

To publish the genuine local history:

```powershell
git remote add origin <your-github-repository-url>
git push -u origin main
```
