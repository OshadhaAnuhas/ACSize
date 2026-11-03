import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RoomProvider } from './src/context/RoomContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RoomProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </RoomProvider>
    </SafeAreaProvider>
  );
}
