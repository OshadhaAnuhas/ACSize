import { SavedRoomRecord } from '../types/room';

const oneOf = <T extends string>(value: unknown, choices: readonly T[]): value is T =>
  typeof value === 'string' && choices.includes(value as T);
const range = (value: unknown, min: number, max: number, integer = false): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value));
const identifier = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const optionalIdentifier = (value: unknown): value is string | null => value === null || identifier(value);
const timestamp = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;

export function isSavedRoomRecord(value: unknown): value is SavedRoomRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const room = value as Record<string, unknown>;
  return room.schemaVersion === 1 && identifier(room.id) && room.sourceSavedRoomId === room.id &&
    typeof room.name === 'string' && room.name.trim().length > 0 && room.name.trim().length <= 60 &&
    oneOf(room.roomType, ['bedroom', 'living', 'office']) &&
    range(room.lengthM, 2, 15) && range(room.widthM, 2, 15) && range(room.heightM, 2, 5) &&
    oneOf(room.preferredUnit, ['metric', 'imperial']) && range(room.occupants, 1, 10, true) &&
    oneOf(room.sunlight, ['low', 'medium', 'high']) &&
    oneOf(room.windowCategory, ['none', 'small', 'large']) &&
    oneOf(room.roofConfiguration, ['floorAbove', 'withCeiling', 'concreteSlab', 'noCeiling']) &&
    oneOf(room.installationPreference, ['either', 'split', 'portable']) &&
    range(room.dailyUsageHours, 1, 16, true) &&
    oneOf(room.selectionPriority, ['budget', 'balanced', 'energy']) &&
    range(room.electricityRateLKRPerKWh, 10, 80) &&
    optionalIdentifier(room.selectedACId) && optionalIdentifier(room.lastRecommendedACId) &&
    range(room.lastEstimatedBTU, 0, Number.MAX_SAFE_INTEGER) &&
    timestamp(room.createdAt) && timestamp(room.updatedAt);
}

export function decodeSavedRooms(raw: string | null): { records: SavedRoomRecord[]; hadInvalid: boolean } {
  if (raw === null) return { records: [], hadInvalid: false };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { records: [], hadInvalid: true };
    const records: SavedRoomRecord[] = [];
    const ids = new Set<string>();
    let hadInvalid = false;
    for (const item of parsed) {
      if (!isSavedRoomRecord(item) || ids.has(item.id)) { hadInvalid = true; continue; }
      ids.add(item.id);
      records.push(item);
    }
    return { records, hadInvalid };
  } catch {
    return { records: [], hadInvalid: true };
  }
}
