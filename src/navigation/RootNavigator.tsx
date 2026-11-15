import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArtworkKind, ChoiceArtwork } from '../components/ChoiceArtwork';
import { useThemeColors } from '../theme';
import { useProfile } from '../context/ProfileContext';
import { ACLibraryScreen } from '../screens/ACLibraryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ACDetailsScreen } from '../screens/ACDetailsScreen';
import { RoomLabScreen } from '../screens/RoomLabScreen';
import { RecommendationScreen } from '../screens/RecommendationScreen';
import { RoomSetupScreen } from '../screens/RoomSetupScreen';
import { SavedRoomsScreen } from '../screens/SavedRoomsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MainTabParamList, RootStackParamList } from './routeTypes';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();
const icon = (kind: ArtworkKind) => {
  function TabIcon({ color }: { color: string }) { return <ChoiceArtwork kind={kind} width={24} height={24} color={color} />; }
  return TabIcon;
};
function MainTabs() {
  const colors = useThemeColors();
  return <Tabs.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.teal, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 64, paddingTop: 5, paddingBottom: 8, backgroundColor: colors.surface, borderTopColor: colors.line } }}><Tabs.Screen name="Saved" component={SavedRoomsScreen} options={{ title: 'Saved Rooms', tabBarIcon: icon('nav-saved') }} /><Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('nav-home') }} /><Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon('person') }} /></Tabs.Navigator>;
}
export function RootNavigator() {
  const colors = useThemeColors();
  const { dark } = useProfile();
  const baseTheme = dark ? DarkTheme : DefaultTheme;
  const appTheme = { ...baseTheme, colors: { ...baseTheme.colors, background: colors.background, primary: colors.teal, text: colors.navy, border: colors.line, card: colors.surface } };
  return <NavigationContainer theme={appTheme}><Stack.Navigator screenOptions={{ headerShadowVisible: false, headerTintColor: colors.navy, headerStyle: { backgroundColor: colors.background }, contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} /><Stack.Screen name="RoomSetup" component={RoomSetupScreen} options={{ title: 'Set Up Your Room' }} /><Stack.Screen name="Recommendation" component={RecommendationScreen} options={{ title: 'Your AC Solution' }} /><Stack.Screen name="RoomLab" component={RoomLabScreen} options={{ title: 'Room Lab' }} /><Stack.Screen name="ACLibrary" component={ACLibraryScreen} options={{ title: 'AC Library' }} /><Stack.Screen name="LibrarySelect" component={ACLibraryScreen} options={{ title: 'Select an AC' }} /><Stack.Screen name="ACDetails" component={ACDetailsScreen} options={{ title: 'AC Details' }} /></Stack.Navigator></NavigationContainer>;
}
