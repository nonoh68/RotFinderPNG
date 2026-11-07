import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function SampleDataBanner({ style }) {
  return (
    <View style={[styles.banner, style]}>
      <Text style={styles.text}>
        Sample data - routes, stops and fares shown here are made up for demonstration.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.gold,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  text: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
