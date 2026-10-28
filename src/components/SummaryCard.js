import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';

export const MainBalanceCard = ({
  balance = 0,
  income = 0,
  expenses = 0,
  savingsRate = 0,
  userName = 'User',
}) => {
  return (
    <View style={styles.heroCard}>
      {/* Background Accent Rings - Radha Gold & Krishna Peacock */}
      <View style={styles.accentCircleTop} />
      <View style={styles.accentCircleBottom} />

      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.greetingText}>Welcome, {userName}</Text>
          <Text style={styles.heroSubLabel}>Total Net Balance</Text>
        </View>
        <View style={styles.savingsBadge}>
          <Ionicons name="sparkles" size={12} color="#FDE047" />
          <Text style={styles.savingsBadgeText}>{savingsRate}% saved</Text>
        </View>
      </View>

      <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>

      <View style={styles.divider} />

      {/* Income & Expense Breakdown Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statIconBadge, { backgroundColor: 'rgba(5, 150, 105, 0.25)' }]}>
            <Ionicons name="arrow-up" size={16} color="#34D399" />
          </View>
          <View>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={styles.statIncomeValue}>{formatCurrency(income)}</Text>
          </View>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIconBadge, { backgroundColor: 'rgba(225, 29, 72, 0.25)' }]}>
            <Ionicons name="arrow-down" size={16} color="#FB7185" />
          </View>
          <View>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={styles.statExpenseValue}>{formatCurrency(expenses)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const MetricMiniCard = ({
  title,
  amount,
  type = 'income', // 'income' | 'expense' | 'savings' | 'balance'
  subtitle,
  icon,
}) => {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  const isSavings = type === 'savings';

  const cardBorderColor = isIncome
    ? colors.secondary
    : isExpense
    ? colors.danger
    : isSavings
    ? colors.gold
    : colors.primary;

  const bgLight = isIncome
    ? colors.secondaryLight
    : isExpense
    ? colors.dangerLight
    : isSavings
    ? colors.goldLight
    : colors.primaryLight;

  return (
    <View style={[styles.miniCard, { borderLeftColor: cardBorderColor }]}>
      <View style={styles.miniCardTop}>
        <Text style={styles.miniCardTitle}>{title}</Text>
        <View style={[styles.miniIconWrapper, { backgroundColor: bgLight }]}>
          <Ionicons
            name={icon || (isIncome ? 'arrow-up-circle' : isExpense ? 'arrow-down-circle' : 'wallet-outline')}
            size={18}
            color={cardBorderColor}
          />
        </View>
      </View>
      <Text
        style={[
          styles.miniCardAmount,
          isIncome && { color: colors.secondaryDark },
          isExpense && { color: colors.dangerDark },
          isSavings && { color: colors.goldDark },
        ]}
      >
        {formatCurrency(amount)}
      </Text>
      {subtitle && <Text style={styles.miniCardSubtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#073B4C', // Midnight Krishna Peacock Navy
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    overflow: 'hidden',
    shadowColor: '#0B4F6C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)', // Radiant Radha Gold Border
  },
  accentCircleTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245, 158, 11, 0.18)', // Radha Gold Aura
  },
  accentCircleBottom: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(5, 150, 105, 0.18)', // Peacock Feather Emerald
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  greetingText: {
    fontSize: 14,
    color: '#BAE6FD', // Celestial Sky
    fontWeight: '600',
    marginBottom: 2,
  },
  heroSubLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(253, 224, 71, 0.4)',
  },
  savingsBadgeText: {
    color: '#FDE047',
    fontSize: 11,
    fontWeight: '800',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: spacing.xs,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statIncomeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#34D399',
    marginTop: 1,
  },
  statExpenseValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FB7185',
    marginTop: 1,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: spacing.sm,
  },
  miniCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  miniCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  miniCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  miniCardSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default MainBalanceCard;
