import { Airflow } from '../types/room';
export type ComfortLabel = 'Cool' | 'Comfortable' | 'Warm';
export function calculateComfort(temperatureC: number, humidityPercent: number, airflow: Airflow): { label: ComfortLabel; explanation: string } {
  const humidityAdjustment = humidityPercent < 50 ? 0 : humidityPercent < 70 ? 0.5 : 1.5;
  const airflowAdjustment = { still: 0, gentle: 0.5, strong: 1 }[airflow];
  const index = temperatureC + humidityAdjustment - airflowAdjustment;
  const label: ComfortLabel = index < 24 ? 'Cool' : index <= 28 ? 'Comfortable' : 'Warm';
  const explanation = label === 'Cool' ? 'The selected hypothetical conditions lean cool.' : label === 'Warm' ? 'Higher temperature or humidity makes this educational scenario feel warmer.' : 'The selected hypothetical conditions fall in the comfortable demonstration band.';
  return { label, explanation };
}
