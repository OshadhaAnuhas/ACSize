import { acProfiles } from '../data/acProfiles';
import { ACProfile, ACTechnology } from '../types/ac';
import { InstallationPreference, SelectionPriority } from '../types/room';

const priorityTechnology: Record<SelectionPriority, ACTechnology> = { budget: 'fixed-speed', balanced: 'inverter', energy: 'eco-inverter' };
export interface RecommendationResult { recommended: ACProfile | null; alternatives: ACProfile[]; splitAlternatives: ACProfile[]; reasons: string[]; noMatchReason: string | null; }

export function recommendAC(estimatedBTUh: number, installation: InstallationPreference, priority: SelectionPriority): RecommendationResult {
  const eligible = acProfiles.filter((p) => installation === 'either' ? p.category === 'split' : p.category === installation);
  const sufficient = eligible.filter((p) => p.comparisonCapacityBTU >= estimatedBTUh);
  const splitAlternatives = acProfiles.filter((p) => p.category === 'split' && p.comparisonCapacityBTU >= estimatedBTUh).slice(0, 3);
  if (!sufficient.length) {
    const portableFailure = installation === 'portable' && splitAlternatives.length > 0;
    return { recommended: null, alternatives: [], splitAlternatives, reasons: [], noMatchReason: portableFailure ? 'No portable profile is sufficient for this room. Suitable split alternatives are shown below.' : 'No suitable match in the current catalogue.' };
  }
  const capacity = Math.min(...sufficient.map((p) => p.comparisonCapacityBTU));
  const capacityClass = sufficient.filter((p) => p.comparisonCapacityBTU === capacity);
  const desired = priorityTechnology[priority];
  const recommended = capacityClass.find((p) => p.technology === desired) ?? capacityClass.slice().sort((a, b) => a.illustrativeInputPowerKW - b.illustrativeInputPowerKW)[0];
  const reasons = [`Meets the estimated ${estimatedBTUh.toLocaleString()} BTU/h requirement`, `Uses the smallest sufficient ${capacity.toLocaleString()} BTU/h comparison class`, installation === 'either' ? 'Prefers a permanent split profile when either format is acceptable' : `Matches the ${installation} installation preference`];
  if (recommended.category === 'portable') reasons.push('Portable profiles have no invented Eco variants; the available sufficient option is selected deterministically');
  else reasons.push(priority === 'budget' ? 'Prioritizes the lower illustrative purchase tier' : priority === 'energy' ? 'Prioritizes lower illustrative electrical input' : 'Balances illustrative purchase tier and efficiency');
  const alternatives = acProfiles.filter((p) => p.id !== recommended.id && p.comparisonCapacityBTU >= estimatedBTUh && (installation === 'either' ? p.category === 'split' : p.category === installation)).slice(0, 4);
  return { recommended, alternatives, splitAlternatives: [], reasons, noMatchReason: null };
}

export type Suitability = 'below' | 'higher' | 'meets';
export function getSuitability(profile: ACProfile, estimatedBTUh: number): Suitability {
  if (profile.comparisonCapacityBTU < estimatedBTUh) return 'below';
  if (profile.comparisonCapacityBTU > estimatedBTUh * 1.5) return 'higher';
  return 'meets';
}
