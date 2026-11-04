# ACSize acceptance status — 2026-11-04

This checklist follows section 12 of `ACSize_Codex_AI_Handover_v1.0.md`. **PASS** means the stated evidence was run; **NOT VERIFIED** means the complete criterion still needs an interactive or installed-device check. A passing calculation test does not establish that the corresponding screen behaves correctly.

| # | Criterion | Automated/source evidence | Interactive or device result |
|---|---|---|---|
| 1 | Default setup and 8,700 BTU/h recommendation | PASS — `core.test.ts` checks 8,700 and `SPL-09-INV`. | NOT VERIFIED |
| 2 | Occupant and heat-condition changes | PASS — raw +500 and increased area/sun/roof fixtures. | NOT VERIFIED |
| 3 | Energy figures | PASS — 12K and 9K inverter numeric fixtures. | NOT VERIFIED |
| 4 | Portable no-match | PASS — engine returns no portable match and split alternatives. | NOT VERIFIED |
| 5 | Fourteen-record catalogue | PASS — count, unique IDs and locked numeric values. | NOT VERIFIED for all library/detail screens |
| 6 | Search and combined filters | PASS — case-insensitive search, combined filters, empty and reset tests. | NOT VERIFIED |
| 7 | Three-step Room Setup | PASS for conversion and validation functions. | NOT VERIFIED for fields, keyboard and Back behavior |
| 8 | Recommendation presentation | PASS for selection priority and large-demand engine behavior. | NOT VERIFIED for screen messages and layout |
| 9 | Room Lab state lifecycle | No UI integration test. | NOT VERIFIED |
| 10 | Comfort Explorer | PASS for Comfortable and Warm pure-function examples. | NOT VERIFIED for UI isolation from BTU and energy |
| 11 | Saved-room lifecycle | PASS — fake storage covers create/edit/delete, simulated restart, corruption, failure and missing AC ID. | NOT VERIFIED on installed device |
| 12 | Seven-route navigation | Routes are present in source. | NOT VERIFIED for Android back and selection return |
| 13 | Offline installed operation | PASS — Android Hermes export succeeds; app-source scan found no runtime network call. | NOT VERIFIED in airplane mode on installed build |
| 14 | Repository history | PASS — genuine commits and configured GitHub remote; M7 work remains local. | NOT VERIFIED for final phase push |
| 15 | Explainability | PASS — README covers scope, formulas, illustrative data, storage, run/build steps and limits. | NOT VERIFIED for lecturer review |

## Commands run

```powershell
npm run typecheck
npm run lint
npm test
$env:CI = '1'; npx expo install --check
$env:TEMP = (Resolve-Path .\tmp\expo-export).Path
$env:TMP = $env:TEMP
npx expo export --platform android
```

Results: typecheck and lint passed; 24 automated tests passed; Android export generated one 2.1 MB Hermes bundle and local assets. `expo install --check` reported dependencies up to date using the local bundled dependency map, while warning that offline validation is less reliable. `expo-doctor` remains unverified because npm could not reach `registry.npmjs.org`.

## Remaining evidence

Build and install the preview APK, test all seven routes and saved-room restart on Android, enable airplane mode with Wi-Fi disabled, repeat the main workflow, then record the device/build identifier and any failures here.
