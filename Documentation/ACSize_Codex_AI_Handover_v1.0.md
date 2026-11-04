# ACSize — Complete AI-to-Codex Implementation Handover

**Handover version:** 1.0  
**Date:** 3 November 2026  
**Project:** ACSize – Offline Room Cooling Capacity Estimator & AC Selection Assistant  
**Module:** IT3133 P — Mobile Communication and Computing (Practical), ICA 03  
**Submission deadline:** 15 November 2026  
**Status:** Product planning complete; implementation has **not** started in this planning conversation.

> **START HERE, CODEX:** You are taking over implementation of a fully planned individual React Native application. The user will give you this handover **AND** `ACSize_Master_Specification_v1.2.pdf` (or its equivalent Markdown). Read both in their entirety before editing code. This handover is the executable development brief; the master specification contains the complete product, UI, calculation and data design. Do not treat this handover as permission to omit features in the specification.

---

## 1. Mission, user intent and working arrangement

Build a **real, polished, fully offline Android-first React Native application** matching the approved ACSize master spec. The app estimates approximate room cooling demand, selects an appropriate **generic AC profile** from a bundled 14-record catalogue, explains its choice, estimates illustrative monthly AC electricity use and additional energy cost, supports an interactive Room Lab, and manages saved rooms locally.

This is a **mobile programming assignment**, not a professional HVAC engineering project. Prioritize working navigation, dynamic local data, responsive interfaces, state correctness, search/filter/details, genuine persistence and offline reliability. Calculations are simplified educational heuristics and must be labeled as such. Do not add APIs, cloud services, advanced thermal simulation or commercial shopping features.

The user has finished an extensive collaborative planning process and **does not want another broad design interview**. Implement the approved scope. Make reasonable micro-level implementation choices when unspecified, document them, and ask only for genuinely blocking information (e.g. local environment constraints, repository access). The lecturer allows AI coding assistance; the user nevertheless wants enough understanding to describe and debug the application.

**Do not promise completion in the background.** Execute work in observable milestones, run tests, share results and blockers, and don't claim anything was tested or committed without evidence.

## 2. Assignment compliance — non-negotiable

Lecturer's ICA 03 brief requires:

1. Individual **React Native** app and unique registered project title (user confirmed title registered).
2. **At least five screens**; ACSize has **seven real navigable routes**.
3. Appropriate navigation.
4. Original local dataset that is **retrieved and displayed dynamically** (not manually hardcoded as separate static cards).
5. Search/filter/detail capabilities.
6. **No internet required at runtime**, no public APIs or online databases.
7. Individual GitHub repository containing full source, with **real regular commits and pushes** reflecting development.
8. Submission **15 November 2026**.

A viva is not established as mandatory; include a concise explanation and walkthrough to help the user if asked.

## 3. Source-of-truth and conflict-resolution policy

**Read both delivered files in full.** The spec evolved additively and includes historical provisional notes. To avoid reproducing obsolete decisions, follow this authority order:

1. Explicit updated instructions from the user in the active Codex conversation.
2. **This handover's implementation clarifications** (Sections 5–14), intended to close previously identified gaps **without changing approved functionality**.
3. **Master Specification v1.2 Sections 26–32**, the latest approved decisions.
4. v1.2 Sections 1–25 for detailed established requirements and visual designs where not superseded.
5. Your own implementation judgment only for details genuinely unspecified.

Do **not** interpret v1.1's historical “pending” list as presently unresolved. The current technical stack is **Expo + TypeScript + React Navigation**, **not Expo Router**. The Stage 6 numeric constants in v1.2 Section 28 are final for v1. Do not silently swap formulas, data, screens or technology.

If the lecturer's *actual lab source* later confirms an explicit conflicting toolchain restriction, inform the user and adjust minimally. The lecturer's ICA brief itself does not mandate a router, CLI or programming language beyond React Native.

## 4. Approved feature and seven-route inventory

