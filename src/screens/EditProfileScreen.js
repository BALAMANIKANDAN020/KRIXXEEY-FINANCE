import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { HeaderBar } from '../components/HeaderBar';
import { validateProfile } from '../utils/validation';

export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const validation = validateProfile({ name, email, phone });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      occupation: occupation.trim(),
    });

    setLoading(false);

    if (res.success) {
      // Personalized alert requirement
      Alert.alert(
        'Profile Updated',
        `Hi ${res.user.name}, your profile has been updated successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Update Failed', res.error || 'Failed to update profile.');
    }
  };

  const handleCancel = () => {
    // Discard unsaved changes
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title="Edit Profile"
        subtitle="Update your personal information"
        navigation={navigation}
        showBack={true}
        showMenu={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <CustomInput
              label="Full Name"
              placeholder="e.g. Bala BJ"
              iconName="person-outline"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name}
              required
            />

            <CustomInput
              label="Email Address"
              placeholder="e.g. balabj@gmail.com"
              iconName="mail-outline"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              error={errors.email}
              required
            />

            <CustomInput
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              iconName="call-outline"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <CustomInput
              label="Occupation"
              placeholder="e.g. Senior Software Engineer"
              iconName="briefcase-outline"
              value={occupation}
              onChangeText={setOccupation}
            />

            {/* Buttons Row */}
            <View style={styles.buttonsRow}>
              <CustomButton
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                size="large"
                style={{ flex: 1 }}
              />
              <View style={{ width: spacing.md }} />
              <CustomButton
                title="Save Changes"
                onPress={handleSave}
                loading={loading}
                variant="primary"
                size="large"
                iconName="checkmark"
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
});

export default EditProfileScreen;
