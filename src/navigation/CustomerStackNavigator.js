import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDrawerNavigator } from './CustomerDrawerNavigator';
import { CategoryDetailsScreen } from '../screens/CategoryDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ReportsScreen } from '../screens/ReportsScreen';

const Stack = createNativeStackNavigator();

export const CustomerStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CustomerDrawerRoot" component={CustomerDrawerNavigator} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigator;