| Route | Core job and acceptance condition |
|---|---|
| **Home Dashboard** | Modern Climate-Tech light home, hero with bundled room illustration, **Start New Estimate**, library/saved shortcuts, local cooling tip, and optional latest saved room card; main tabs Home/Library/Saved. |
| **Room Setup** | **One route with three internal steps**: (1) room type/name/dimensions/unit toggle/live area; (2) occupants/sun/windows/roof; (3) installation/hours/cost-vs-efficiency preference. Validation, next/back, progress and **Find My AC**. |
| **Recommendation** | Visually dominant computed **Best Match** profile; capacity bar; BTU estimate and expandable calculation breakdown; two energy metrics; rule-based “why”; suitable alternatives; **Explore in Room Lab / Save Solution / Edit Room**; no-match states. |
| **Room Lab** | Compact reactive room SVG, **three** summary metrics, **four one-open-at-a-time accordions** (Room Conditions, AC Selection, Energy & Cost, Comfort Explorer), Reset/Apply; browse catalogue in selection mode without losing state. |
| **AC Library** | Dynamically render all **14 bundled records**, live search, category/capacity/technology/efficiency filters, count and empty state; browse and select modes. |
| **AC Details** | Generic equipment information, nominal vs comparison capacity (portable), illustrative input kW, tier, notes/features/limits; context-specific Back/Use This AC/Explore in Lab. |
| **Saved Rooms** | AsyncStorage-backed list, Open/Edit/Delete with confirmation, create shortcut and empty/error states. |

**UI approved:** Modern Climate-Tech, light neutral background, teal/cyan cooling accents, navy text, amber caution, rounded cards, simple icons and small local SVG room graphics. Adapt to small Android phones, system font scaling and safe areas. Do not make the room image a costly proportional 3D drawing. Avoid remote images, remote fonts, dummy Home dashboard metrics and bogus live data.

## 5. Locked input model and validation clarifications

### 5.1 New-room defaults

- Room name **My Bedroom**; type **Bedroom** (also Living Room, Small Office).
- Length **4.0 m**, width **3.0 m**, height **2.7 m**; default **Metric** display. Store normalized dimensions **in meters**.
- Occupants **2**, sunlight **Medium**, window category **Small**, roof **Sheet/tile with a separate ceiling**.
- Installation **Either**, daily AC usage **8 h/day**, preference **Balanced**.
- Electricity rate **Rs.40 per kWh**, explicitly labeled *illustrative demonstration assumption*.
- Comfort controls **26°C**, RH **60%**, **Gentle** airflow.

### 5.2 Exact v1 validation choices (previously provisional)

- Length and width each **2.0–15.0 meters**, height **2.0–5.0 meters**, inclusive. These are UI input boundaries, **not** HVAC professional standards.
- Occupants integer **1–10**, hours integer **1–16**, comfort temperature **20–34°C**, RH **30–90%** (5% steps), rate **10–80 LKR/kWh** (5-unit steps). The production app needs **only a slider/stepper rate control**; omit optional custom arbitrary-rate text entry to reduce complexity.
- In imperial mode, convert displayed fields **both directions** (1 ft = 0.3048 m), keeping canonical meters as source of truth. Validate physical values against the meter bounds regardless of unit. For display and edits, guard against floating-point drift.
- Reject empty/whitespace room names, NaN, Infinity, zero and out-of-range values. Trim name; cap at **60 characters**. Show validation after field touch or attempted Continue, not at first render.
- Changing room type only changes the suggested name while the name is still an autogenerated default, never an individually edited name.
- Step Back/Next and Android keyboard behavior must preserve all draft values.

### 5.3 Roof and other option values

Use stable enum values throughout (exact internal spelling can be chosen once and typed): `bedroom|living|office`, `low|medium|high` sun, `none|small|large` windows, `floorAbove|withCeiling|concreteSlab|noCeiling` roof; installation `either|split|portable`; priority `budget|balanced|energy`.

## 6. Exact approved calculation contracts

Calculations must be implemented as **pure typed functions** with deterministic unit tests, not duplicated inside screens.

