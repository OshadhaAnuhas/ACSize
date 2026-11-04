import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { estimateCooling } from '../services/coolingEstimator'; import { recommendAC } from '../services/recommendationEngine'; import { readSavedRooms, repairSavedRooms, updateSavedRooms } from '../services/storageService';
import { createDefaultRoom, RoomDraft, RoomLabScenario, SavedRoomRecord } from '../types/room';
import { restoreSavedRoom } from '../services/savedRoomRecovery';
import { upsertSavedRoom } from '../services/savedRoomLifecycle';
type RoomContextValue = { draft: RoomDraft; setDraft: React.Dispatch<React.SetStateAction<RoomDraft>>; startNewRoom: () => void; scenario: RoomLabScenario | null; beginLab: (selected?: string) => void; setScenario: React.Dispatch<React.SetStateAction<RoomLabScenario | null>>; resetLab: () => void; applyLab: () => void; labChanged: boolean; savedRooms: SavedRoomRecord[]; storageStatus:'loading'|'ready'|'error'; storageWarning: string|null; retrySavedLoad:()=>Promise<void>; repairSaved:()=>Promise<void>; saveDraft:()=>Promise<void>; loadSaved:(record:SavedRoomRecord)=>boolean; deleteSaved:(id:string)=>Promise<void> };
const RoomContext = createContext<RoomContextValue | null>(null);
export function RoomProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<RoomDraft>(createDefaultRoom);
  const [scenario, setScenario] = useState<RoomLabScenario | null>(null); const [baseline, setBaseline] = useState<RoomLabScenario | null>(null);
  const [savedRooms,setSavedRooms]=useState<SavedRoomRecord[]>([]); const [storageWarning,setStorageWarning]=useState<string|null>(null);
  const [storageStatus,setStorageStatus]=useState<'loading'|'ready'|'error'>('loading');
  const loadAttempt=useRef(0);
  const mutationRevision=useRef(0);
  const draftSession=useRef(0);
  const saveInFlight = useRef<{session:number;promise:Promise<void>} | null>(null);
  const retrySavedLoad=async()=>{
    const attempt=++loadAttempt.current;
    const revision=mutationRevision.current;
    setStorageStatus('loading');
    try {
      const {records,hadInvalid}=await readSavedRooms();
      if(attempt!==loadAttempt.current) return;
      if(revision===mutationRevision.current){
        setSavedRooms(records);
        setStorageWarning(hadInvalid?'Some saved data is damaged. Saving is paused until you repair it in Saved Rooms.':null);
      }
      setStorageStatus('ready');
    } catch {
      if(attempt!==loadAttempt.current) return;
      setStorageStatus(revision===mutationRevision.current?'error':'ready');
    }
  };
  useEffect(()=>{void Promise.resolve().then(retrySavedLoad);},[]);
  const repairSaved=async()=>{const records=await repairSavedRooms();mutationRevision.current++;setSavedRooms(records);setStorageWarning(null);setStorageStatus('ready');};
  const beginLab = (selected?: string) => { const next = { ...draft, selectedACId: selected ?? draft.selectedACId, comfort: { temperatureC: 26, humidityPercent: 60, airflow: 'gentle' as const } }; setBaseline(next); setScenario(next); };
  const resetLab = () => baseline && setScenario({ ...baseline, comfort: { ...baseline.comfort } });
  const applyLab = () => scenario && setDraft(({ sourceSavedRoomId }) => { const { comfort: _comfort, ...room } = scenario; return { ...room, sourceSavedRoomId }; });
  const labChanged = Boolean(scenario && baseline && JSON.stringify(scenario) !== JSON.stringify(baseline));
  const saveDraft=()=>{
    const session=draftSession.current;
    if (saveInFlight.current?.session===session) return saveInFlight.current.promise;
    const snapshot = draft;
    const estimate=estimateCooling(snapshot);
    const rec=recommendAC(estimate.estimatedBTUh,snapshot.installationPreference,snapshot.selectionPriority).recommended;
    const now=new Date().toISOString();
    const id=snapshot.sourceSavedRoomId??`room-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const operation=updateSavedRooms(current=>upsertSavedRoom(current,snapshot,id,now,estimate.estimatedBTUh,rec?.id??null))
      .then(next=>{mutationRevision.current++;setSavedRooms(next);setStorageStatus('ready');setDraft(current=>draftSession.current===session?{...current,sourceSavedRoomId:id}:current);});
    saveInFlight.current={session,promise:operation};
    void operation.finally(()=>{if(saveInFlight.current?.promise===operation)saveInFlight.current=null;}).catch(()=>{});
    return operation;
  };
  const loadSaved=(record:SavedRoomRecord)=>{draftSession.current++;const {draft:restored,missingSelectedAC}=restoreSavedRoom(record);setDraft(restored);setScenario(null);setBaseline(null);return missingSelectedAC;};
  const deleteSaved=async(id:string)=>{const next=await updateSavedRooms(current=>current.filter(x=>x.id!==id));mutationRevision.current++;setSavedRooms(next);setStorageStatus('ready');};
  const value = { draft, setDraft, startNewRoom: () => { draftSession.current++;setDraft(createDefaultRoom()); setScenario(null); setBaseline(null); }, scenario, beginLab, setScenario, resetLab, applyLab, labChanged, savedRooms, storageStatus, storageWarning, retrySavedLoad, repairSaved, saveDraft, loadSaved, deleteSaved };
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
export function useRoom() { const value = useContext(RoomContext); if (!value) throw new Error('useRoom must be used inside RoomProvider'); return value; }
