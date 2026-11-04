import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { estimateCooling } from '../services/coolingEstimator'; import { recommendAC } from '../services/recommendationEngine'; import { readSavedRooms, writeSavedRooms } from '../services/storageService';
import { createDefaultRoom, RoomDraft, RoomLabScenario, SavedRoomRecord } from '../types/room';
import { restoreSavedRoom } from '../services/savedRoomRecovery';
type RoomContextValue = { draft: RoomDraft; setDraft: React.Dispatch<React.SetStateAction<RoomDraft>>; startNewRoom: () => void; scenario: RoomLabScenario | null; beginLab: (selected?: string) => void; setScenario: React.Dispatch<React.SetStateAction<RoomLabScenario | null>>; resetLab: () => void; applyLab: () => void; labChanged: boolean; savedRooms: SavedRoomRecord[]; storageWarning: string|null; saveDraft:()=>Promise<void>; loadSaved:(record:SavedRoomRecord)=>boolean; deleteSaved:(id:string)=>Promise<void> };
const RoomContext = createContext<RoomContextValue | null>(null);
export function RoomProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<RoomDraft>(createDefaultRoom);
  const [scenario, setScenario] = useState<RoomLabScenario | null>(null); const [baseline, setBaseline] = useState<RoomLabScenario | null>(null);
  const [savedRooms,setSavedRooms]=useState<SavedRoomRecord[]>([]); const [storageWarning,setStorageWarning]=useState<string|null>(null);
  useEffect(()=>{readSavedRooms().then(({records,hadInvalid})=>{setSavedRooms(records);if(hadInvalid)setStorageWarning('Some saved data was invalid and could not be loaded.');});},[]);
  const beginLab = (selected?: string) => { const next = { ...draft, selectedACId: selected ?? draft.selectedACId, comfort: { temperatureC: 26, humidityPercent: 60, airflow: 'gentle' as const } }; setBaseline(next); setScenario(next); };
  const resetLab = () => baseline && setScenario({ ...baseline, comfort: { ...baseline.comfort } });
  const applyLab = () => scenario && setDraft(({ sourceSavedRoomId }) => { const { comfort: _comfort, ...room } = scenario; return { ...room, sourceSavedRoomId }; });
  const labChanged = Boolean(scenario && baseline && JSON.stringify(scenario) !== JSON.stringify(baseline));
  const saveDraft=async()=>{const estimate=estimateCooling(draft);const rec=recommendAC(estimate.estimatedBTUh,draft.installationPreference,draft.selectionPriority).recommended;const now=new Date().toISOString();const existing=savedRooms.find(x=>x.id===draft.sourceSavedRoomId);const id=existing?.id??`room-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const record:SavedRoomRecord={...draft,sourceSavedRoomId:id,id,schemaVersion:1,createdAt:existing?.createdAt??now,updatedAt:now,lastEstimatedBTU:estimate.estimatedBTUh,lastRecommendedACId:rec?.id??null};const next=existing?savedRooms.map(x=>x.id===id?record:x):[record,...savedRooms];await writeSavedRooms(next);setSavedRooms(next);setDraft(x=>({...x,sourceSavedRoomId:id}));};
  const loadSaved=(record:SavedRoomRecord)=>{const {draft:restored,missingSelectedAC}=restoreSavedRoom(record);setDraft(restored);setScenario(null);setBaseline(null);return missingSelectedAC;};
  const deleteSaved=async(id:string)=>{const next=savedRooms.filter(x=>x.id!==id);await writeSavedRooms(next);setSavedRooms(next);};
  const value = { draft, setDraft, startNewRoom: () => { setDraft(createDefaultRoom()); setScenario(null); setBaseline(null); }, scenario, beginLab, setScenario, resetLab, applyLab, labChanged, savedRooms, storageWarning, saveDraft, loadSaved, deleteSaved };
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
export function useRoom() { const value = useContext(RoomContext); if (!value) throw new Error('useRoom must be used inside RoomProvider'); return value; }