### 6.1 Cooling estimate

```
areaM2 = lengthM * widthM
baseBTUh = areaM2 * 700
factor = roomFactor + sunlightFactor + windowFactor + roofFactor
       + (heightM - 2.7) * 0.03
extraPeopleBTUh = Math.max(0, occupants - 2) * 500
rawBTUh = baseBTUh * (1 + factor) + extraPeopleBTUh
estimatedBTUh = Math.round(rawBTUh / 100) * 100
```

| Adjustment | Values |
|---|---|
| Room type | Bedroom 0%, Living +4%, Small office +8% |
| Sun | Low −5%, Medium 0%, High +10% |
| Windows | None −3%, Small 0%, Large +8% |
| Roof | Another occupied floor above 0%, sheet/tile with ceiling +3%, exposed concrete slab +8%, sheet/tile without ceiling +12% |
| Height | +3 percentage points **per meter** over 2.7 m, negative below reference |
| Occupants | +500 BTU/h for each person above 2 |

**Canonical test:** 4×3×2.7 m default Bedroom ⇒ base 8,400; roof +3% ⇒ raw 8,652 ⇒ **8,700 BTU/h**.

### 6.2 Recommendation selection

- Read the **one bundled dataset**, filter by installation preference (Either defaults to preferring eligible **split AC** profiles), and find the **smallest sufficient comparison-capacity class** satisfying `comparisonCapacityBTU >= estimatedBTUh`.
- Within selected capacity class, priority `budget` ⇒ Standard fixed-speed; `balanced` ⇒ Inverter; `energy` ⇒ Eco Inverter (for split). For portable-only use the available portable records and pick the smallest sufficient; when multiple profiles have no exact priority equivalent, select deterministically and disclose the trade-off. Never invent portable Eco variants.
- Keep recommendations stable and explainable. Do not choose the largest unit just because it has more headroom.
- Portable 9K has nominal **9,000** but illustrative comparison **7,200 BTU/h**; portable 12K nominal **12,000**, comparison **9,600 BTU/h**. The 80% ratio is **application-specific fictional comparison logic, not a certified SACC rating**.
- If user requests Portable and requirement exceeds 9,600, show **no sufficient portable match** and present suitable split alternatives explicitly, **not** a split recommendation disguised as portable.
- If no eligible profile meets load, show **No suitable match in the current catalogue**; never mark undersized equipment suitable.
- **Recommended AC** is algorithm-derived; **Selected AC** is user-chosen. Changing selected equipment or operating rate must not silently overwrite the auto recommendation.
- For a manually selected unit with `comparisonCapacityBTU < estimatedBTUh`, show **Below Estimated Requirement** (amber). For a sufficient profile with comparison capacity **> 1.5 × estimatedBTUh**, show **Higher Than Estimated Need** (neutral caution). Otherwise show **Meets Estimated Requirement** (positive). The 1.5x threshold is **presentation-only**; never change the underlying selection algorithm.
- For no-match cases, energy cards should not present fabricated “recommended equipment” consumption; only show energy when a real profile is actively selected.

### 6.3 Electricity use and estimated charge

```
monthlyKWh = illustrativeInputPowerKW * dailyHours * 30 * 0.65
monthlyAdditionalEnergyCostLKR = monthlyKWh * userRateLKRPerKWh
```

- 30 days and **0.65 average-use multiplier** are fixed in v1. This is an assumed load/operating multiplier, **not an electrical power-factor correction**.
- Recommendation uses its recommended profile's input kW; Room Lab uses the **manually selected profile's** input kW where present.
- Room sunlight/occupancy may affect cooling requirement and recommendation; it must **not secretly multiply the selected AC's kW input**. The energy estimate changes only as defined by the formula or when the selected profile changes.
- Clearly state **Estimated monthly AC energy cost / Approximate additional energy charge**, not exact total household bill or official Sri Lankan tariff.
- `SPL-12-INV`, 1.05 kW, 8 h, Rs.40 ⇒ **163.8 kWh**, **Rs.6,552**.
- `SPL-09-INV`, 0.78 kW, 8 h, Rs.40 ⇒ **121.68 kWh**, **Rs.4,867.20**. Round display only; retain unrounded numeric values for computations.

