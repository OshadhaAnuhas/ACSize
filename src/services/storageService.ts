import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRoomRecord } from '../types/room';
import { createSavedRoomStore } from './savedRoomStore';

const KEY = '@acsize/savedRooms/v1';
const store = createSavedRoomStore(AsyncStorage, KEY);

export const readSavedRooms = () => store.read();

export function updateSavedRooms(change: (current: SavedRoomRecord[]) => SavedRoomRecord[]) {
  return store.update(change);
}

export function repairSavedRooms() {
  return store.repair();
}
