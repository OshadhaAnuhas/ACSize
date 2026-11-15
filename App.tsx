import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RoomProvider } from './src/context/RoomContext';
import { ProfileProvider, useProfile } from './src/context/ProfileContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function AppContent() {
  const { dark } = useProfile();
  return <RoomProvider><StatusBar style={dark ? 'light' : 'dark'} /><RootNavigator /></RoomProvider>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
