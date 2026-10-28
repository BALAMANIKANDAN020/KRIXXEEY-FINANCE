import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateSavingsRate,
  calculateCategoryBreakdown,
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
} from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import { getTodayString, parseDateParts } from '../utils/dateHelpers';
import { TransactionCard } from '../components/TransactionCard';
import { EmptyState } from '../components/EmptyState';
import { HeaderBar } from '../components/HeaderBar';
import { CATEGORIES } from '../data/demoData';

export const AnalysisScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { transactions } = useTransactions();

  // Selected report filter
  const [reportType, setReportType] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  // Today reference
  const today = getTodayString();
  const todayParts = parseDateParts(today);

  // Filtered dataset according to active report filter
  const activeReport =
    reportType === 'daily'
      ? generateDailyReport(transactions, today)
      : reportType === 'weekly'
      ? generateWeeklyReport(transactions, today)
      : generateMonthlyReport(transactions, todayParts.year, todayParts.month);

  const reportTransactions = activeReport.transactions || [];

  // Totals calculated from actual transactions
  const totalIncome = activeReport.totalIncome;
  const totalExpenses = activeReport.totalExpenses;
  const netBalance = activeReport.netBalance;
  const savingsRate = calculateSavingsRate(reportTransactions);

  // Category breakdown
  const categoryBreakdown = calculateCategoryBreakdown(reportTransactions, 'expense');

  // Income vs Expense ratio calculation
  const totalFlow = totalIncome + totalExpenses;
  const incomePercent = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePercent = totalFlow > 0 ? Math.round((totalExpenses / totalFlow) * 100) : 50;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title="Financial Analysis"
        subtitle={currentUser?.role === 'admin' ? 'System Audit Overview' : 'Personal Insights'}
        navigation={navigation}
        showBack={navigation?.canGoBack?.()}
        showMenu={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Period Selector Pills */}
        <View style={styles.periodPillContainer}>
          <TouchableOpacity
            style={[styles.periodPill, reportType === 'daily' && styles.periodPillActive]}
            onPress={() => setReportType('daily')}
          >
            <Ionicons
              name="today"
              size={15}
              color={reportType === 'daily' ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.periodPillText,
                reportType === 'daily' && styles.periodPillTextActive,
              ]}
            >
              Daily Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodPill, reportType === 'weekly' && styles.periodPillActive]}
            onPress={() => setReportType('weekly')}
          >
            <Ionicons
              name="calendar"
              size={15}
              color={reportType === 'weekly' ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.periodPillText,
                reportType === 'weekly' && styles.periodPillTextActive,
              ]}
            >
              Weekly Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodPill, reportType === 'monthly' && styles.periodPillActive]}
            onPress={() => setReportType('monthly')}
          >
            <Ionicons
              name="pie-chart"
              size={15}
              color={reportType === 'monthly' ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.periodPillText,
                reportType === 'monthly' && styles.periodPillTextActive,
              ]}
            >
              Monthly Report
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Period Info Banner */}
        <View style={styles.periodBanner}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.periodBannerText}>
            Showing data for:{' '}
            <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
              {reportType === 'daily'
                ? `Today (${today})`
                : reportType === 'weekly'
                ? 'Past 7 Days Window'
                : 'October 2026 (Active Month)'}
            </Text>
          </Text>
        </View>

        {reportTransactions.length === 0 ? (
          <EmptyState
            icon="bar-chart-outline"
            title="No Records in this Period"
            message="No transactions match this specific time frame. Select another period or record a transaction."
            actionTitle="Add New Transaction"
            onAction={() => navigation.navigate('Transactions')}
          />
        ) : (
          <>
            {/* Core Financial Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, styles.balanceCard]}>
                <View style={styles.metricTop}>
                  <Text style={styles.metricLabel}>Net Balance</Text>
                  <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.balanceValue}>{formatCurrency(netBalance)}</Text>
                <Text style={styles.metricSub}>
                  {netBalance >= 0 ? 'Surplus / Profit' : 'Deficit'}
                </Text>
              </View>

              <View style={[styles.metricCard, styles.savingsCard]}>
                <View style={styles.metricTop}>
                  <Text style={styles.metricLabel}>Savings Rate</Text>
                  <Ionicons name="sparkles-outline" size={20} color={colors.purple} />
                </View>
                <Text style={styles.savingsValue}>{savingsRate}%</Text>
                <Text style={styles.metricSub}>Of total income</Text>
              </View>
            </View>

            {/* Income vs Expense Breakdown */}
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.cardHeading}>Income vs Expenses</Text>
                <Text style={styles.totalFlowText}>Total Flow: {formatCurrency(totalFlow)}</Text>
              </View>

              {/* Progress Ratio Bar */}
              <View style={styles.ratioBarContainer}>
                <View
                  style={[styles.ratioBarIncome, { flex: Math.max(0.05, incomePercent) }]}
                />
                <View
                  style={[styles.ratioBarExpense, { flex: Math.max(0.05, expensePercent) }]}
                />
              </View>

              <View style={styles.ratioLabelsRow}>
                <View style={styles.ratioLabelItem}>
                  <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
                  <Text style={styles.ratioText}>
                    Income: <Text style={styles.boldText}>{formatCurrency(totalIncome)}</Text> ({incomePercent}%)
                  </Text>
                </View>

                <View style={styles.ratioLabelItem}>
                  <View style={[styles.dot, { backgroundColor: colors.danger }]} />
                  <Text style={styles.ratioText}>
                    Expenses: <Text style={styles.boldText}>{formatCurrency(totalExpenses)}</Text> ({expensePercent}%)
                  </Text>
                </View>
              </View>
            </View>

            {/* Category-wise Spending */}
            <View style={styles.categorySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.cardHeading}>Category-Wise Spending</Text>
                <Text style={styles.sectionSubBadge}>{categoryBreakdown.length} Categories</Text>
              </View>

              {categoryBreakdown.map((item) => {
                const catObj = CATEGORIES.find(
                  (c) => c.name.toLowerCase() === item.category.toLowerCase()
                ) || { icon: 'folder-outline', color: colors.primary };

                return (
                  <View key={item.category} style={styles.categoryRowCard}>
                    <View
                      style={[
                        styles.catIconBox,
                        { backgroundColor: `${catObj.color || colors.primary}18` },
                      ]}
                    >
                      <Ionicons
                        name={catObj.icon || 'pricetag'}
                        size={20}
                        color={catObj.color || colors.primary}
                      />
                    </View>

                    <View style={styles.catDetailsCol}>
                      <View style={styles.catNameRow}>
                        <Text style={styles.catName}>{item.category}</Text>
                        <Text style={styles.catAmount}>{formatCurrency(item.totalAmount)}</Text>
                      </View>

                      <View style={styles.catProgressRow}>
                        <View style={styles.catProgressBarBg}>
                          <View
                            style={[
                              styles.catProgressBarFill,
                              {
                                width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                                backgroundColor: catObj.color || colors.primary,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.catPercentText}>{item.percentage}%</Text>
                      </View>

                      <Text style={styles.catCountText}>
                        {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Recent Period Transactions */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.cardHeading}>Period Transactions</Text>
              <Text style={styles.sectionSubBadge}>{reportTransactions.length} Total</Text>
            </View>

            <View style={styles.txListContainer}>
              {reportTransactions.slice(0, 5).map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  showActions={false}
                />
              ))}
            </View>
          </>
        )}
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
  periodPillContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs + 2,
  },
  periodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  periodPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  periodPillTextActive: {
    color: colors.surface,
  },
  periodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  periodBannerText: {
    fontSize: 12,
    color: colors.primaryDark,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  savingsCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.purple,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  savingsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.purple,
  },
  metricSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalFlowText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  ratioBarContainer: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: colors.surfaceSubtle,
    marginBottom: spacing.md,
  },
  ratioBarIncome: {
    backgroundColor: colors.secondary,
  },
  ratioBarExpense: {
    backgroundColor: colors.danger,
  },
  ratioLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratioLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratioText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categorySection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionSubBadge: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  categoryRowCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  catIconBox: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  catDetailsCol: {
    flex: 1,
  },
  catNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  catProgressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSubtle,
    overflow: 'hidden',
  },
  catProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  catPercentText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
  catCountText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  txListContainer: {
    paddingHorizontal: spacing.lg,
  },
});

export default AnalysisScreen;
