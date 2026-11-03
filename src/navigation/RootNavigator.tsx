import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { colors } from '../theme';
import { ACLibraryScreen } from '../screens/ACLibraryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ACDetailsScreen, RecommendationScreen, RoomLabScreen, RoomSetupScreen } from '../screens/PlaceholderScreens';
import { SavedRoomsScreen } from '../screens/SavedRoomsScreen';
import { MainTabParamList, RootStackParamList } from './routeTypes';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();
const icon = (symbol: string) => ({ color }: { color: string }) => <Text style={{ color, fontSize: 19 }}>{symbol}</Text>;
function MainTabs() {
  return <Tabs.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.teal, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 64, paddingTop: 5, paddingBottom: 8 } }}><Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('⌂') }} /><Tabs.Screen name="Library" component={ACLibraryScreen} options={{ title: 'AC Library', tabBarIcon: icon('▦') }} /><Tabs.Screen name="Saved" component={SavedRoomsScreen} options={{ title: 'Saved Rooms', tabBarIcon: icon('♡') }} /></Tabs.Navigator>;
}
const appTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.teal, text: colors.navy, border: colors.line, card: colors.surface } };
export function RootNavigator() {
  return <NavigationContainer theme={appTheme}><Stack.Navigator screenOptions={{ headerShadowVisible: false, headerTintColor: colors.navy, headerStyle: { backgroundColor: colors.background }, contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} /><Stack.Screen name="RoomSetup" component={RoomSetupScreen} options={{ title: 'Set Up Your Room' }} /><Stack.Screen name="Recommendation" component={RecommendationScreen} options={{ title: 'Your AC Solution' }} /><Stack.Screen name="RoomLab" component={RoomLabScreen} options={{ title: 'Room Lab' }} /><Stack.Screen name="ACDetails" component={ACDetailsScreen} options={{ title: 'AC Details' }} /></Stack.Navigator></NavigationContainer>;
}
