import assert from 'node:assert/strict';
import test from 'node:test';

import { parseDimensionInput } from '../src/utils/dimensionInput';
import { feetToMeters } from '../src/utils/units';
import { createDefaultRoom } from '../src/types/room';
import { validateRoom } from '../src/utils/validation';

test('dimension input parses decimals and converts feet into stored metres', () => {
  assert.equal(parseDimensionInput(' 4.5 ', 'metric'), 4.5);
  assert.equal(parseDimensionInput('12.5', 'imperial'), feetToMeters(12.5));
});

test('invalid visible dimension text invalidates the room instead of retaining an old value', () => {
  for (const text of ['', 'abc', '1,2', '1e3', '.']) {
    const value = parseDimensionInput(text, 'metric');
    assert.equal(Number.isNaN(value), true, text);
    assert.ok(validateRoom({ ...createDefaultRoom(), lengthM: value }).lengthM);
  }
});
