# ACSize icon creation handover

**Status (12 November 2026):** Fulfilled by the user-supplied `acsize-icons-modern.zip`. The 27 modern duotone SVGs are now integrated from `assets/icons-modern/`. The brief below records the original design request; the supplied modern duotone treatment is the accepted asset set and takes precedence over any stricter line-only direction below.

**For:** Claude AI or another icon designer

**Project:** ACSize, an offline Expo/React Native room cooling estimator

**Scope:** Create the icon files and previews described here. Do not edit the application code, navigation, calculations, or existing room images. The owner will provide the completed assets for integration.

## Design decision

Use **precision architectural line art** for button infographics and small UI symbols. This means deliberate, clean vector geometry, consistent strokes, and simple visual metaphors. It must look like a contemporary technical product interface, not a hand sketch, emoji, clip art, or children's illustration. The current shaded SVG artwork in `src/components/ChoiceArtwork.tsx` is a functional inventory reference, **not** a style reference.

The detailed bedroom, living room, and office scenes in `assets/room-bedroom.png`, `assets/room-living.png`, and `assets/room-office.png` remain images. Larger art on Recommendation and AC Details may also use images later. Do not force photographic room detail into these small line icons.

### Shared visual rules

- Draw all button icons on a transparent **96 × 96 SVG viewBox**, centered with roughly 10 units of clear space on each side. The subject should occupy most of the remaining area. No baked-in tile, circle, card, border, label, or shadow: the app supplies the button card and selected state.
- Use a consistent three-quarter architectural perspective for physical objects such as ACs, windows, roofs, beds, sofas, and desks. Sun and priority symbols may be front-facing. Keep the same angle throughout each family.
- Primary outline: `#0F172A` (navy), about **3.5 viewBox units** wide, round caps and joins. Secondary construction lines: about **2 units**, used sparingly. Avoid hairlines; the icons also appear in 40–45 px room callouts.
- Use **one accent color per icon** where it helps recognition: teal `#0D9488` for equipment and rooms, blue `#2563EB` for windows and electricity, amber `#F59E0B` for sunlight and cost. Accent may be a short stroke or one small flat fill. Keep the drawing understandable in monochrome.
- Prefer open space and a recognizable silhouette over tiny details. At 40 px, each option must still be distinct from the other options in its group. Do not use gradients, glossy shading, textures, realistic reflections, faces, or decorative rays everywhere.
- The app selects an option with its card border, background, and label. **Deliver one neutral icon per option**, not separate selected/unselected files. Do not encode state using color alone.
- Use pure vector paths and basic SVG shapes. No embedded PNG/JPG, external font, text element, external link, CSS class, filter, animation, or auto-traced photo paths. Keep a `viewBox` and use explicit colors. Aim for a small and simple SVG (ideally under 8 KB each) without sacrificing clarity.
- Deliver a contact sheet showing every icon at **72 px** on white and at **40 px** on the app's pale backgrounds (`#EFF6FF`, `#E5F7F8`, `#FEF3C7`). If any icon needs its label to be understood, redraw it.

## Required button icons — 21 files

The names below are the required file names. `No preference` is a composition of `ac-split` and `ac-portable`, so it needs no third AC drawing.

### Sunlight — 3

Use the **same sun language and placement** across the three files so the difference reads as intensity, not three unrelated weather conditions. The current labels are Low, Medium, and High.

| File | Drawing instruction |
| --- | --- |
| `sun-low.svg` | A small sun partly obscured by one simple cloud or horizon edge; no more than two short rays. It must suggest little direct sunlight, not rain or night. |
| `sun-medium.svg` | A clearly visible mid-size sun with four short rays and a modest horizon/window cue. Make it visibly stronger than Low without becoming the High icon. |
| `sun-high.svg` | A large unobscured sun with eight evenly spaced short rays. Keep the circle and rays bold and clean; avoid a face or burst-like decoration. |

### Windows — 3

Use a shared wall-plane/frame geometry. Change the **opening area**, not the perspective, so the option sizes compare immediately.

| File | Drawing instruction |
| --- | --- |
| `window-none.svg` | One solid wall plane with trim but **no opening**. Do not draw a crossed-out window; a cross can imply a disabled control. |
| `window-small.svg` | The same wall plane with one small, single window opening and a simple frame. Leave generous wall around it. |
| `window-large.svg` | The same wall plane with a visibly larger two-pane opening occupying most of the available wall width. Do not merely scale up the Small drawing. |

### Roof and ceiling — 4

Draw a small building section from the same three-quarter angle in every file. The roof and the line immediately beneath it should carry the meaning. At button size, use only the minimum construction lines needed.

| File | Drawing instruction |
| --- | --- |
| `roof-ceiling.svg` | Pitched sheet/tile roof with a distinct flat ceiling line below it, leaving a small air gap. Two roof seams may suggest sheets/tiles. |
| `roof-concrete.svg` | Thick flat concrete slab with a clearly visible side thickness and one restrained hatch/seam. No pitched roof shape. |
| `roof-none.svg` | Pitched roof with the underside open to the room; omit the flat ceiling line. Show the open gap clearly without a red X. |
| `roof-floor.svg` | Two horizontal levels: a floor/room above and a ceiling below. Make the stacked construction obvious and different from the single concrete slab. |

### Installation — 2

