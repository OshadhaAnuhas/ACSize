import assert from 'node:assert/strict';
import test from 'node:test';

import { acProfiles, findACProfile } from '../src/data/acProfiles';
import { calculateComfort } from '../src/services/comfortCalculator';
import { estimateCooling } from '../src/services/coolingEstimator';
import { calculateEnergy } from '../src/services/energyCalculator';
import { recommendAC } from '../src/services/recommendationEngine';
import { createDefaultRoom } from '../src/types/room';
import { feetToMeters, metersToFeet } from '../src/utils/units';
import { validateRoom } from '../src/utils/validation';

test('catalogue has exactly 14 unique locked profiles', () => {
  assert.equal(acProfiles.length, 14);
  assert.equal(new Set(acProfiles.map((p) => p.id)).size, 14);
  assert.deepEqual(acProfiles.map((p) => [p.id, p.nominalCapacityBTU, p.comparisonCapacityBTU, p.illustrativeInputPowerKW]), [
    ['SPL-09-STD', 9000, 9000, 0.98], ['SPL-09-INV', 9000, 9000, 0.78], ['SPL-09-ECO', 9000, 9000, 0.69],
    ['SPL-12-STD', 12000, 12000, 1.25], ['SPL-12-INV', 12000, 12000, 1.05], ['SPL-12-ECO', 12000, 12000, 0.9],
    ['SPL-18-STD', 18000, 18000, 1.9], ['SPL-18-INV', 18000, 18000, 1.55], ['SPL-18-ECO', 18000, 18000, 1.35],
    ['SPL-24-STD', 24000, 24000, 2.55], ['SPL-24-INV', 24000, 24000, 2.1], ['SPL-24-ECO', 24000, 24000, 1.85],
    ['POR-09-CMP', 9000, 7200, 1.05], ['POR-12-PLUS', 12000, 9600, 1.4],
  ]);
});

test('default room produces 8,700 BTU/h and balanced 9K inverter', () => {
  const room = createDefaultRoom();
  const estimate = estimateCooling(room);
  assert.equal(estimate.baseBTUh, 8400);
  assert.equal(estimate.rawBTUh, 8652);
  assert.equal(estimate.estimatedBTUh, 8700);
  assert.equal(recommendAC(estimate.estimatedBTUh, room.installationPreference, room.selectionPriority).recommended?.id, 'SPL-09-INV');
});

test('third occupant adds 500 raw BTU/h and high heat factors increase demand', () => {
  const room = createDefaultRoom();
  const baseline = estimateCooling(room);
  assert.equal(estimateCooling({ ...room, occupants: 3 }).rawBTUh - baseline.rawBTUh, 500);
  assert.ok(estimateCooling({ ...room, sunlight: 'high' }).estimatedBTUh > baseline.estimatedBTUh);
  assert.ok(estimateCooling({ ...room, roofConfiguration: 'noCeiling' }).estimatedBTUh > baseline.estimatedBTUh);
  assert.ok(estimateCooling({ ...room, lengthM: 5 }).estimatedBTUh > baseline.estimatedBTUh);
});

test('energy fixtures retain unrounded values', () => {
  assert.deepEqual(calculateEnergy(1.05, 8, 40), { monthlyKWh: 163.8, monthlyAdditionalEnergyCostLKR: 6552 });
  const nine = calculateEnergy(0.78, 8, 40);
  assert.ok(Math.abs(nine.monthlyKWh - 121.68) < 1e-10);
  assert.ok(Math.abs(nine.monthlyAdditionalEnergyCostLKR - 4867.2) < 1e-10);
});

test('portable 10K has no match and exposes split alternatives', () => {
  const result = recommendAC(10000, 'portable', 'balanced');
  assert.equal(result.recommended, null);
  assert.ok(result.noMatchReason?.includes('No portable profile'));
  assert.equal(result.splitAlternatives[0].comparisonCapacityBTU, 12000);
});

test('priority is applied only after smallest sufficient class', () => {
  assert.equal(recommendAC(10000, 'either', 'budget').recommended?.id, 'SPL-12-STD');
  assert.equal(recommendAC(10000, 'either', 'balanced').recommended?.id, 'SPL-12-INV');
  assert.equal(recommendAC(10000, 'either', 'energy').recommended?.id, 'SPL-12-ECO');
  assert.equal(recommendAC(25000, 'either', 'balanced').recommended, null);
});

test('comfort examples classify without exposing a physical temperature', () => {
  assert.equal(calculateComfort(26, 60, 'gentle').label, 'Comfortable');
  assert.equal(calculateComfort(29, 80, 'still').label, 'Warm');
});

test('unit conversion round trips and validation rejects invalid physical values', () => {
  assert.ok(Math.abs(feetToMeters(metersToFeet(4)) - 4) < 1e-10);
  const invalid = { ...createDefaultRoom(), name: ' ', lengthM: Number.NaN, heightM: 8, occupants: 0 };
  const errors = validateRoom(invalid);
  assert.ok(errors.name && errors.lengthM && errors.heightM && errors.occupants);
  assert.equal(validateRoom(createDefaultRoom()).name, undefined);
  assert.equal(findACProfile('missing'), undefined);
});
