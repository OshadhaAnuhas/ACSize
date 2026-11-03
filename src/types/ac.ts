export type ACCategory = 'split' | 'portable';
export type ACTechnology = 'fixed-speed' | 'inverter' | 'eco-inverter' | 'portable';
export type PurchaseTier = 'budget' | 'mid-range' | 'premium';
export type EfficiencyTier = 'standard' | 'efficient' | 'high';
export interface ACProfile {
  id: string; name: string; category: ACCategory; technology: ACTechnology;
  nominalCapacityBTU: number; comparisonCapacityBTU: number; coolingCapacityKW: number;
  illustrativeInputPowerKW: number; purchaseCostTier: PurchaseTier; efficiencyTier: EfficiencyTier;
  description: string; features: string[]; recommendedUse: string; installationNotes: string; limitations: string[];
}