### 6.4 Comfort Explorer (visual educational heuristic only)

```
index = selectedIndoorTemperatureC + humidityAdjustment - airflowAdjustment
humidityAdjustment = RH < 50 ? 0 : RH < 70 ? 0.5 : 1.5
airflowAdjustment = Still 0, Gentle 0.5, Strong 1.0
label = index < 24 ? "Cool" : index <= 28 ? "Comfortable" : "Warm"
```

Only show label and explanation; **never display index as a physical feels-like temperature**. Comfort changes do not affect cooling BTU/h, real indoor-temperature forecasts, or AC energy estimates. Default 26°C/RH60/Gentle => **Comfortable**; 29°C/RH80/Still => **Warm**.

## 7. Lock the complete fourteen-profile numeric dataset

Copy approved IDs and numbers **exactly**. Every record is fictional, generic and locally bundled; no brand names, fake retailer links or unverified real market prices.

| ID | Display name | Nominal BTU/h | Comparison BTU/h | Illustrative electrical input kW | Purchase tier |
|---|---|---:|---:|---:|---|
| SPL-09-STD | 9K Standard | 9000 | 9000 | 0.98 | Budget |
| SPL-09-INV | 9K Inverter | 9000 | 9000 | 0.78 | Mid-range |
| SPL-09-ECO | 9K Eco Inverter | 9000 | 9000 | 0.69 | Premium |
| SPL-12-STD | 12K Standard | 12000 | 12000 | 1.25 | Budget |
| SPL-12-INV | 12K Inverter | 12000 | 12000 | 1.05 | Mid-range |
| SPL-12-ECO | 12K Eco Inverter | 12000 | 12000 | 0.90 | Premium |
| SPL-18-STD | 18K Standard | 18000 | 18000 | 1.90 | Budget |
| SPL-18-INV | 18K Inverter | 18000 | 18000 | 1.55 | Mid-range |
| SPL-18-ECO | 18K Eco Inverter | 18000 | 18000 | 1.35 | Premium |
| SPL-24-STD | 24K Standard | 24000 | 24000 | 2.55 | Budget |
| SPL-24-INV | 24K Inverter | 24000 | 24000 | 2.10 | Mid-range |
| SPL-24-ECO | 24K Eco Inverter | 24000 | 24000 | 1.85 | Premium |
| POR-09-CMP | Portable Compact | 9000 | 7200 | 1.05 | Budget |
| POR-12-PLUS | Portable Plus | 12000 | 9600 | 1.40 | Mid-range |

For each record add and use **distinct** generic `category`, `technology`, `efficiencyTier`, `description`, `features[]`, `recommendedUse`, `installationNotes`, `limitations[]` (and other schema fields in spec). Write plausible educational copy, without asserting manufacturer certification or actual purchase price. Portable profiles require outdoor exhaust. Derive cooling kW from nominal BTU/h using **0.000293071**, and clearly distinguish cooling capacity kW from **electrical input kW**.

**Original local dataset requirement:** This structured, typed catalogue is the app's actual data source for Library, Details and recommendation; fetch/select from local arrays and persistent user records at runtime. Do not hardcode one JSX card per model.

## 8. Navigation and cross-screen state contracts

**Locked stack:** **React Native + Expo + TypeScript + React Navigation** (`@react-navigation/native` + Native Stack + Bottom Tabs), **not Expo Router**. Use current Expo-SDK-compatible stable package versions; verify installation and environment before development. No Redux, backend, Firebase or SQLite required. `react-native-svg` for bundled illustrations, StyleSheet/theme tokens for UI, AsyncStorage for small persistent data.

