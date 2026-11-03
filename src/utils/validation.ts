import { RoomDraft } from '../types/room';
export type RoomErrors = Partial<Record<'name' | 'lengthM' | 'widthM' | 'heightM' | 'occupants' | 'dailyUsageHours' | 'electricityRate', string>>;
const finiteInRange = (value: number, min: number, max: number) => Number.isFinite(value) && value >= min && value <= max;
export function validateRoom(room: RoomDraft): RoomErrors {
  const errors: RoomErrors = {};
  const name = room.name.trim();
  if (!name) errors.name = 'Enter a room name.'; else if (name.length > 60) errors.name = 'Use 60 characters or fewer.';
  if (!finiteInRange(room.lengthM, 2, 15)) errors.lengthM = 'Length must represent 2–15 metres.';
  if (!finiteInRange(room.widthM, 2, 15)) errors.widthM = 'Width must represent 2–15 metres.';
  if (!finiteInRange(room.heightM, 2, 5)) errors.heightM = 'Height must represent 2–5 metres.';
  if (!Number.isInteger(room.occupants) || !finiteInRange(room.occupants, 1, 10)) errors.occupants = 'Occupants must be 1–10.';
  if (!Number.isInteger(room.dailyUsageHours) || !finiteInRange(room.dailyUsageHours, 1, 16)) errors.dailyUsageHours = 'Daily use must be 1–16 hours.';
  if (!finiteInRange(room.electricityRateLKRPerKWh, 10, 80)) errors.electricityRate = 'Rate must be Rs.10–80 per kWh.';
  return errors;
}
