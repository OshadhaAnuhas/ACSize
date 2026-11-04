import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRoomRecord } from '../types/room';
import { decodeSavedRooms } from './savedRoomCodec';

const KEY = '@acsize/savedRooms/v1';
let writeQueue = Promise.resolve();

export async function readSavedRooms() {
  try {
    return decodeSavedRooms(await AsyncStorage.getItem(KEY));
  } catch {
    return { records: [] as SavedRoomRecord[], hadInvalid: true };
  }
}

export function writeSavedRooms(records: SavedRoomRecord[]) {
  writeQueue = writeQueue.then(() => AsyncStorage.setItem(KEY, JSON.stringify(records)));
  return writeQueue;
}
