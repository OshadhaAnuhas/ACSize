import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';

export type ArtworkKind =
  | 'sun-low' | 'sun-medium' | 'sun-high'
  | 'window-none' | 'window-small' | 'window-large'
  | 'roof-ceiling' | 'roof-concrete' | 'roof-none' | 'roof-floor'
  | 'ac-split' | 'ac-portable' | 'priority-cost' | 'priority-balanced' | 'priority-energy'
  | 'room-bedroom' | 'room-living' | 'room-office' | 'person';

type Props = { kind: ArtworkKind; width?: number; height?: number };

export function ChoiceArtwork({ kind, width = 76, height = 64 }: Props) {
  const id = useId().replace(/:/g, '');
  const sky = `sky${id}`;
  const gold = `gold${id}`;
  const teal = `teal${id}`;
  const steel = `steel${id}`;
  const warm = `warm${id}`;
  const isSun = kind.startsWith('sun-');
  const isWindow = kind.startsWith('window-');
  const isRoof = kind.startsWith('roof-');
  const isAC = kind.startsWith('ac-');
  const isPriority = kind.startsWith('priority-');
  const isRoom = kind.startsWith('room-');
  return <Svg width={width} height={height} viewBox={kind === 'person' ? '22 3 56 73' : '0 0 100 80'} accessible={false}>
    <Defs>
      <LinearGradient id={sky} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#DDF5FF" /><Stop offset="1" stopColor="#67B8E5" /></LinearGradient>
      <LinearGradient id={gold} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFF3A0" /><Stop offset="0.54" stopColor="#FFBD4A" /><Stop offset="1" stopColor="#E78521" /></LinearGradient>
      <LinearGradient id={teal} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#A7F3D0" /><Stop offset="0.5" stopColor="#28B6A5" /><Stop offset="1" stopColor="#0B6F73" /></LinearGradient>
      <LinearGradient id={steel} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFFFFF" /><Stop offset="0.55" stopColor="#DDEAF2" /><Stop offset="1" stopColor="#91A9BA" /></LinearGradient>
      <LinearGradient id={warm} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFE6BA" /><Stop offset="1" stopColor="#DC9B68" /></LinearGradient>
    </Defs>
    <Ellipse cx="50" cy="72" rx="39" ry="5" fill="#B8C9D5" opacity="0.34" />
    {isSun && <>
      <Path d="M12 58 L46 43 L88 58 L55 72 Z" fill="#E4F1F4" stroke="#ACCAD3" strokeWidth="1.5" />
      <Path d="M25 54 L25 39 L51 26 L76 40 L76 54 L51 66 Z" fill={`url(#${steel})`} stroke="#91B1BE" strokeWidth="1.6" />
      <Path d="M25 39 L51 25 L76 40 L51 54 Z" fill="#6FBEBF" stroke="#3C899A" strokeWidth="1.5" />
      <Path d="M51 54 L76 40 L76 54 L51 67 Z" fill="#B2D5DA" />
      <Rect x="34" y="46" width="10" height="10" rx="1" fill={`url(#${sky})`} stroke="#53829E" />
      <Circle cx={kind === 'sun-low' ? '76' : kind === 'sun-medium' ? '72' : '70'} cy="19" r={kind === 'sun-low' ? '10' : kind === 'sun-medium' ? '13' : '16'} fill={`url(#${gold})`} stroke="#E79A30" strokeWidth="1.5" />
      {kind !== 'sun-low' && [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const angle = a * Math.PI / 180; const x1 = 70 + Math.cos(angle) * 19; const y1 = 19 + Math.sin(angle) * 19; const x2 = 70 + Math.cos(angle) * 23; const y2 = 19 + Math.sin(angle) * 23; return <Line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F5AD3F" strokeWidth="2.5" strokeLinecap="round" />; })}
      {kind === 'sun-low' && <Path d="M54 22 C56 17 62 16 66 19 C70 13 80 14 83 21 C91 20 94 31 87 34 L56 34 C49 31 49 25 54 22 Z" fill="#F7FBFD" stroke="#B3C8D6" strokeWidth="1.4" />}
    </>}
    {isWindow && <>
      <Polygon points="13,61 50,43 87,61 50,75" fill="#D8E5EA" stroke="#A3BBC7" strokeWidth="1.5" />
      <Path d="M18 13 L50 5 L82 13 L82 61 L50 70 L18 60 Z" fill={`url(#${steel})`} stroke="#8DAAB8" strokeWidth="2" />
      <Path d="M18 13 L50 5 L82 13 L50 22 Z" fill="#D5E7EB" />
      {kind !== 'window-none' ? <>
        <Rect x={kind === 'window-small' ? 34 : 25} y={kind === 'window-small' ? 27 : 20} width={kind === 'window-small' ? 31 : 50} height={kind === 'window-small' ? 27 : 39} rx="2" fill={`url(#${sky})`} stroke="#466D86" strokeWidth="3" />
        <Line x1="50" y1={kind === 'window-small' ? 27 : 20} x2="50" y2={kind === 'window-small' ? 54 : 59} stroke="#F7FBFC" strokeWidth="3" />
        <Line x1={kind === 'window-small' ? 34 : 25} y1={kind === 'window-small' ? 41 : 39} x2={kind === 'window-small' ? 65 : 75} y2={kind === 'window-small' ? 41 : 39} stroke="#F7FBFC" strokeWidth="3" />
        <Path d="M31 28 L43 21 M55 36 L69 25" stroke="#FFFFFF" strokeWidth="3" opacity="0.55" />
      </> : <>
        <Path d="M50 22 L50 70" stroke="#A4BEC8" strokeWidth="2" />
        <Path d="M27 29 L42 25 M27 37 L42 33 M58 26 L73 30 M58 34 L73 38" stroke="#BED3DA" strokeWidth="2" />
      </>}
    </>}
    {isRoof && <>
      <Polygon points="12,55 50,38 88,55 50,74" fill="#D8E8E8" stroke="#A6BEC2" strokeWidth="1.6" />
      <Path d="M24 39 L50 26 L76 39 L76 58 L50 70 L24 57 Z" fill={`url(#${steel})`} stroke="#9CB7BD" strokeWidth="1.6" />
      <Path d="M50 50 L76 39 L76 58 L50 70 Z" fill="#A9CFD1" />
      <Path d="M24 39 L50 50 L76 39" fill="none" stroke="#8FAFB4" strokeWidth="1.4" />
      {kind === 'roof-none' ? <>
        <Path d="M20 28 L50 14 L80 28 L50 43 Z" fill="none" stroke="#E09A47" strokeWidth="3" strokeDasharray="5 3" />
        <Path d="M30 28 L50 19 L70 28" fill="none" stroke="#DBA85F" strokeWidth="2" />
      </> : <>
        <Path d="M17 27 L50 10 L83 27 L50 45 Z" fill={kind === 'roof-concrete' ? '#AEBBC6' : `url(#${warm})`} stroke={kind === 'roof-concrete' ? '#7F98A7' : '#C38458'} strokeWidth="2" />
        <Path d="M17 27 L50 45 L83 27 L83 33 L50 51 L17 33 Z" fill={kind === 'roof-concrete' ? '#8298A5' : '#AD6F51'} />
        {kind === 'roof-ceiling' && <><Path d="M25 23 L58 41 M34 18 L67 36 M43 13 L76 31" stroke="#BD7C58" strokeWidth="1.5" /><Path d="M24 45 L50 58 L76 45" fill="none" stroke="#E9BC84" strokeWidth="2" /></>}
        {kind === 'roof-floor' && <><Path d="M17 18 L50 2 L83 18 L50 35 Z" fill="#E7D4BF" stroke="#AD8A6E" strokeWidth="1.5" /><Path d="M17 18 L50 35 L83 18 L83 23 L50 40 L17 23 Z" fill="#B88D6C" /></>}
        {kind === 'roof-concrete' && <Path d="M35 17 L68 35 M51 10 L74 23" stroke="#D8E0E5" strokeWidth="1.3" />}
      </>}
    </>}
    {isAC && (kind === 'ac-split' ? <>
      <Path d="M10 19 Q10 14 16 14 L82 14 Q88 14 88 19 L88 47 Q88 53 82 53 L16 53 Q10 53 10 47 Z" fill={`url(#${steel})`} stroke="#7D9FB1" strokeWidth="2" />
      <Path d="M10 39 L88 39 L88 48 Q88 53 82 53 L16 53 Q10 53 10 48 Z" fill="#D6E7E9" />
      <Path d="M18 39 L79 39 M20 45 L76 45" stroke="#7296A6" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="77" cy="23" r="2.5" fill="#27BEA8" /><Path d="M17 22 L53 22" stroke="#FFFFFF" strokeWidth="3" opacity="0.85" />
      <Path d="M22 62 Q30 57 38 62 T54 62 M37 70 Q45 65 53 70 T69 70" fill="none" stroke="#71BFE1" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    </> : <>
      <Path d="M35 8 L65 8 Q71 8 71 15 L71 61 Q71 68 65 68 L35 68 Q29 68 29 61 L29 15 Q29 8 35 8 Z" fill={`url(#${steel})`} stroke="#7898A9" strokeWidth="2" />
      <Path d="M32 11 Q35 6 40 6 L61 6 Q67 6 69 11" fill="#4D7489" stroke="#3B5D70" strokeWidth="2" />
      <Rect x="36" y="19" width="28" height="14" rx="3" fill={`url(#${sky})`} stroke="#6B9AB0" />
      <Circle cx="50" cy="48" r="12" fill="#A7C9D3" stroke="#6B94A4" strokeWidth="2" /><Circle cx="50" cy="48" r="7" fill="#E7F4F5" />
      <Path d="M45 48 Q48 40 50 48 Q56 45 54 50 Q50 55 45 48 Z" fill="#83B5BF" />
      <Circle cx="38" cy="68" r="4" fill="#4B6474" /><Circle cx="62" cy="68" r="4" fill="#4B6474" />
      <Path d="M72 21 C84 21 89 30 85 40" fill="none" stroke="#7D9AA8" strokeWidth="4" strokeLinecap="round" />
    </>)}
    {isPriority && (kind === 'priority-cost' ? <>
      <Ellipse cx="44" cy="58" rx="27" ry="9" fill="#B97A32" /><Rect x="17" y="42" width="54" height="16" fill="#E8A941" /><Ellipse cx="44" cy="42" rx="27" ry="9" fill={`url(#${gold})`} stroke="#B9792D" strokeWidth="2" />
      <Path d="M17 50 Q44 66 71 50 M17 57 Q44 73 71 57" fill="none" stroke="#F9D478" strokeWidth="2" />
      <Ellipse cx="62" cy="31" rx="22" ry="8" fill="#C78634" /><Rect x="40" y="19" width="44" height="12" fill="#E7AD49" /><Ellipse cx="62" cy="19" rx="22" ry="8" fill={`url(#${gold})`} stroke="#B9792D" strokeWidth="2" />
      <Path d="M58 15 L64 15 L65 22 L58 22" fill="none" stroke="#B47429" strokeWidth="2" />
    </> : kind === 'priority-balanced' ? <>
      <Path d="M50 16 L50 61 M28 27 L72 27 M35 63 L65 63" stroke="#597C8D" strokeWidth="5" strokeLinecap="round" />
      <Circle cx="50" cy="14" r="6" fill={`url(#${gold})`} stroke="#C98B33" />
      <Path d="M28 27 L17 50 L39 50 Z M72 27 L61 50 L83 50 Z" fill="#B6DFD8" stroke="#5A9D9D" strokeWidth="1.5" />
      <Path d="M17 50 Q28 61 39 50 M61 50 Q72 61 83 50" fill={`url(#${teal})`} stroke="#417C82" strokeWidth="1.5" />
      <Circle cx="28" cy="42" r="6" fill={`url(#${gold})`} /><Path d="M66 43 L72 37 L78 43 L72 49 Z" fill={`url(#${sky})`} stroke="#5B9DB8" />
    </> : <>
      <Path d="M28 62 C18 42 34 18 72 14 C78 46 57 66 28 62 Z" fill={`url(#${teal})`} stroke="#238B83" strokeWidth="2" />
      <Path d="M29 61 Q51 39 69 27 M44 47 L43 32 M55 39 L68 43" fill="none" stroke="#C9F7D7" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M56 8 L44 33 L55 33 L42 68 L74 31 L60 31 L72 8 Z" fill={`url(#${gold})`} stroke="#D18D2C" strokeWidth="2" />
    </>)}
    {isRoom && <>
      <Path d="M12 56 L47 35 L88 55 L53 74 Z" fill="#D8E8E6" stroke="#A8C3C5" strokeWidth="1.5" />
      <Path d="M19 23 L47 8 L47 36 L19 52 Z" fill="#D2E9EC" stroke="#9FBFC8" strokeWidth="1.5" />
      <Path d="M47 8 L81 23 L81 53 L47 36 Z" fill="#EDF4F2" stroke="#9FBFC8" strokeWidth="1.5" />
      <Rect x="57" y="22" width="15" height="14" rx="1" fill={`url(#${sky})`} stroke="#6D98A7" strokeWidth="1.6" />
      {kind === 'room-bedroom' ? <><Path d="M27 48 L49 38 L72 48 L50 61 Z" fill="#F2FBFA" stroke="#769DA4" strokeWidth="1.5" /><Path d="M26 45 L49 34 L73 45 L50 56 Z" fill={`url(#${teal})`} stroke="#3B9996" strokeWidth="1.5" /><Path d="M30 43 L43 37 L51 41 L38 47 Z" fill="#FCFAF4" /></> : kind === 'room-living' ? <><Path d="M26 47 L48 36 L70 46 L50 58 Z" fill={`url(#${sky})`} stroke="#5F93AA" strokeWidth="1.5" /><Path d="M26 47 L26 38 L48 28 L48 36 M48 36 L48 28 L70 38 L70 46" fill="none" stroke="#436F84" strokeWidth="4" /><Ellipse cx="51" cy="62" rx="8" ry="3" fill="#B8895F" /></> : <><Path d="M26 43 L51 31 L75 42 L50 54 Z" fill={`url(#${warm})`} stroke="#A87A5A" strokeWidth="1.6" /><Path d="M30 46 L30 57 M69 46 L69 57" stroke="#8C6653" strokeWidth="3" /><Path d="M41 31 L55 25 L65 30 L51 37 Z" fill="#6D95A8" stroke="#426A7D" strokeWidth="1.5" /></>}
    </>}
    {kind === 'person' && <>
      <Path d="M34 67 L38 44 L62 44 L66 67 L58 70 L54 54 L52 70 L45 70 L44 54 L42 70 Z" fill="#167E85" stroke="#0B606C" strokeWidth="1.7" />
      <Path d="M37 31 Q50 26 63 31 L69 52 L61 56 L57 42 L60 54 L40 54 L43 42 L39 56 L31 52 Z" fill={`url(#${sky})`} stroke="#467FA0" strokeWidth="1.7" />
      <Circle cx="50" cy="22" r="13" fill={`url(#${warm})`} stroke="#C88762" strokeWidth="1.6" />
      <Path d="M37 20 Q37 7 51 7 Q65 8 63 21 Q58 17 55 13 Q47 23 37 20 Z" fill="#34465D" />
      <Circle cx="46" cy="23" r="1" fill="#34465D" /><Circle cx="54" cy="23" r="1" fill="#34465D" /><Path d="M47 28 Q50 31 53 28" fill="none" stroke="#9A5F4D" strokeWidth="1.3" />
    </>}
  </Svg>;
}
