import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/currency';
import { calculateTotalExpenses } from '../utils/calculations';
import { TransactionCard } from '../components/TransactionCard';
import { EmptyState } from '../components/EmptyState';
import { HeaderBar } from '../components/HeaderBar';

export const CategoryDetailsScreen = ({ route, navigation }) => {
  const { categoryName, categoryIcon, categoryColor, categoryType } = route.params || {
    categoryName: 'Food',
    categoryIcon: 'fast-food',
    categoryColor: '#F97316',
    categoryType: 'expense',
  };

  const { transactions, confirmAndDelete } = useTransactions();

  // Filter transactions for this specific category
  const categoryTransactions = transactions.filter(
    (tx) => (tx.category || '').toLowerCase() === categoryName.toLowerCase()
  );

  // Totals calculated from actual transactions
  const totalAmount = categoryTransactions.reduce(
    (sum, tx) => sum + (Number(tx.amount) || 0),
    0
  );

  const totalAllExpenses = calculateTotalExpenses(transactions);
  const percentageOfTotal =
    totalAllExpenses > 0 ? Math.round((totalAmount / totalAllExpenses) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title={categoryName}
        subtitle="Category Ledger"
        navigation={navigation}
        showBack={true}
        showMenu={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Hero Summary Card */}
        <View style={[styles.heroCard, { borderColor: `${categoryColor || colors.primary}40` }]}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${categoryColor || colors.primary}20` },
            ]}
          >
            <Ionicons
              name={categoryIcon || 'folder'}
              size={36}
              color={categoryColor || colors.primary}
            />
          </View>

          <Text style={styles.heroCategoryTitle}>{categoryName}</Text>
          <Text style={styles.heroAmount}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.heroSubtitle}>
            {categoryTransactions.length}{' '}
            {categoryTransactions.length === 1 ? 'total record' : 'total records'}
          </Text>

          {/* Spending percentage & trend bar */}
          <View style={styles.trendContainer}>
            <View style={styles.trendRow}>
              <Text style={styles.trendLabel}>Share of Total Budget</Text>
              <Text style={styles.trendValue}>{percentageOfTotal}%</Text>
            </View>
            <View style={styles.trendBarBg}>
              <View
                style={[
                  styles.trendBarFill,
                  {
                    width: `${Math.min(100, Math.max(0, percentageOfTotal))}%`,
                    backgroundColor: categoryColor || colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.txSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recorded Transactions</Text>
            <Text style={styles.recordBadge}>{categoryTransactions.length} items</Text>
          </View>

          {categoryTransactions.length === 0 ? (
            <EmptyState
              icon="file-tray-outline"
              title={`No ${categoryName} Records`}
              message={`You have not logged any transactions under ${categoryName} yet.`}
              actionTitle="Add Transaction"
              onAction={() => navigation.navigate('Transactions')}
            />
          ) : (
            categoryTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onDelete={(item) => confirmAndDelete(item.id, item.title)}
                showActions={true}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroCategoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  trendContainer: {
    width: '100%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  trendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  trendValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trendBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  txSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recordBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
});

export default CategoryDetailsScreen;
