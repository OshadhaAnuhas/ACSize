export type RoomType = 'bedroom' | 'living' | 'office';
export type UnitSystem = 'metric' | 'imperial';
export type Sunlight = 'low' | 'medium' | 'high';
export type WindowCategory = 'none' | 'small' | 'large';
export type RoofConfiguration = 'floorAbove' | 'withCeiling' | 'concreteSlab' | 'noCeiling';
export type InstallationPreference = 'either' | 'split' | 'portable';
export type SelectionPriority = 'budget' | 'balanced' | 'energy';
export type Airflow = 'still' | 'gentle' | 'strong';
export interface RoomDraft {
  sourceSavedRoomId: string | null; name: string; roomType: RoomType; lengthM: number; widthM: number;
  heightM: number; preferredUnit: UnitSystem; occupants: number; sunlight: Sunlight;
  windowCategory: WindowCategory; roofConfiguration: RoofConfiguration;
  installationPreference: InstallationPreference; dailyUsageHours: number; selectionPriority: SelectionPriority;
  electricityRateLKRPerKWh: number; selectedACId: string | null;
}
export interface ComfortSettings { temperatureC: number; humidityPercent: number; airflow: Airflow; }
export interface RoomLabScenario extends RoomDraft { comfort: ComfortSettings; }
export interface SavedRoomRecord extends RoomDraft {
  id: string; schemaVersion: 1; createdAt: string; updatedAt: string;
  lastEstimatedBTU: number; lastRecommendedACId: string | null;
}
export const ROOM_NAMES: Record<RoomType, string> = { bedroom: 'My Bedroom', living: 'My Living Room', office: 'My Office' };
export function createDefaultRoom(): RoomDraft {
  return { sourceSavedRoomId: null, name: ROOM_NAMES.bedroom, roomType: 'bedroom', lengthM: 4, widthM: 3,
    heightM: 2.7, preferredUnit: 'metric', occupants: 2, sunlight: 'medium', windowCategory: 'small',
    roofConfiguration: 'withCeiling', installationPreference: 'either', dailyUsageHours: 8,
    selectionPriority: 'balanced', electricityRateLKRPerKWh: 40, selectedACId: null };
}
