import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeLocalProfile, defaultProfilePreferences } from '../src/types/profile';

test('local profile survives a JSON round trip with offline preferences', () => {
  const saved = { schemaVersion: 1, name: 'Asha', preferredUnit: 'imperial', electricityRateLKRPerKWh: 52, themeMode: 'dark' };
  assert.deepEqual(decodeLocalProfile(JSON.stringify(saved)), saved);
  assert.equal(defaultProfilePreferences.preferredUnit, 'metric');
});

test('invalid or outdated profiles cannot set app defaults', () => {
  assert.equal(decodeLocalProfile('{'), null);
  assert.equal(decodeLocalProfile(JSON.stringify({ schemaVersion: 2, name: 'Asha', preferredUnit: 'metric', electricityRateLKRPerKWh: 40, themeMode: 'system' })), null);
  assert.equal(decodeLocalProfile(JSON.stringify({ schemaVersion: 1, name: 'Asha', preferredUnit: 'metric', electricityRateLKRPerKWh: 900, themeMode: 'system' })), null);
});
