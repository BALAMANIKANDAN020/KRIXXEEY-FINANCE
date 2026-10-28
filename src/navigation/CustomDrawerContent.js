import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';

export const CustomDrawerContent = (props) => {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Drawer Header with Krishna-Radha Profile Branding */}
        <View style={styles.headerBox}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {currentUser?.avatar || (currentUser?.name?.substring(0, 2).toUpperCase() || 'BJ')}
            </Text>
          </View>

          <Text style={styles.userName} numberOfLines={1}>
            {currentUser?.name || 'User Name'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {currentUser?.email || 'user@example.com'}
          </Text>

          <View style={[
            styles.roleBadge,
            currentUser?.role === 'admin' ? styles.adminBadge : styles.customerBadge
          ]}>
            <Ionicons
              name={currentUser?.role === 'admin' ? 'shield-checkmark' : 'person'}
              size={12}
              color={currentUser?.role === 'admin' ? colors.goldDark : colors.primary}
            />
            <Text style={[
              styles.roleBadgeText,
              currentUser?.role === 'admin' ? { color: colors.goldDark } : { color: colors.primary }
            ]}>
              {currentUser?.role === 'admin' ? 'ADMINISTRATOR' : 'CUSTOMER'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Drawer Nav Items */}
        <View style={styles.navItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer Sign Out */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          <Text style={{ textTransform: 'lowercase', color: colors.gold, fontWeight: '800' }}>krixxeey</Text> FINANCE • Bala BJ
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingTop: 0,
  },
  headerBox: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2.5,
    borderColor: colors.gold,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FEF08A',
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
    gap: 4,
    borderWidth: 1,
  },
  customerBadge: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary,
  },
  adminBadge: {
    backgroundColor: colors.goldLight,
    borderColor: '#FDE68A',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  navItemsContainer: {
    paddingHorizontal: spacing.xs,
  },
  footerContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dangerLight,
    marginBottom: spacing.md,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  versionText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default CustomDrawerContent;
