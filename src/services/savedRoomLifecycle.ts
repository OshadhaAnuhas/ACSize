import { RoomDraft, SavedRoomRecord } from '../types/room';

export function upsertSavedRoom(
  current: SavedRoomRecord[],
  draft: RoomDraft,
  id: string,
  updatedAt: string,
  estimatedBTU: number,
  recommendedACId: string | null,
): SavedRoomRecord[] {
  const existing = current.find(item => item.id === id);
  const record: SavedRoomRecord = {
    ...draft,
    id,
    sourceSavedRoomId: id,
    schemaVersion: 1,
    createdAt: existing?.createdAt ?? updatedAt,
    updatedAt,
    lastEstimatedBTU: estimatedBTU,
    lastRecommendedACId: recommendedACId,
  };
  return existing ? current.map(item => item.id === id ? record : item) : [record, ...current];
}
