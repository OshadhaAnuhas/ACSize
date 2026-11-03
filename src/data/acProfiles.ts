import { ACProfile, ACTechnology, EfficiencyTier, PurchaseTier } from '../types/ac';

const BTU_TO_KW = 0.000293071;
type SplitSeed = [string, string, number, number, ACTechnology, PurchaseTier, EfficiencyTier];
const splitSeeds: SplitSeed[] = [
  ['SPL-09-STD', '9K Standard', 9000, 0.98, 'fixed-speed', 'budget', 'standard'],
  ['SPL-09-INV', '9K Inverter', 9000, 0.78, 'inverter', 'mid-range', 'efficient'],
  ['SPL-09-ECO', '9K Eco Inverter', 9000, 0.69, 'eco-inverter', 'premium', 'high'],
  ['SPL-12-STD', '12K Standard', 12000, 1.25, 'fixed-speed', 'budget', 'standard'],
  ['SPL-12-INV', '12K Inverter', 12000, 1.05, 'inverter', 'mid-range', 'efficient'],
  ['SPL-12-ECO', '12K Eco Inverter', 12000, 0.9, 'eco-inverter', 'premium', 'high'],
  ['SPL-18-STD', '18K Standard', 18000, 1.9, 'fixed-speed', 'budget', 'standard'],
  ['SPL-18-INV', '18K Inverter', 18000, 1.55, 'inverter', 'mid-range', 'efficient'],
  ['SPL-18-ECO', '18K Eco Inverter', 18000, 1.35, 'eco-inverter', 'premium', 'high'],
  ['SPL-24-STD', '24K Standard', 24000, 2.55, 'fixed-speed', 'budget', 'standard'],
  ['SPL-24-INV', '24K Inverter', 24000, 2.1, 'inverter', 'mid-range', 'efficient'],
  ['SPL-24-ECO', '24K Eco Inverter', 24000, 1.85, 'eco-inverter', 'premium', 'high'],
];
const useByCapacity: Record<number, string> = {
  9000: 'Compact bedrooms and small offices with modest cooling demand.',
  12000: 'Medium bedrooms, living areas and offices needing a step up in capacity.',
  18000: 'Larger living rooms or offices within this simplified catalogue.',
  24000: 'The highest room loads supported by the ACSize v1 catalogue.',
};
const techCopy: Record<ACTechnology, { description: string; features: string[]; limitation: string }> = {
  'fixed-speed': { description: 'a straightforward fixed-speed split focused on a lower illustrative purchase tier.', features: ['Simple on/off compressor operation', 'Budget-oriented equipment profile', 'Permanent indoor and outdoor units'], limitation: 'Fixed-speed operation has higher illustrative input than inverter profiles in the same class.' },
  inverter: { description: 'a balanced inverter split with variable compressor operation and moderate electrical input.', features: ['Variable compressor operation', 'Balanced cost and efficiency', 'Steadier operation than the standard profile'], limitation: 'Its illustrative purchase tier is higher than the standard profile in the same class.' },
  'eco-inverter': { description: 'an efficiency-priority inverter split with the lowest illustrative input in its class.', features: ['Efficiency-priority profile', 'Lowest class input-power assumption', 'Variable compressor operation'], limitation: 'The premium tier is illustrative and is not a verified market price.' },
  portable: { description: '', features: [], limitation: '' },
};
const splitProfiles: ACProfile[] = splitSeeds.map(([id, name, capacity, power, technology, tier, efficiency]) => ({
  id, name, category: 'split', technology, nominalCapacityBTU: capacity, comparisonCapacityBTU: capacity,
  coolingCapacityKW: capacity * BTU_TO_KW, illustrativeInputPowerKW: power, purchaseCostTier: tier,
  efficiencyTier: efficiency, description: `${name} is ${techCopy[technology].description}`,
  features: [`${capacity.toLocaleString()} BTU/h nominal cooling class`, ...techCopy[technology].features],
  recommendedUse: useByCapacity[capacity],
  installationNotes: 'Requires professional placement of indoor and outdoor units and a suitable electrical supply.',
  limitations: [techCopy[technology].limitation, 'Actual performance depends on equipment, installation and room conditions.'],
}));
const portableProfiles: ACProfile[] = [
  { id: 'POR-09-CMP', name: 'Portable Compact', category: 'portable', technology: 'portable', nominalCapacityBTU: 9000, comparisonCapacityBTU: 7200, coolingCapacityKW: 9000 * BTU_TO_KW, illustrativeInputPowerKW: 1.05, purchaseCostTier: 'budget', efficiencyTier: 'standard', description: 'A compact movable profile for smaller loads where permanent split installation is unsuitable.', features: ['Movable floor unit', '9,000 BTU/h nominal class', 'Illustrative 7,200 BTU/h comparison capacity'], recommendedUse: 'Small rooms whose estimated requirement does not exceed the comparison capacity.', installationNotes: 'Must exhaust hot air outdoors through a suitable window or wall opening.', limitations: ['The 80% comparison is an ACSize educational assumption, not a certified SACC rating.', 'Takes floor space and requires an exhaust hose.'] },
  { id: 'POR-12-PLUS', name: 'Portable Plus', category: 'portable', technology: 'portable', nominalCapacityBTU: 12000, comparisonCapacityBTU: 9600, coolingCapacityKW: 12000 * BTU_TO_KW, illustrativeInputPowerKW: 1.4, purchaseCostTier: 'mid-range', efficiencyTier: 'standard', description: 'The larger portable profile for moderate loads that remain below the portable comparison limit.', features: ['Movable single-room format', '12,000 BTU/h nominal class', 'Illustrative 9,600 BTU/h comparison capacity'], recommendedUse: 'Rooms needing portable installation with an estimate up to 9,600 BTU/h.', installationNotes: 'Requires continuous outdoor exhaust and clearance around the floor unit.', limitations: ['No portable profile in v1 is sufficient above 9,600 comparison BTU/h.', 'The comparison capacity is fictional application logic, not a product certification.'] },
];
export const acProfiles: readonly ACProfile[] = [...splitProfiles, ...portableProfiles];
export function findACProfile(id: string | null | undefined) { return id ? acProfiles.find((profile) => profile.id === id) : undefined; }
