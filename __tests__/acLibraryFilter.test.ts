import assert from 'node:assert/strict';
import test from 'node:test';

import { acProfiles } from '../src/data/acProfiles';
import { ACLibraryFilters, filterACProfiles } from '../src/services/acLibraryFilter';

const all: ACLibraryFilters = { search: '', category: 'all', capacity: 'all', technology: 'all', efficiency: 'all' };

test('library search ignores case and surrounding spaces', () => {
  const matches = filterACProfiles(acProfiles, { ...all, search: '  spl-12-inv  ' });
  assert.deepEqual(matches.map(profile => profile.id), ['SPL-12-INV']);
});

test('library filters combine category, capacity, technology and efficiency', () => {
  const matches = filterACProfiles(acProfiles, {
    search: 'inverter', category: 'split', capacity: '12000', technology: 'inverter', efficiency: 'efficient',
  });
  assert.deepEqual(matches.map(profile => profile.id), ['SPL-12-INV']);
  assert.deepEqual(filterACProfiles(acProfiles, { ...all, category: 'portable', capacity: '24000' }), []);
});

test('clearing filters restores the bundled catalogue', () => {
  assert.deepEqual(filterACProfiles(acProfiles, all).map(profile => profile.id), acProfiles.map(profile => profile.id));
});