Use `NavigationContainer` and typed route param lists. Bottom tabs: **Home / AC Library / Saved Rooms**; stack routes **Room Setup / Recommendation / Room Lab / AC Details**. The seven screens are unique real screens; Room Setup's 3 steps and Room Lab's accordions are *not* extra routes. Keep focused estimation screens clear of the bottom tab bar.

Navigation params carry small identifiers and origin/mode. Shared state holds the actual room and selected profiles. Avoid passing a giant, mutable room object as every navigation parameter. Library in browse mode works independently; selection mode must return to **existing** Room Lab state, not create another Lab. Details opened from Recommendation alternative should initialize a Lab exploration of that selected profile without altering the automatic recommendation.

### 8.1 Three distinct lifecycles

1. **Working Room Draft:** active form fields/preferences, optional `sourceSavedRoomId`; not persistent until Save Solution.
2. **Room Lab Scenario:** temporary copied state with immutable **entry baseline**. Live updates are experimental. Reset = restore baseline; Apply Changes = transfer accepted changes into draft and return to recomputed Recommendation. Leave with modifications = confirm discard. The Lab's manually selected AC survives Apply.
3. **Saved Room Record:** AsyncStorage copy modified only after explicit successful Save Solution or confirmed Delete.

`recommendedACId` is **derived** afresh from working room/scenario; `selectedACId` is an explicit user choice and should persist independently where appropriate. Provide **Use Recommended AC** to remove the manual choice or return to the current auto recommendation. Avoid conflating the two.

### 8.2 Save/edit details

- **New Estimate:** reset to fresh defaults, `sourceSavedRoomId = null`.
- **Find My AC:** validate, compute and navigate; do not automatically persist.
- **Save new:** write new unique ID/timestamps/`schemaVersion`; after success attach the ID to draft so repeated Save updates rather than duplicates.
- **Open saved:** load record, recompute active estimate with current engine, show Recommendation.
- **Edit saved:** prefill all steps; no storage write until Save. **Save edited:** update *same ID* and preserve `createdAt`.
- **Delete:** confirm, remove only target ID and update UI.
- **Errors:** do not show false success; maintain working values on failure; invalid saved objects or missing AC IDs have recovery screens, not crashes.
- **Comfort settings:** temporary/educational for v1; it is acceptable to reset on a new lab session. Do not present them as measured room conditions.

## 9. Offline persistence design

Use only two layers:

- **Bundled original reference catalogue** in TypeScript or local JSON, read/search/filter dynamically.
- **AsyncStorage** for saved rooms and small settings, JSON encoded and validated at read time.

Suggested keys: `@acsize/savedRooms/v1`, `@acsize/settings/v1`. Store schema version, stable ID, creation/updated timestamps, room type/name/dimensions in meters, selected display units, occupants/sunlight/windows/roof, installation and priority, daily hours, electricity rate, manual selected profile ID (nullable), last calculated load/recommended ID for list preview. Recompute derived results on open. Handle malformed storage gracefully. Use a simple write-serialization guard or functional updates to avoid lost writes on rapid saves/deletes.

**Offline:** absolutely no runtime API, network calls, remote fonts/images or database. An Expo Go preview connected to Metro does **not** prove offline compatibility. Validate with an installed Android build with bundled JS/assets in airplane mode, restart and repeat core workflows. Dependency installation and pushing GitHub during *development* may use internet; the *shipped app runtime* must not.

## 10. Folder architecture and engineering practices

Use a standard Expo entry point and organize by responsibilities, approximately:

```
App.tsx
src/
  navigation/       RootNavigator, MainTabs, routeTypes
  screens/          seven named React Native screens
  components/       reusable cards, form controls, local room SVG, capacity indicator
  context/          RoomContext and storage hydration
  data/             acProfiles, coefficients and local tips
  types/            AC, Room, Scenario, persistence and navigation types
  services/         coolingEstimator, recommendationEngine, energyCalculator,
                    comfortCalculator, storageService
  utils/            unit conversion, validation, formatting
  theme/            colors, spacing, typography
  assets/           bundled images only (if needed)
__tests__/          deterministic pure-function and storage/service tests
```