These are reused in Room Setup, Room Lab, AC Library, and possibly larger AC views. They must be recognizable without brand details. The `No preference` button will show both icons side by side.

| File | Drawing instruction |
| --- | --- |
| `ac-split.svg` | A wall-mounted horizontal indoor split AC: long rounded housing, dark lower vent, and one restrained short airflow cue. No outdoor unit is needed at button size. |
| `ac-portable.svg` | An upright floor AC on small wheels, front vent/control, and a short exhaust hose emerging from the upper rear. It must not resemble a tower fan. |

### Main priority — 3

These icons explain the **selection preference**. Use one central symbol, not a scene. The app label supplies the full meaning.

| File | Drawing instruction |
| --- | --- |
| `priority-cost.svg` | Two or three simple coins and a downward cost arrow. Avoid currency letters and tiny denominations. |
| `priority-balanced.svg` | A balanced scale or equal-weight motif with one small cost cue and one small electricity cue. Keep the central balance silhouette readable; do not pack in three detailed objects. |
| `priority-energy.svg` | A lightning bolt or plug with a downward consumption arrow. This means lower electricity use; avoid a leaf-only symbol, which can imply a different environmental claim. |

### Room type — 3

These appear as buttons in Room Lab. Keep the same low isometric floor-plane cue and object scale across all three. The existing large room PNGs are reference material for furniture identity only.

| File | Drawing instruction |
| --- | --- |
| `room-bedroom.svg` | Bed with a visible pillow and headboard. Bed must dominate; omit lamps/plants. |
| `room-living.svg` | Sofa with two cushions and a small low table if space permits. Sofa must dominate. |
| `room-office.svg` | Desk with a monitor and chair silhouette. It should read as a small office, not a generic laptop icon. |

### Airflow — 3

These are the Room Lab Comfort buttons. Keep the same baseline and wave direction; only the strength changes. Use the blue accent sparingly.

| File | Drawing instruction |
| --- | --- |
| `airflow-still.svg` | A short level dash or quiet air symbol with no traveling waves. Avoid a prohibition sign. |
| `airflow-gentle.svg` | One or two smooth, shallow airflow curves moving in the same direction. |
| `airflow-strong.svg` | Three longer, more pronounced airflow curves, with optional short arrow tips. It must be visibly stronger at 40 px. |

## Supporting icons — 6 files

These complete the current icon inventory but are **not** button infographics. Keep them in the same line-art family with a simpler **24 × 24 viewBox** and approximately 2-unit primary stroke. They may remain monochrome and receive their color from the app.

| File | Drawing instruction |
| --- | --- |
| `person.svg` | Neutral adult human silhouette, no facial features or childlike proportions. The app repeats one figure to indicate count and also displays the number in text. Provide a version that remains legible at about 40 px. |
| `nav-home.svg` | Simple roof/house outline for the Home tab, without interior detail. |
| `nav-library.svg` | A compact catalogue/grid or stacked AC-card motif; distinguish it from Home and Saved. |
| `nav-saved.svg` | Bookmark or saved-card outline; avoid a decorative heart unless it is unmistakably a saved state. |
| `brand-snowflake.svg` | Balanced six-arm snowflake, clean and geometric, suitable beside the ACSize wordmark. Do not use an overly intricate ice crystal. |
| `info.svg` | Standard circled information mark, optically centered and clear at 20–24 px. |

The app's native back arrow, plus/minus adjusters, check mark, and chevrons can remain system/text controls. Do not create extra illustrations for them unless specifically asked.

## Delivery package

1. **27 standalone SVG files:** the 21 required button icons and six supporting icons, named exactly as above. Use one symbol per file, with transparent background and no labels inside the SVG.
2. A **contact sheet** in PNG or PDF with the filename beneath each icon, showing the full set at actual UI sizes on the backgrounds specified above. Include a close-up of the four roof variants and three sunlight variants, since these are easiest to confuse.
3. A brief `README.md` or manifest with the palette, stroke widths, viewBox sizes, and any intentional exceptions.
4. If an editable source file is available, include it as a bonus. The SVGs themselves must remain usable without that source.

## Acceptance checks before delivery

- Compare the three variants within every family at 40 px and 72 px. Each should be identifiable by shape even without its label or accent color.
- Check every SVG on white, pale blue, pale teal, and pale amber. No stroke should disappear against those backgrounds.
- Check that all physical objects share the same perspective and stroke language. Avoid accidental mixtures of front view, isometric, and perspective in one family.
- Open every file to confirm it is real vector geometry, not an SVG wrapper around a bitmap.
- Keep files local and self-contained. ACSize must work fully offline.

## Integration notes for the owner

ACSize currently uses Expo SDK 58 and `react-native-svg` 15.16.0. The SVG files are handoff source assets; integration will be done after review. The current rendering is in `src/components/ChoiceArtwork.tsx`, `src/components/VisualChoice.tsx`, `src/components/AirflowChoice.tsx`, and `src/components/RoomIllustration.tsx`; labels and choices are mapped in `src/data/visualOptions.ts`. The three room PNGs stay in `assets/`. Do not add an SVG transformer or change native project files as part of icon creation.

References: [Expo SDK 58 SVG support](https://docs.expo.dev/versions/v58.0.0/sdk/svg/) and [Expo local asset guidance](https://docs.expo.dev/develop/user-interface/assets/).
