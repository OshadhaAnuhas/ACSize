import { SavedRoomRecord } from '../types/room';
import { decodeSavedRooms } from './savedRoomCodec';

type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function createSavedRoomStore(storage: StorageAdapter, key: string) {
  let queue: Promise<void> = Promise.resolve();

  return {
    read: async () => decodeSavedRooms(await storage.getItem(key)),
    repair: () => {
      const operation = queue.then(async () => {
        const { records } = decodeSavedRooms(await storage.getItem(key));
        await storage.setItem(key, JSON.stringify(records));
        return records;
      });
      queue = operation.then(() => undefined, () => undefined);
      return operation;
    },
    update: (change: (current: SavedRoomRecord[]) => SavedRoomRecord[]) => {
      const operation = queue.then(async () => {
        const { records, hadInvalid } = decodeSavedRooms(await storage.getItem(key));
        if (hadInvalid) throw new Error('Saved room data is invalid; refusing to overwrite it.');
        const next = change(records);
        await storage.setItem(key, JSON.stringify(next));
        return next;
      });
      queue = operation.then(() => undefined, () => undefined);
      return operation;
    },
  };
}
