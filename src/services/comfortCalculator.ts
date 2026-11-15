import { Airflow } from '../types/room';

export type ComfortLabel = 'Cool' | 'Comfortable' | 'Warm';
export type ComfortOutlookLabel = ComfortLabel | 'At risk' | 'No AC match' | 'Check room';

/** An illustrative warmth scale, not a measured or predicted feels-like temperature. */
export function calculateComfort(temperatureC: number, humidityPercent: number, airflow: Airflow): {
  label: ComfortLabel; warmthScore: number; humidityLabel: 'Dry' | 'Moderate' | 'Humid'; explanation: string;
} {
  const airflowAdjustment = { still: 4, gentle: 0, strong: -8 }[airflow];
  const warmthScore = Math.max(0, Math.min(100, Math.round(50 + (temperatureC - 26) * 8 + (humidityPercent - 60) * 0.5 + airflowAdjustment)));
  const label: ComfortLabel = warmthScore < 35 ? 'Cool' : warmthScore <= 60 ? 'Comfortable' : 'Warm';
  const humidityLabel = humidityPercent < 45 ? 'Dry' : humidityPercent <= 65 ? 'Moderate' : 'Humid';
  const explanation = `Illustrative warmth indicator ${warmthScore}/100. ${humidityLabel} humidity; ${airflow} airflow. Higher temperature or RH raises the score, while stronger airflow lowers it.`;
  return { label, warmthScore, humidityLabel, explanation };
}

/** Capacity affects the outlook only when the selected profile is insufficient. */
export function calculateComfortOutlook(
  comfort: ReturnType<typeof calculateComfort>,
  selectedComparisonBTUh: number | null,
  estimatedBTUh: number | null,
): { label: ComfortOutlookLabel; explanation: string; headroomBTUh: number | null } {
  if (estimatedBTUh === null) return { label: 'Check room', explanation: 'Correct the room measurements before assessing comfort.', headroomBTUh: null };
  if (selectedComparisonBTUh === null) return { label: 'No AC match', explanation: 'There is no selected AC with enough information for a capacity check.', headroomBTUh: null };
  const headroomBTUh = selectedComparisonBTUh - estimatedBTUh;
  if (headroomBTUh < 0) return { label: 'At risk', explanation: `The tested AC is short by ${Math.abs(headroomBTUh).toLocaleString()} BTU/h. Extra people or heat can increase this shortfall.`, headroomBTUh };
  return { label: comfort.label, explanation: comfort.explanation, headroomBTUh };
}
