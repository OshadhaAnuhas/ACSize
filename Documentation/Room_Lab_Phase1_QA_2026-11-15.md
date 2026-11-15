# Room Lab Phase 1 QA — 15 November 2026

Tested the Expo web preview at 390 × 844 and 320 × 720. The 320 px dashboard wrapped the shared temperature/RH values and the metric cards without overlap. These are browser interaction checks, not an installed Android device test.

| Area | Checks | Result |
| --- | --- | --- |
| Room | All three room types, all sunlight/window/roof choices, metres/feet, length/width/height edits, invalid dimension | Demand updated as expected; unit switch preserved demand; invalid input hid demand and disabled Apply. |
| People | Increased 2→10, decreased 10→1 | Demand rose by 500 raw BTU/h for each person after the second; controls disabled at 1 and 10. |
| AC | Current recommendation, insufficient portable profile, higher-capacity 24K profile, Use Recommended AC, Library selection | Main dashboard showed capacity/reason on every tab; tested AC and illustrative cost updated. |
| Energy | Daily use 1–16 hours, illustrative rate Rs.10–80/kWh | Controls disabled at limits; hours changed kWh/cost, rate changed cost only; demand stayed fixed. |
| Comfort | Temperature 20–34°C, RH 30–90%, Still/Gentle/Strong airflow | Controls disabled at limits; Cool/Comfortable/Warm dashboard status and airflow feedback changed; demand stayed fixed. |
| Scenario | Reset to Entry, Apply Changes | Reset restored the entry scenario; Apply transferred a 3-person scenario and Recommendation recalculated to 9,200 BTU/h/12K Inverter. |

The automated Room Lab tests cover calculation changes, capacity and installation explanations, no-match and invalid-room states, energy, and comfort. The existing saved-room tests still cover persistence. Device-specific interaction, screen reader, and airplane-mode checks remain for the installed APK.
