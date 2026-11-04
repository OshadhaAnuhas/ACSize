import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeSavedRooms, isSavedRoomRecord } from '../src/services/savedRoomCodec';
import { createDefaultRoom, SavedRoomRecord } from '../src/types/room';

const valid: SavedRoomRecord = {
  ...createDefaultRoom(), sourceSavedRoomId: 'room-1', id: 'room-1', schemaVersion: 1,
  createdAt: '2026-11-04T00:00:00.000Z', updatedAt: '2026-11-04T01:00:00.000Z',
  lastEstimatedBTU: 8700, lastRecommendedACId: 'SPL-09-INV',
};

test('reads a valid saved room and an empty first launch', () => {
  assert.deepEqual(decodeSavedRooms(null), { records: [], hadInvalid: false });
  assert.deepEqual(decodeSavedRooms(JSON.stringify([valid])), { records: [valid], hadInvalid: false });
});

test('rejects malformed JSON, outdated schema and invalid room inputs without losing good records', () => {
  assert.deepEqual(decodeSavedRooms('{'), { records: [], hadInvalid: true });
  const bad = [
    { ...valid, schemaVersion: 2 }, { ...valid, lengthM: null },
    { ...valid, roofConfiguration: 'unknown' }, { ...valid, occupants: 1.5 },
    { ...valid, createdAt: 'not a date' }, { ...valid, sourceSavedRoomId: 'another-id' },
  ];
  for (const item of bad) assert.equal(isSavedRoomRecord(item), false);
  assert.deepEqual(decodeSavedRooms(JSON.stringify([valid, ...bad])), { records: [valid], hadInvalid: true });
});

test('rejects duplicate IDs and non-array storage', () => {
  assert.deepEqual(decodeSavedRooms(JSON.stringify([valid, valid])), { records: [valid], hadInvalid: true });
  assert.deepEqual(decodeSavedRooms(JSON.stringify({ room: valid })), { records: [], hadInvalid: true });
});
