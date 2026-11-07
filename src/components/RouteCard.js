import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export default function RouteCard({ route, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.name}>{route.name}</Text>
        <Text style={styles.path} numberOfLines={1}>
          {route.start} → {route.end}
        </Text>
      </View>
      <View style={styles.fareBadge}>
        <Text style={styles.fareText}>{route.fareDisplay}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    minHeight: 64,
    borderLeftWidth: 5,
    borderLeftColor: colors.red,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  path: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  fareBadge: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 64,
    alignItems: 'center',
  },
  fareText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.black,
  },
});
