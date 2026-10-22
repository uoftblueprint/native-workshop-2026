import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#E8EDF2' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="level"
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: '#000000' },
          }}
        />
        <Stack.Screen name="receipt-scanner" />
        <Stack.Screen name="lights" />
      </Stack>
    </SafeAreaProvider>
  );
}
