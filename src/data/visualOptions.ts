import { ArtworkKind } from '../components/ChoiceArtwork';

export const sunOptions = [
  { value: 'low', label: 'Low', artwork: 'sun-low' },
  { value: 'medium', label: 'Medium', artwork: 'sun-medium' },
  { value: 'high', label: 'High', artwork: 'sun-high' },
] as const satisfies readonly { value: string; label: string; artwork: ArtworkKind }[];

export const windowOptions = [
  { value: 'none', label: 'None', artwork: 'window-none' },
  { value: 'small', label: 'Small', artwork: 'window-small' },
  { value: 'large', label: 'Large', artwork: 'window-large' },
] as const satisfies readonly { value: string; label: string; artwork: ArtworkKind }[];

export const roofOptions = [
  { value: 'withCeiling', label: 'Sheet/tile + ceiling', artwork: 'roof-ceiling' },
  { value: 'concreteSlab', label: 'Concrete slab', artwork: 'roof-concrete' },
  { value: 'noCeiling', label: 'No ceiling', artwork: 'roof-none' },
  { value: 'floorAbove', label: 'Floor above', artwork: 'roof-floor' },
] as const satisfies readonly { value: string; label: string; artwork: ArtworkKind }[];

export const installationOptions = [
  { value: 'either', label: 'No preference', artwork: ['ac-split', 'ac-portable'] },
  { value: 'split', label: 'Permanent split', artwork: 'ac-split' },
  { value: 'portable', label: 'Portable', artwork: 'ac-portable' },
] as const satisfies readonly { value: string; label: string; artwork: ArtworkKind | readonly ArtworkKind[] }[];

export const priorityOptions = [
  { value: 'budget', label: 'Lower cost', artwork: 'priority-cost' },
  { value: 'balanced', label: 'Balanced', artwork: 'priority-balanced' },
  { value: 'energy', label: 'Lower electricity', artwork: 'priority-energy' },
] as const satisfies readonly { value: string; label: string; artwork: ArtworkKind }[];
