import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { formatSignedAmount } from '../utils/currency';
import { formatDisplayDate } from '../utils/dateHelpers';
import { CATEGORIES } from '../data/demoData';

export const TransactionCard = ({
  transaction,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const { title, amount, type, category, date, description } = transaction;
  const isIncome = type === 'income';

  // Find category icon and color
  const catObj = CATEGORIES.find((c) => c.name.toLowerCase() === (category || '').toLowerCase()) || {
    icon: isIncome ? 'trending-up' : 'pricetag',
    color: colors.primary,
  };

  const categoryColor = catObj.color || colors.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Category Icon Badge */}
      <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}18` }]}>
        <Ionicons name={catObj.icon || 'card'} size={22} color={categoryColor} />
      </View>

      {/* Main Info */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <Text
            style={[
              styles.amountText,
              isIncome ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {formatSignedAmount(amount, type)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.categoryPill}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>{category}</Text>
          </View>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
        </View>

        {description ? (
          <Text style={styles.descriptionText} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>

      {/* Action Buttons for Edit/Delete */}
      {showActions && (onEdit || onDelete) && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(transaction)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteAction]}
              onPress={() => onDelete(transaction)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeAmount: {
    color: colors.secondaryDark,
  },
  expenseAmount: {
    color: colors.danger,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  categoryPill: {
    paddingVertical: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dotSeparator: {
    marginHorizontal: spacing.xs + 2,
    color: colors.textMuted,
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  descriptionText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.xs,
    gap: 4,
  },
  actionButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  deleteAction: {
    backgroundColor: '#FEF2F2',
  },
});

export default TransactionCard;
