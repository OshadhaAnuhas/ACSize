import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { createDefaultRoom, RoomDraft } from '../types/room';
type RoomContextValue = { draft: RoomDraft; setDraft: React.Dispatch<React.SetStateAction<RoomDraft>>; startNewRoom: () => void };
const RoomContext = createContext<RoomContextValue | null>(null);
export function RoomProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<RoomDraft>(createDefaultRoom);
  const value = useMemo(() => ({ draft, setDraft, startNewRoom: () => setDraft(createDefaultRoom()) }), [draft]);
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
export function useRoom() { const value = useContext(RoomContext); if (!value) throw new Error('useRoom must be used inside RoomProvider'); return value; }
