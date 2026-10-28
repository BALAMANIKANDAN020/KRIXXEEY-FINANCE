import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDrawerNavigator } from './AdminDrawerNavigator';
import { ReportsScreen } from '../screens/ReportsScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';

const Stack = createNativeStackNavigator();

export const AdminStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="AdminDrawerRoot" component={AdminDrawerNavigator} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
    </Stack.Navigator>
  );
};

export default AdminStackNavigator;
