import { ACCategory, ACProfile, ACTechnology, EfficiencyTier } from '../types/ac';

export type ACLibraryFilters = {
  search: string;
  category: ACCategory | 'all';
  capacity: 'all' | '9000' | '12000' | '18000' | '24000';
  technology: ACTechnology | 'all';
  efficiency: EfficiencyTier | 'all';
};

export function filterACProfiles(profiles: readonly ACProfile[], filters: ACLibraryFilters): ACProfile[] {
  const query = filters.search.trim().toLowerCase();
  return profiles.filter(profile => {
    const searchable = [profile.name, profile.id, profile.category, profile.technology, profile.description, ...profile.features].join(' ').toLowerCase();
    return (!query || searchable.includes(query) || String(profile.nominalCapacityBTU).includes(query)) &&
      (filters.category === 'all' || profile.category === filters.category) &&
      (filters.capacity === 'all' || profile.nominalCapacityBTU === Number(filters.capacity)) &&
      (filters.technology === 'all' || profile.technology === filters.technology) &&
      (filters.efficiency === 'all' || profile.efficiencyTier === filters.efficiency);
  });
}
