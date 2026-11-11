import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { ArtworkKind, ChoiceArtwork } from './ChoiceArtwork';
import { colors, radius } from '../theme';
import { Airflow, RoomDraft, RoomType } from '../types/room';

const roomImages = {
  bedroom: require('../../assets/room-bedroom.png'),
  living: require('../../assets/room-living.png'),
  office: require('../../assets/room-office.png'),
} as const;

type Props = {
  compact?: boolean;
  roomType?: RoomType;
  dimensions?: Pick<RoomDraft, 'lengthM' | 'widthM' | 'heightM' | 'preferredUnit'>;
  conditions?: Pick<RoomDraft, 'sunlight' | 'windowCategory' | 'roofConfiguration' | 'occupants'>;
  acLabel?: string;
  airflow?: Airflow;
};

function dimension(value: number, unit: RoomDraft['preferredUnit']) {
  if (!Number.isFinite(value)) return '—';
  return `${(unit === 'imperial' ? value / 0.3048 : value).toFixed(1)} ${unit === 'imperial' ? 'ft' : 'm'}`;
}

function Callout({ artwork, label, tint }: { artwork: ArtworkKind; label: string; tint: 'blue' | 'amber' | 'teal' }) {
  return <View style={[styles.callout, tint === 'blue' ? styles.blueCallout : tint === 'amber' ? styles.amberCallout : styles.tealCallout]}>
    <ChoiceArtwork kind={artwork} width={45} height={39} />
    <Text numberOfLines={2} style={styles.calloutText}>{label}</Text>
  </View>;
}

export function RoomIllustration({ compact = false, roomType = 'bedroom', dimensions, conditions, acLabel, airflow }: Props) {
  const [opacity] = useState(() => new Animated.Value(1));
  const previousRoom = useRef(roomType);
  useEffect(() => {
    if (previousRoom.current === roomType) return;
    previousRoom.current = roomType;
    opacity.setValue(0);
    const animation = Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [opacity, roomType]);

  const roofLabels = { floorAbove: 'Floor above', withCeiling: 'Ceiling', concreteSlab: 'Concrete', noCeiling: 'No ceiling' };
  return <View accessible={false} style={styles.wrapper}>
    <View style={[styles.frame, compact && styles.compact]}>
      <View style={[styles.artStage, compact && styles.compactArt]}>
        <Animated.Image source={roomImages[roomType]} resizeMode="contain" style={[styles.image, { opacity }]} accessibilityIgnoresInvertColors />
        {dimensions && <>
          <Svg width="100%" height="100%" viewBox="0 0 232 155" style={styles.guides}>
            <Line x1="13" y1="46" x2="13" y2="119" stroke={colors.blue} strokeWidth="1.8" strokeDasharray="4 3" />
            <Line x1="9" y1="46" x2="17" y2="46" stroke={colors.blue} strokeWidth="2" />
            <Line x1="9" y1="119" x2="17" y2="119" stroke={colors.blue} strokeWidth="2" />
            <Line x1="17" y1="119" x2="116" y2="149" stroke={colors.blue} strokeWidth="1.8" strokeDasharray="4 3" />
            <Line x1="116" y1="149" x2="215" y2="119" stroke={colors.blue} strokeWidth="1.8" strokeDasharray="4 3" />
          </Svg>
          <View style={[styles.measure, styles.height]}><Text style={styles.measureText}>H {dimension(dimensions.heightM, dimensions.preferredUnit)}</Text></View>
          <View style={[styles.measure, styles.length]}><Text style={styles.measureText}>L {dimension(dimensions.lengthM, dimensions.preferredUnit)}</Text></View>
          <View style={[styles.measure, styles.width]}><Text style={styles.measureText}>W {dimension(dimensions.widthM, dimensions.preferredUnit)}</Text></View>
        </>}
      </View>
      {conditions && <>
        <View style={[styles.side, styles.leftSide]}>
          <Callout artwork={`sun-${conditions.sunlight}`} label={`${conditions.sunlight} sun`} tint="amber" />
          <Callout artwork={`window-${conditions.windowCategory}`} label={`${conditions.windowCategory} window`} tint="blue" />
        </View>
        <View style={[styles.side, styles.rightSide]}>
          <Callout artwork={{ floorAbove: 'roof-floor', withCeiling: 'roof-ceiling', concreteSlab: 'roof-concrete', noCeiling: 'roof-none' }[conditions.roofConfiguration] as ArtworkKind} label={roofLabels[conditions.roofConfiguration]} tint="teal" />
          <Callout artwork="person" label={`${conditions.occupants} ${conditions.occupants === 1 ? 'person' : 'people'}`} tint="blue" />
        </View>
      </>}
    </View>
    {(acLabel || airflow) && <View style={styles.statusRow}>
      {acLabel && <Text numberOfLines={1} style={[styles.status, styles.acStatus]}>AC: {acLabel}</Text>}
      {airflow && <View style={[styles.status, styles.airflowStatus]}><Text style={styles.airflowText}>{airflow === 'still' ? 'No airflow' : airflow === 'gentle' ? 'Gentle airflow' : 'Strong airflow'}</Text><View style={styles.airflowBars}>{[1, 2, 3].map(level => <View key={level} style={[styles.airflowBar, level <= (airflow === 'still' ? 0 : airflow === 'gentle' ? 2 : 3) && styles.airflowBarOn]} />)}</View></View>}
    </View>}
  </View>;
}

const styles = StyleSheet.create({
  wrapper: { gap: 5 },
  frame: { height: 184, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  compact: { height: 165 },
  artStage: { width: 276, height: 184 },
  compactArt: { width: 232, height: 155 },
  image: { width: '100%', height: '100%' },
  guides: { position: 'absolute', top: 0, left: 0 },
  measure: { position: 'absolute', borderColor: colors.blue, borderWidth: 1, borderRadius: radius.sm, backgroundColor: '#FFFFFFF0', paddingHorizontal: 4, paddingVertical: 2 },
  measureText: { color: colors.blueDark, fontSize: 9, fontWeight: '800' },
  height: { left: 18, top: '27%' }, length: { left: '14%', bottom: 0 }, width: { right: '7%', bottom: 0 },
  side: { position: 'absolute', top: 3, bottom: 3, justifyContent: 'space-between', width: 62 },
  leftSide: { left: 0 }, rightSide: { right: 0 },
  callout: { minHeight: 56, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', padding: 2 },
  blueCallout: { backgroundColor: '#EFF6FFED', borderColor: '#BFDBFE' },
  amberCallout: { backgroundColor: '#FFFBEBED', borderColor: '#FDE68A' },
  tealCallout: { backgroundColor: '#E5F7F8ED', borderColor: '#99F6E4' },
  calloutText: { color: colors.navy, textAlign: 'center', fontSize: 8, fontWeight: '800', textTransform: 'capitalize' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  status: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: colors.paleBlue },
  acStatus: { color: colors.blueDark, fontSize: 11, fontWeight: '800', maxWidth: '60%' },
  airflowStatus: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: colors.paleCyan },
  airflowText: { color: colors.tealDark, fontSize: 11, fontWeight: '800' },
  airflowBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  airflowBar: { width: 3, height: 5, borderRadius: 2, backgroundColor: colors.line },
  airflowBarOn: { height: 8, backgroundColor: colors.blue },
});
