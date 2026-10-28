import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { AuthNavigator } from './AuthNavigator';
import { CustomerStackNavigator } from './CustomerStackNavigator';
import { AdminStackNavigator } from './AdminStackNavigator';

export const RootNavigator = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser === null ? (
        <AuthNavigator />
      ) : currentUser.role === 'admin' ? (
        <AdminStackNavigator />
      ) : (
        <CustomerStackNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootNavigator;
