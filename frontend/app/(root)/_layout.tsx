import { Redirect, Stack } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function RootLayout() {
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return null;
    if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

    return <Stack screenOptions={{ headerShown: false }} />;
}