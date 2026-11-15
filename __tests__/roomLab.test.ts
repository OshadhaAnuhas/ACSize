import assert from 'node:assert/strict';
import test from 'node:test';
import { findACProfile } from '../src/data/acProfiles';
import { calculateComfort, calculateComfortOutlook } from '../src/services/comfortCalculator';
import { estimateCooling } from '../src/services/coolingEstimator';
import { calculateEnergy } from '../src/services/energyCalculator';
import { recommendAC } from '../src/services/recommendationEngine';
import { describeRoomLabMatch } from '../src/services/roomLabMatch';
import { createDefaultRoom } from '../src/types/room';

const room = createDefaultRoom();
const baseline = estimateCooling(room);

test('Room tab choices recalculate demand, including every room-condition family', () => {
  assert.equal(baseline.estimatedBTUh, 8700);
  for (const roomType of ['living', 'office'] as const) assert.ok(estimateCooling({ ...room, roomType }).rawBTUh > baseline.rawBTUh);
  for (const [key, value] of [
    ['lengthM', 5], ['widthM', 4], ['heightM', 3], ['sunlight', 'high'],
    ['windowCategory', 'large'], ['roofConfiguration', 'noCeiling'],
  ] as const) assert.ok(estimateCooling({ ...room, [key]: value }).rawBTUh > baseline.rawBTUh, `${key} should increase demand`);
  assert.equal(estimateCooling({ ...room, occupants: 1 }).rawBTUh, baseline.rawBTUh);
  assert.equal(estimateCooling({ ...room, occupants: 3 }).rawBTUh - baseline.rawBTUh, 500);
  assert.equal(estimateCooling({ ...room, occupants: 10 }).rawBTUh - baseline.rawBTUh, 4000);
  const imperialDisplay = { ...room, preferredUnit: 'imperial' as const };
  assert.equal(estimateCooling(imperialDisplay).estimatedBTUh, baseline.estimatedBTUh);
});

test('AC tab selection updates capacity status and explains manual mismatch', () => {
  const recommended = recommendAC(baseline.estimatedBTUh, room.installationPreference, room.selectionPriority).recommended;
  assert.equal(recommended?.id, 'SPL-09-INV');
  assert.equal(describeRoomLabMatch(recommended, baseline.estimatedBTUh, 'either', false).level, 'meets');
  assert.equal(describeRoomLabMatch(findACProfile('POR-09-CMP'), baseline.estimatedBTUh, 'either', true).level, 'below');
  assert.match(describeRoomLabMatch(findACProfile('POR-09-CMP'), baseline.estimatedBTUh, 'split', true).explanation, /differs from the chosen split/);
  assert.equal(describeRoomLabMatch(findACProfile('SPL-24-INV'), baseline.estimatedBTUh, 'either', true).level, 'higher');
  assert.equal(describeRoomLabMatch(findACProfile('POR-12-PLUS'), baseline.estimatedBTUh, 'split', true).level, 'installation');
  assert.equal(describeRoomLabMatch(recommended, null, 'either', false).level, 'invalid');
  assert.equal(describeRoomLabMatch(null, 30000, 'either', false).level, 'none');
  assert.equal(recommendAC(30000, 'split', 'balanced').recommended, null);
});

test('Energy tab hours and rate change cost without changing cooling demand', () => {
  const power = findACProfile('SPL-09-INV')!.illustrativeInputPowerKW;
  const initial = calculateEnergy(power, room.dailyUsageHours, room.electricityRateLKRPerKWh);
  assert.ok(Math.abs(calculateEnergy(power, 9, 40).monthlyKWh - initial.monthlyKWh - power * 30 * 0.65) < 1e-9);
  assert.equal(calculateEnergy(power, 8, 45).monthlyKWh, initial.monthlyKWh);
  assert.ok(calculateEnergy(power, 8, 45).monthlyAdditionalEnergyCostLKR > initial.monthlyAdditionalEnergyCostLKR);
  const differentUsage = { ...room, dailyUsageHours: 16, electricityRateLKRPerKWh: 80 };
  assert.equal(estimateCooling(differentUsage).estimatedBTUh, baseline.estimatedBTUh);
});

test('Comfort tab temperature, RH and airflow change only the hypothetical comfort label', () => {
  assert.equal(calculateComfort(26, 60, 'gentle').label, 'Comfortable');
  assert.equal(calculateComfort(23, 30, 'strong').label, 'Cool');
  assert.equal(calculateComfort(29, 80, 'still').label, 'Warm');
  assert.equal(calculateComfort(28, 60, 'still').label, 'Warm');
  assert.equal(calculateComfort(28, 60, 'strong').label, 'Comfortable');
  assert.equal(estimateCooling(room).estimatedBTUh, baseline.estimatedBTUh);
});

test('humidity changes visible warmth and extra people can strain the same selected AC', () => {
  const baseComfort = calculateComfort(26, 60, 'gentle');
  const moreHumid = calculateComfort(26, 65, 'gentle');
  assert.ok(moreHumid.warmthScore > baseComfort.warmthScore);
  assert.equal(calculateComfort(26, 90, 'gentle').label, 'Warm');
  const selected = findACProfile('SPL-09-INV')!;
  const baseOutlook = calculateComfortOutlook(baseComfort, selected.comparisonCapacityBTU, baseline.estimatedBTUh);
  const crowdedOutlook = calculateComfortOutlook(baseComfort, selected.comparisonCapacityBTU, estimateCooling({ ...room, occupants: 3 }).estimatedBTUh);
  assert.equal(baseOutlook.label, 'Comfortable');
  assert.equal(baseOutlook.headroomBTUh, 300);
  assert.equal(crowdedOutlook.label, 'At risk');
  assert.equal(crowdedOutlook.headroomBTUh, -200);
});