Keep implementation comprehensible: strongly typed data/functions, small reusable components, appropriate comments explaining *why*, no speculative abstraction frameworks, no giant monolithic screen. Show real loading/empty/error states where relevant. Maintain accessible targets, readable text and Android keyboard behavior. Avoid an excessive animation library.

**Design tokens from spec:** Navy `#0F172A`, teal `#0D9488`, cyan `#38BDF8`, pale cyan `#E0F2FE`, light background `#F8FAFC`, amber `#F59E0B`. Visually dominant Recommendation card; simple cohesive room illustration reused Home/Setup/Lab.

## 11. Milestone-by-milestone build order

Do the following in **small, testable milestones**; commit and push genuine changes when repository authentication/access is available. Do not invent commit history or say pushed if it didn't occur. If the user's GitHub/repo isn't connected, ask for the minimum info and continue local work while documenting commands for real pushes.

**M0 — Environment and repository readiness**  
Inspect existing working directory first; do not overwrite existing code. Confirm Node/npm, Android test approach, install compatible Expo project and React Navigation dependencies, set TypeScript and project metadata, initialize or reuse the user's individual Git repository. Check a minimal app launches. Record tools/versions actually used.

**M1 — Foundation**  
Theme tokens, types, navigation (3 tabs + 4 stacks), shared Context skeleton, local catalogue records. Verify seven routes and 14 dataset records render dynamically. Commit.

**M2 — Core engine**  
Pure cooling, recommendation, portable comparison, energy and comfort functions; worked unit fixtures and edge cases; validation and unit conversion. Confirm tests before connecting UI. Commit.

**M3 — Main user journey**  
Polished Home, 3-step Room Setup, Recommendation with best match, explanations, alternatives and no-match states. Test keyboard, back, controlled fields and default fixture. Commit.

**M4 — Library and selection**  
Search/filter/count/empty state, AC Details and browse/select modes. Ensure context-aware Use This AC returns to existing Room Lab scenario. Commit.

**M5 — Room Lab**  
Hybrid illustration, three live summaries, one-open accordion, condition and AC experimentation, energy cost, comfort, baseline/Reset/Apply/discard. Preserve selected-vs-recommended semantics. Commit.

**M6 — Persistence and Saved Rooms**  
AsyncStorage hydrate, create/open/edit/update/delete, timestamps/versioning/errors, save confirmations, latest-room Home card. Test restart and invalid storage. Commit.

**M7 — Polish, offline validation and delivery**  
Check all seven routes, responsive layout, accessibility, no internet dependencies, installed Android airplane-mode operation, calculation fixtures and project build/lint/typecheck. Final README, run/setup instructions, screenshots if feasible, limitations and concise explanation for student; genuine final commit and push. Report any unverified criteria truthfully.

**Scheduling note:** The deadline is **November 15, 2026**; do not burn days on decorative complexity. Preserve functioning lecturer requirements first. Extra animations/features are lower priority than saved data and offline tests.

## 12. Acceptance test checklist — objective pass/fail

Codex should run automated tests where feasible and manually verify the app. Report each item as **PASS / FAIL / NOT VERIFIED**, and provide evidence/commands where possible.

