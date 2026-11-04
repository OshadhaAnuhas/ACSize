import assert from 'node:assert/strict';
import test from 'node:test';

import { createSavedRoomStore } from '../src/services/savedRoomStore';
import { createDefaultRoom, SavedRoomRecord } from '../src/types/room';

function room(id: string): SavedRoomRecord {
  return {
    ...createDefaultRoom(), id, sourceSavedRoomId: id, schemaVersion: 1,
    createdAt: '2026-11-04T00:00:00.000Z', updatedAt: '2026-11-04T00:00:00.000Z',
    lastEstimatedBTU: 8700, lastRecommendedACId: null,
  };
}

test('overlapping save and delete operations use the latest stored list', async () => {
  let raw: string | null = JSON.stringify([room('first')]);
  const storage = {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => { await Promise.resolve(); raw = value; },
  };
  const store = createSavedRoomStore(storage, 'rooms');
  const add = store.update(current => [room('second'), ...current]);
  const remove = store.update(current => current.filter(item => item.id !== 'first'));
  await Promise.all([add, remove]);
  assert.deepEqual((await store.read()).records.map(item => item.id), ['second']);
});

test('a failed write leaves storage intact and does not block a later retry', async () => {
  let raw: string | null = JSON.stringify([room('first')]);
  let fail = true;
  const storage = {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => {
      if (fail) { fail = false; throw new Error('disk full'); }
      raw = value;
    },
  };
  const store = createSavedRoomStore(storage, 'rooms');
  await assert.rejects(store.update(current => [room('second'), ...current]), /disk full/);
  assert.deepEqual((await store.read()).records.map(item => item.id), ['first']);
  await store.update(current => [room('second'), ...current]);
  assert.deepEqual((await store.read()).records.map(item => item.id), ['second', 'first']);
});

test('invalid persisted data is never overwritten by an update', async () => {
  let raw: string | null = '{';
  const storage = {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => { raw = value; },
  };
  const store = createSavedRoomStore(storage, 'rooms');
  await assert.rejects(store.update(() => [room('new')]), /invalid/);
  assert.equal(raw, '{');
});

test('repair keeps valid rooms, removes damaged entries, then permits saves', async () => {
  let raw: string | null = JSON.stringify([room('first'), { id: 'broken' }]);
  const storage = {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => { raw = value; },
  };
  const store = createSavedRoomStore(storage, 'rooms');
  await assert.rejects(store.update(current => [room('second'), ...current]), /invalid/);
  assert.deepEqual((await store.repair()).map(item => item.id), ['first']);
  assert.equal((await store.read()).hadInvalid, false);
  await store.update(current => [room('second'), ...current]);
  assert.deepEqual((await store.read()).records.map(item => item.id), ['second', 'first']);
});

test('failed repair leaves the original data and can be retried', async () => {
  let raw: string | null = '{';
  let fail = true;
  const storage = {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => {
      if (fail) { fail = false; throw new Error('disk full'); }
      raw = value;
    },
  };
  const store = createSavedRoomStore(storage, 'rooms');
  await assert.rejects(store.repair(), /disk full/);
  assert.equal(raw, '{');
  assert.deepEqual(await store.repair(), []);
  assert.equal(raw, '[]');
});
