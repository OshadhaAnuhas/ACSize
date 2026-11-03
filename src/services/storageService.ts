import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRoomRecord } from '../types/room';
const KEY='@acsize/savedRooms/v1'; let writeQueue=Promise.resolve();
const valid=(value:unknown):value is SavedRoomRecord=>Boolean(value&&typeof value==='object'&&typeof (value as SavedRoomRecord).id==='string'&&typeof (value as SavedRoomRecord).name==='string'&&(value as SavedRoomRecord).schemaVersion===1);
export async function readSavedRooms(){try{const raw=await AsyncStorage.getItem(KEY);if(!raw)return {records:[] as SavedRoomRecord[],hadInvalid:false};const parsed:unknown=JSON.parse(raw);if(!Array.isArray(parsed))return {records:[],hadInvalid:true};return {records:parsed.filter(valid),hadInvalid:parsed.some((x)=>!valid(x))};}catch{return {records:[] as SavedRoomRecord[],hadInvalid:true};}}
export function writeSavedRooms(records:SavedRoomRecord[]){writeQueue=writeQueue.then(()=>AsyncStorage.setItem(KEY,JSON.stringify(records)));return writeQueue;}
