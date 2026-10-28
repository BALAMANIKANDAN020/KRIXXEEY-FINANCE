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
import { useTransactions } from '../context/TransactionContext';
import { calculateCategoryBreakdown, calculateTotalExpenses } from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import { CategoryCard } from '../components/CategoryCard';
import { HeaderBar } from '../components/HeaderBar';
import { CATEGORIES } from '../data/demoData';

export const CategoriesScreen = ({ navigation }) => {
  const { transactions } = useTransactions();

  // Filter type: 'expense' (default) or 'income' or 'all'
  const [filterType, setFilterType] = useState('expense');

  // Total expenses for percentage calculation
  const totalExpenses = calculateTotalExpenses(transactions);

  // Map all defined categories with dynamic transaction data
  const categoryDataList = CATEGORIES.filter((c) => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  }).map((cat) => {
    const catTransactions = transactions.filter(
      (tx) => (tx.category || '').toLowerCase() === cat.name.toLowerCase()
    );

    const totalAmount = catTransactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const count = catTransactions.length;
    const baseTotal = cat.type === 'income' ? 100000 : totalExpenses;
    const percentage = baseTotal > 0 ? Math.round((totalAmount / baseTotal) * 100) : 0;

    return {
      ...cat,
      totalAmount,
      count,
      percentage,
      transactions: catTransactions,
    };
  });

  const handleSelectCategory = (cat) => {
    navigation.navigate('CategoryDetails', {
      categoryName: cat.name,
      categoryIcon: cat.icon,
      categoryColor: cat.color,
      categoryType: cat.type,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title="Categories"
        subtitle="Spending classification"
        navigation={navigation}
        showMenu={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Selector (Expenses vs Income vs All) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, filterType === 'expense' && styles.tabBtnActive]}
            onPress={() => setFilterType('expense')}
          >
            <Text
              style={[
                styles.tabBtnText,
                filterType === 'expense' && styles.tabBtnTextActive,
              ]}
            >
              Expense Categories
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, filterType === 'income' && styles.tabBtnActive]}
            onPress={() => setFilterType('income')}
          >
            <Text
              style={[
                styles.tabBtnText,
                filterType === 'income' && styles.tabBtnTextActive,
              ]}
            >
              Income Categories
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overview Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="pie-chart-outline" size={18} color={colors.primary} />
          <Text style={styles.infoBannerText}>
            Showing real-time spending calculated across{' '}
            <Text style={{ fontWeight: '700' }}>{transactions.length} total records</Text>
          </Text>
        </View>

        {/* 2-Column Category Grid */}
        <View style={styles.categoryGrid}>
          {categoryDataList.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onPress={() => handleSelectCategory(cat)}
            />
          ))}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 3,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  infoBannerText: {
    fontSize: 12,
    color: colors.primaryDark,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
});

export default CategoriesScreen;
