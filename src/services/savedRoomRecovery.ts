import { findACProfile } from '../data/acProfiles';
import { RoomDraft, SavedRoomRecord } from '../types/room';

export function restoreSavedRoom(record: SavedRoomRecord): { draft: RoomDraft; missingSelectedAC: boolean } {
  const { id, schemaVersion: _schemaVersion, createdAt: _createdAt, updatedAt: _updatedAt,
    lastEstimatedBTU: _lastEstimatedBTU, lastRecommendedACId: _lastRecommendedACId,
    ...storedInputs } = record;
  const missingSelectedAC = storedInputs.selectedACId !== null && !findACProfile(storedInputs.selectedACId);
  return {
    draft: { ...storedInputs, sourceSavedRoomId: id, selectedACId: missingSelectedAC ? null : storedInputs.selectedACId },
    missingSelectedAC,
  };
}
