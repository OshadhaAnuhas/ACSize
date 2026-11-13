# ACSize modern icons

These 27 SVG files and `contact-sheet.png` came from the user-supplied `acsize-icons-modern.zip`. The original ZIP's Python generator is not needed by the app and was not copied or run.

The SVG files are the editable source assets. After changing one, run:

```powershell
node scripts/generate-icon-xml.mjs
```

This regenerates `src/data/iconXml.ts`. `ChoiceArtwork.tsx` renders the XML through the already-installed `react-native-svg` library and caches each parsed icon. No asset network request or SVG transformer is required at runtime.
