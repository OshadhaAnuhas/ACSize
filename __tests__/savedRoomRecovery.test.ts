import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreSavedRoom } from '../src/services/savedRoomRecovery';
import { createDefaultRoom, SavedRoomRecord } from '../src/types/room';

const record: SavedRoomRecord = {
  ...createDefaultRoom(), id: 'room-1', sourceSavedRoomId: 'room-1', schemaVersion: 1,
  createdAt: '2026-11-04T00:00:00.000Z', updatedAt: '2026-11-04T01:00:00.000Z',
  lastEstimatedBTU: 8700, lastRecommendedACId: 'SPL-09-INV', selectedACId: 'SPL-12-ECO',
};

test('restores a saved room with a known manual AC selection', () => {
  const result = restoreSavedRoom(record);
  assert.equal(result.missingSelectedAC, false);
  assert.equal(result.draft.selectedACId, 'SPL-12-ECO');
  assert.equal(result.draft.sourceSavedRoomId, 'room-1');
});

test('removes only an unavailable manual selection from the working copy', () => {
  const missing = { ...record, selectedACId: 'REMOVED-MODEL' };
  const result = restoreSavedRoom(missing);
  assert.equal(result.missingSelectedAC, true);
  assert.equal(result.draft.selectedACId, null);
  assert.equal(result.draft.lengthM, record.lengthM);
  assert.equal(result.draft.name, record.name);
  assert.equal(missing.selectedACId, 'REMOVED-MODEL');
});
