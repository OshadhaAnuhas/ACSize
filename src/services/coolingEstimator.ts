import { RoomDraft } from '../types/room';

const ROOM_FACTORS = { bedroom: 0, living: 0.04, office: 0.08 } as const;
const SUN_FACTORS = { low: -0.05, medium: 0, high: 0.1 } as const;
const WINDOW_FACTORS = { none: -0.03, small: 0, large: 0.08 } as const;
const ROOF_FACTORS = { floorAbove: 0, withCeiling: 0.03, concreteSlab: 0.08, noCeiling: 0.12 } as const;

export interface CoolingEstimate {
  areaM2: number; baseBTUh: number; combinedFactor: number; conditionAdjustmentBTUh: number;
  extraPeopleBTUh: number; rawBTUh: number; estimatedBTUh: number;
}

export function estimateCooling(room: Pick<RoomDraft, 'lengthM' | 'widthM' | 'heightM' | 'roomType' | 'sunlight' | 'windowCategory' | 'roofConfiguration' | 'occupants'>): CoolingEstimate {
  const areaM2 = room.lengthM * room.widthM;
  const baseBTUh = areaM2 * 700;
  const combinedFactor = ROOM_FACTORS[room.roomType] + SUN_FACTORS[room.sunlight] + WINDOW_FACTORS[room.windowCategory] + ROOF_FACTORS[room.roofConfiguration] + (room.heightM - 2.7) * 0.03;
  const conditionAdjustmentBTUh = baseBTUh * combinedFactor;
  const extraPeopleBTUh = Math.max(0, room.occupants - 2) * 500;
  const rawBTUh = baseBTUh + conditionAdjustmentBTUh + extraPeopleBTUh;
  return { areaM2, baseBTUh, combinedFactor, conditionAdjustmentBTUh, extraPeopleBTUh, rawBTUh, estimatedBTUh: Math.round(rawBTUh / 100) * 100 };
}
