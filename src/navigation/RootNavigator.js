import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CitySelectScreen from '../screens/CitySelectScreen';
import RouteListScreen from '../screens/RouteListScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import FindRouteScreen from '../screens/FindRouteScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CitySelect"
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.gold,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="CitySelect"
        component={CitySelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RouteList"
        component={RouteListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{ title: 'Route details' }}
      />
      <Stack.Screen
        name="FindRoute"
        component={FindRouteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
