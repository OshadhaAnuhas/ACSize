import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton'; import { Screen } from '../components/Screen'; import { useRoom } from '../context/RoomContext';
import { ChoiceArtwork } from '../components/ChoiceArtwork';
import { RootStackParamList } from '../navigation/routeTypes'; import { estimateCooling } from '../services/coolingEstimator'; import { calculateEnergy } from '../services/energyCalculator'; import { recommendAC } from '../services/recommendationEngine'; import { colors, elevation, radius, spacing, typeScale } from '../theme';
export function RecommendationScreen({navigation}:NativeStackScreenProps<RootStackParamList,'Recommendation'>){
 const room=useRoom(),{draft}=room,estimate=estimateCooling(draft),result=recommendAC(estimate.estimatedBTUh,draft.installationPreference,draft.selectionPriority),profile=result.recommended,energy=profile?calculateEnergy(profile.illustrativeInputPowerKW,draft.dailyUsageHours,draft.electricityRateLKRPerKWh):null;
 const saveInFlight=useRef(false);
 const [saving,setSaving]=useState(false);
 const save=async()=>{
  if(saveInFlight.current) return;
  saveInFlight.current=true;
  setSaving(true);
  try{await room.saveDraft();Alert.alert('Saved','This room is stored on this device.');}
  catch{Alert.alert('Save failed','Your working values are safe. Please try again.');}
  finally{saveInFlight.current=false;setSaving(false);}
 };
 return <Screen><Text style={s.eyebrow}>ACSIZE / ROOM ANALYSIS</Text><Text style={s.title}>Your AC Solution</Text><Text style={s.sub}>{draft.name} · {estimate.areaM2.toFixed(1)} m²</Text>
 {profile?<><View style={s.hero}><View style={s.heroTop}><Text style={s.badge}>BEST MATCH FOR THIS ROOM</Text><View style={s.acIcon}><ChoiceArtwork kind={profile.category === 'portable' ? 'ac-portable' : 'ac-split'} width={90} height={72} /></View></View><Text style={s.ac}>{profile.name}</Text><Text style={s.capacity}>{profile.nominalCapacityBTU.toLocaleString()} BTU/h</Text><Text style={s.light}>{profile.technology} {profile.category} · {profile.purchaseCostTier}</Text><View style={s.heroRule} /><Text style={s.heroCaption}>Estimated room demand</Text><Text style={s.heroDemand}>{estimate.estimatedBTUh.toLocaleString()} BTU/h</Text></View><View style={s.card}><Text style={s.heading}>Cooling capacity match</Text><Text style={s.sub}>Recommended capacity compared with estimated demand</Text><View style={s.bar}><View style={[s.fill,{width:`${Math.min(100,estimate.estimatedBTUh/profile.comparisonCapacityBTU*100)}%`}]} /></View><Text style={s.good}>Meets Estimated Requirement</Text></View>{energy&&<View style={s.metrics}><View style={[s.metric,s.energyMetric]}><Text style={s.metricLabel}>MONTHLY ENERGY</Text><Text style={s.metricValue}>{energy.monthlyKWh.toFixed(1)}</Text><Text style={s.sub}>kWh / month</Text></View><View style={[s.metric,s.costMetric]}><Text style={s.metricLabel}>ADDITIONAL COST</Text><Text style={s.metricValue}>Rs.{energy.monthlyAdditionalEnergyCostLKR.toLocaleString(undefined,{maximumFractionDigits:0})}</Text><Text style={s.sub}>per month · illustrative</Text></View></View>}<View style={s.card}><Text style={s.heading}>Why this AC?</Text>{result.reasons.map(x=><Text key={x} style={s.reason}>✓  {x}</Text>)}</View><View style={s.card}><Text style={s.heading}>How was this calculated?</Text><Text style={s.sub}>Base {estimate.baseBTUh.toLocaleString()} + conditions {estimate.conditionAdjustmentBTUh.toFixed(0)} + occupants {estimate.extraPeopleBTUh} = {estimate.rawBTUh.toLocaleString()} raw, rounded to {estimate.estimatedBTUh.toLocaleString()} BTU/h.</Text></View></>:<View style={s.warning}><Text style={s.warningEyebrow}>CAPACITY CHECK</Text><Text style={s.heading}>No suitable match</Text><Text style={s.warningDemand}>{estimate.estimatedBTUh.toLocaleString()} BTU/h required</Text><Text style={s.sub}>{result.noMatchReason}</Text>{result.splitAlternatives.length>0&&<Text style={s.sub}>Suitable split options: {result.splitAlternatives.map(x=>x.name).join(', ')}.</Text>}</View>}
 <PrimaryButton label="Explore in Room Lab" onPress={()=>navigation.navigate('RoomLab',profile?{initialSelectedACId:profile.id}:undefined)}/>{result.alternatives.length+result.splitAlternatives.length>0&&<PrimaryButton label="Compare other ACs in Library" variant="outline" onPress={()=>navigation.navigate('MainTabs',{screen:'Library'})}/>}<PrimaryButton label={saving?'Saving…':draft.sourceSavedRoomId?'Update Saved Room':'Save Solution'} variant="outline" disabled={saving} onPress={save}/><PrimaryButton label="Edit Room" variant="outline" onPress={()=>navigation.navigate('RoomSetup',{edit:true})}/><Text style={s.disclaimer}>Approximate educational estimate only. Energy uses 30 days and a fixed 0.65 average-use multiplier, not an electrical power factor or official tariff.</Text></Screen>;
}
const s=StyleSheet.create({
 eyebrow:{color:colors.tealDark,fontSize:11,fontWeight:'800',letterSpacing:1},
 title:{fontSize:typeScale.title,fontWeight:'800',color:colors.navy},
 sub:{color:colors.muted,lineHeight:21},
 hero:{backgroundColor:colors.tealDark,borderRadius:radius.lg,padding:spacing.xxl,gap:9,...elevation.card},
 heroTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},acIcon:{width:90,height:72,borderRadius:16,backgroundColor:colors.paleBlue,alignItems:'center',justifyContent:'center',overflow:'hidden'},
 badge:{alignSelf:'flex-start',backgroundColor:colors.paleCyan,color:colors.tealDark,paddingHorizontal:10,paddingVertical:5,borderRadius:radius.pill,fontWeight:'800',fontSize:11},
 ac:{color:'#FFF',fontSize:27,fontWeight:'800'},capacity:{color:'#FFF',fontSize:21,fontWeight:'700'},light:{color:'#CCFBF1',textTransform:'capitalize'},
 heroRule:{height:1,backgroundColor:'#5EEAD4',marginVertical:8},heroCaption:{color:'#CCFBF1',fontSize:typeScale.caption},heroDemand:{color:'#FFF',fontSize:25,fontWeight:'800'},
 card:{backgroundColor:colors.surface,borderRadius:radius.md,padding:spacing.xl,borderWidth:1,borderColor:colors.line,gap:10,...elevation.card},
 heading:{color:colors.navy,fontWeight:'800',fontSize:typeScale.section},
 bar:{height:11,backgroundColor:colors.line,borderRadius:10,overflow:'hidden'},fill:{height:11,backgroundColor:colors.teal},good:{color:colors.success,fontWeight:'700'},
 metrics:{flexDirection:'row',flexWrap:'wrap',gap:10},metric:{flexGrow:1,flexBasis:140,padding:spacing.lg,borderRadius:radius.md,gap:3},energyMetric:{backgroundColor:colors.paleBlue},costMetric:{backgroundColor:colors.paleAmber},metricLabel:{color:colors.blueDark,fontSize:10,fontWeight:'800',letterSpacing:0.5},metricValue:{color:colors.navy,fontWeight:'800',fontSize:20},
 reason:{color:colors.slate,lineHeight:21},warning:{padding:spacing.xl,borderRadius:radius.md,backgroundColor:colors.paleAmber,gap:10,borderLeftWidth:4,borderLeftColor:colors.amber},warningEyebrow:{color:colors.navy,fontSize:typeScale.caption,fontWeight:'800',letterSpacing:1},warningDemand:{color:colors.navy,fontWeight:'800',fontSize:24},
 disclaimer:{color:colors.muted,fontSize:12,lineHeight:18,textAlign:'center'}
});
