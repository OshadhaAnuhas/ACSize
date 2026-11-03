export function calculateEnergy(inputPowerKW: number, dailyHours: number, rateLKRPerKWh: number) {
  const monthlyKWh = inputPowerKW * dailyHours * 30 * 0.65;
  return { monthlyKWh, monthlyAdditionalEnergyCostLKR: monthlyKWh * rateLKRPerKWh };
}
