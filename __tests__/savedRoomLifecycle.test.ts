import assert from 'node:assert/strict';
import test from 'node:test';

import { createSavedRoomStore } from '../src/services/savedRoomStore';
import { upsertSavedRoom } from '../src/services/savedRoomLifecycle';
import { createDefaultRoom } from '../src/types/room';

test('create, edit, restart, and delete keep one stable saved-room identity', async () => {
  let raw: string | null = null;
  const storage = {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => { raw = value; },
  };
  const store = createSavedRoomStore(storage, 'rooms');
  const first = createDefaultRoom();
  const createdAt = '2026-11-04T00:00:00.000Z';
  const updatedAt = '2026-11-04T01:00:00.000Z';

  await store.update(current => upsertSavedRoom(current, first, 'room-1', createdAt, 8700, 'SPL-09-INV'));
  const edited = { ...first, sourceSavedRoomId: 'room-1', name: 'Edited Bedroom', occupants: 3 };
  assert.equal((await store.read()).records[0].name, first.name, 'editing the draft must not write storage');

  await store.update(current => upsertSavedRoom(current, edited, 'room-1', updatedAt, 9200, 'SPL-12-INV'));
  const restarted = createSavedRoomStore(storage, 'rooms');
  const records = (await restarted.read()).records;
  assert.equal(records.length, 1);
  assert.deepEqual(records[0], {
    ...edited, id: 'room-1', schemaVersion: 1, createdAt, updatedAt,
    lastEstimatedBTU: 9200, lastRecommendedACId: 'SPL-12-INV',
  });

  await restarted.update(current => current.filter(item => item.id !== 'room-1'));
  assert.deepEqual((await createSavedRoomStore(storage, 'rooms').read()).records, []);
});