1. **Default setup:** 4m × 3m × 2.7m bedroom, medium sun, small windows, roof with ceiling, 2 people, Either/Balanced → **8,700 BTU/h** and **SPL-09-INV**.
2. **Changes:** increasing occupants 2→3 adds 500 raw BTU/h before rounding; greater area/sun/exposed roof increase estimated demand.
3. **Energy:** 12K Inverter, 8h/day, Rs40 gives **163.8 kWh / Rs6,552**; 9K Inverter gives **121.68 kWh / Rs4,867.20**.
4. **Portable no-match:** a 10K BTU/h requirement with portable-only shows no sufficient portable profile and offers split alternatives without pretending portable is enough.
5. **Dataset:** exactly 14 unique IDs; all values correct; library/search/filter/detail screens derive from structured local records.
6. **Search/filter:** case-insensitive search; filters combine predictably; empty state and Clear Filters.
7. **Room Setup:** user-editable defaults, metric/imperial conversion, input validation, progress and Back values preserved.
8. **Recommendations:** smallest sufficient split class then tier; alternatives nonmisleading; large-demand no-match; visually appropriate insufficient/oversize message for selected equipment.
9. **Room Lab:** live values; manual selection doesn't overwrite algorithmic recommendation; reset restores entry baseline; Apply returns correct Recommendation; discard restores underlying working draft.
10. **Comfort:** default Comfortable; 29°C/80%/Still Warm; cannot alter BTU or kWh merely by comfort slider.
11. **Saved Rooms:** Save persists across restart; Open/Edit/Delete work; unsaved changes don't overwrite storage; re-save updates same ID; storage failure and missing model ID don't crash.
12. **Navigation:** seven distinct routes, bottom tabs, context-aware selection return, predictable Android back behavior.
13. **Offline:** installed Android build works with data disabled, including library details, estimate, Lab, saving and local visuals. Expo Go alone isn't accepted as this proof.
14. **Repo:** complete source present, real milestone commits/pushes; no fabricated status.
15. **Explainability:** README describes app features, formulas/assumptions, dataset, storage, run/build steps, example usage and limitation disclaimers.

## 13. Nonnegotiable guardrails and known pitfalls

- Do not replace React Navigation with Expo Router or mix two routing paradigms.
- No remote assets/network calls in app runtime, no Firebase/Supabase/cloud login.
- No extra screens to pad the count, no new core features without user permission.
- No invented AC brands, exact market prices, official tariff claims or real-world installation guarantees.
- No claim that 80% portable reduction is certified or universally valid.
- The 0.65 electricity factor is an **average modeled usage multiplier**, not physical power factor.
- Do not derive indoor temperature from cooling load or imply Comfort Explorer predicts actual sensation.
- Keep room draft, Lab scenario baseline, saved record and selected/recommended IDs separate.
- Avoid misrepresenting `No match` as a success or displaying electricity cost for a nonexistent recommended unit.
- Keep the fictional equipment **nominal** capacities distinct from portable **comparison** capacity and from input **electrical power**.
- Do not silently rewrite the approved numeric dataset, room defaults or seven-screen design.
- Do not assert an Android build, airplane-mode test, push or repository setup was completed unless actually verified.

## 14. What I expect you to deliver to the student

At minimum, leave behind:

1. Complete React Native/Expo TypeScript source organized as described, runnable using recorded commands.
2. Exactly seven implemented screens with approved behaviors and accessible UI.
3. Bundled fourteen-record original catalogue, pure calculation modules, real local search/filter/detail and AsyncStorage saved rooms.
4. Real automated calculation fixtures and relevant UI/storage/manual test results.
5. Build/offline-test instructions, plus actual installed-build evidence if the environment allows it.
6. README explaining assumptions, architecture, usage, known limitations, and how to install/run/build.
7. Individual GitHub repo commits and pushes **only if access is supplied**; otherwise transparent local commit status and clear instructions for connecting/pushing.
8. A beginner-friendly explanation of: app entry point, seven-route navigator, React Context flow, local dataset, cooling and energy formulas, Room Lab temporary state, AsyncStorage save/edit/delete, and how to troubleshoot common issues.

### First response in the Codex implementation chat

After reading both documents and inspecting available workspace, **briefly**: (a) confirm understood scope/stack and authority order; (b) state what environment/repo you actually found and any truly blocking issue; (c) outline milestone order; then **begin M0**. Avoid asking the user to reapprove planning decisions already approved. If an initial repository or workspace is supplied, use it rather than scaffolding over it. Do not leave the project at mockup-only stage.

---

**End of Codex AI Handover v1.0.** This document is a companion to the approved **ACSize Master Specification v1.2**; together they define the implementation task. Both documents describe a planned project, not proof that any application code, build, tests or GitHub history already exists.
