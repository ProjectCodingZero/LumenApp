import { Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false, // Oculta el header en todas las pantallas del Stack
        }}/>
    )
}