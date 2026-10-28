import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'medium',      // 'small' | 'medium' | 'large'
  iconName,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const base = [styles.button, styles[`size_${size}`]];
    if (variant === 'primary') base.push(styles.variant_primary);
    if (variant === 'secondary') base.push(styles.variant_secondary);
    if (variant === 'outline') base.push(styles.variant_outline);
    if (variant === 'danger') base.push(styles.variant_danger);
    if (variant === 'ghost') base.push(styles.variant_ghost);
    if (disabled || loading) base.push(styles.disabled);
    return base;
  };

  const getTextStyles = () => {
    const base = [styles.text, styles[`textSize_${size}`]];
    if (variant === 'primary') base.push(styles.text_primary);
    if (variant === 'secondary') base.push(styles.text_secondary);
    if (variant === 'outline') base.push(styles.text_outline);
    if (variant === 'danger') base.push(styles.text_danger);
    if (variant === 'ghost') base.push(styles.text_ghost);
    if (disabled) base.push(styles.textDisabled);
    return base;
  };

  const getIconColor = () => {
    if (disabled) return colors.textMuted;
    if (variant === 'outline') return colors.primary;
    if (variant === 'ghost') return colors.textSecondary;
    if (variant === 'danger') return colors.surface;
    if (variant === 'secondary') return colors.surface;
    return colors.surface;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.surface} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName && iconPosition === 'left' && (
            <Ionicons name={iconName} size={size === 'small' ? 16 : 20} color={getIconColor()} style={styles.leftIcon} />
          )}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
          {iconName && iconPosition === 'right' && (
            <Ionicons name={iconName} size={size === 'small' ? 16 : 20} color={getIconColor()} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  size_small: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  size_medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  size_large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
  },
  variant_primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  variant_secondary: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_danger: {
    backgroundColor: colors.danger,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: colors.border,
  },
  text: {
    fontWeight: '600',
  },
  textSize_small: {
    fontSize: 12,
  },
  textSize_medium: {
    fontSize: 15,
  },
  textSize_large: {
    fontSize: 17,
  },
  text_primary: {
    color: colors.surface,
  },
  text_secondary: {
    color: colors.surface,
  },
  text_outline: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.surface,
  },
  text_ghost: {
    color: colors.textSecondary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});

export default CustomButton;
