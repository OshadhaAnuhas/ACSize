import { ACProfile } from '../types/ac';
import { InstallationPreference } from '../types/room';
import { getSuitability } from './recommendationEngine';

export type MatchLevel = 'below' | 'higher' | 'installation' | 'meets' | 'none' | 'invalid';
export interface RoomLabMatch { level: MatchLevel; title: string; explanation: string; }

export function describeRoomLabMatch(
  selected: ACProfile | null | undefined,
  estimatedBTUh: number | null,
  installation: InstallationPreference,
  manuallySelected: boolean,
): RoomLabMatch {
  if (estimatedBTUh === null) return { level: 'invalid', title: 'Check room measurements', explanation: 'Enter valid room dimensions to compare this AC with the estimated demand.' };
  if (!selected) return { level: 'none', title: 'No suitable AC in this catalogue', explanation: `The room needs about ${estimatedBTUh.toLocaleString()} BTU/h. Try changing the installation preference or room conditions.` };

  const capacity = selected.comparisonCapacityBTU;
  const comparison = `${capacity.toLocaleString()} BTU/h comparison capacity versus ${estimatedBTUh.toLocaleString()} BTU/h estimated demand.`;
  const suitability = getSuitability(selected, estimatedBTUh);
  const installationDiffers = installation !== 'either' && selected.category !== installation;
  if (suitability === 'below') return { level: 'below', title: 'Below estimated requirement', explanation: `${comparison} This AC is short by ${(estimatedBTUh - capacity).toLocaleString()} BTU/h.${installationDiffers ? ` It also differs from the chosen ${installation} installation type.` : ''}` };
  if (installationDiffers) return { level: 'installation', title: 'Installation preference differs', explanation: `${comparison} Capacity is sufficient, but this ${selected.category} AC differs from the chosen ${installation} installation type.` };
  if (suitability === 'higher') return { level: 'higher', title: 'Higher than estimated need', explanation: `${comparison} Its capacity is more than 1.5 times the estimate; consider a smaller sufficient class.` };
  return { level: 'meets', title: 'Meets estimated requirement', explanation: `${comparison} ${manuallySelected ? 'This tested AC has sufficient capacity for the estimate.' : 'The automatic recommendation uses the smallest sufficient capacity class.'}` };
}
