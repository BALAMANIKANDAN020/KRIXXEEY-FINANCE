import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const KrishnanRadheyLogo = ({ size = 96, showText = true }) => {
  const outerSize = size;
  const innerSize = Math.round(size * 0.84);
  const coreSize = Math.round(size * 0.68);
  const fontSize = Math.round(size * 0.32);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.outerHalo,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
          },
        ]}
      >
        {/* Divine Radiant Gold Outer Border */}
        <View
          style={[
            styles.goldRing,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        >
          {/* Deep Peacock Blue Radiant Core */}
          <View
            style={[
              styles.peacockCore,
              {
                width: coreSize,
                height: coreSize,
                borderRadius: coreSize / 2,
              },
            ]}
          >
            {/* Peacock Feather Crest at Top */}
            <View style={styles.featherAccent}>
              <MaterialCommunityIcons name="feather" size={size * 0.22} color="#38BDF8" />
            </View>

            {/* Stylish Royal Calligraphy BJ Monogram */}
            <View style={styles.monogramContainer}>
              <View style={styles.monogramRow}>
                <Text style={[styles.stylishLetterB, { fontSize }]}>B</Text>
                <Text style={[styles.stylishLetterJ, { fontSize }]}>J</Text>
              </View>
            </View>

            {/* Golden Bansuri / Flute Base */}
            <View style={styles.fluteBar}>
              <View style={styles.fluteLine} />
              <View style={styles.fluteHole} />
              <View style={styles.fluteHole} />
              <View style={styles.fluteHole} />
            </View>
          </View>
        </View>

        {/* Golden Sparkle Crown Badge */}
        <View style={styles.crownBadge}>
          <Ionicons name="sparkles" size={13} color="#FDE047" />
        </View>

        {/* Peacock Feather Eye Emblem */}
        <View style={styles.peacockBadge}>
          <View style={styles.peacockEyeOuter}>
            <View style={styles.peacockEyeInner} />
          </View>
        </View>
      </View>

      {showText && (
        <View style={styles.logoLabelBox}>
          <Text style={styles.radheyKrishnaText}>RADHEY KRISHNA</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerHalo: {
    backgroundColor: '#073B4C', // Midnight Krishna Navy
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#F59E0B', // Radiant Radha Gold
    shadowColor: '#0B4F6C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
    position: 'relative',
  },
  goldRing: {
    backgroundColor: '#0A2540',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  peacockCore: {
    backgroundColor: '#0B4F6C', // Deep Peacock Blue
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    overflow: 'hidden',
    position: 'relative',
  },
  featherAccent: {
    position: 'absolute',
    top: 2,
    opacity: 0.95,
    transform: [{ rotate: '25deg' }],
  },
  monogramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  monogramRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  stylishLetterB: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontStyle: 'italic',
    fontWeight: '900',
    color: '#FDE047', // Radiant Pitambari Gold
    letterSpacing: -1,
    textShadowColor: 'rgba(245, 158, 11, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  stylishLetterJ: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontStyle: 'italic',
    fontWeight: '900',
    color: '#FFFFFF', // Divine Pearl White
    marginLeft: 0,
    textShadowColor: 'rgba(56, 189, 248, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  fluteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  fluteLine: {
    width: 24,
    height: 2.5,
    borderRadius: 1,
    backgroundColor: '#FDE047',
  },
  fluteHole: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#0B4F6C',
  },
  crownBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: '#073B4C',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  peacockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0284C7',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE047',
  },
  peacockEyeOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peacockEyeInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#073B4C',
  },
  logoLabelBox: {
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  radheyKrishnaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 1.2,
  },
});

export default KrishnanRadheyLogo;
