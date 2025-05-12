import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="testConnection" options={{ title: 'Check Connection'}} /> 
      <Stack.Screen name="server" options={{ title: 'Server'}} />
      <Stack.Screen name="client" options={{ title: 'Client'}} />
    </Stack>
  );
}
