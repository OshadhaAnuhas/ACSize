import { UnitSystem } from '../types/room';
import { feetToMeters } from './units';

export function parseDimensionInput(text: string, unit: UnitSystem): number {
  const value = text.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return Number.NaN;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return Number.NaN;
  return unit === 'imperial' ? feetToMeters(parsed) : parsed;
}
