import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import SampleDataBanner from '../components/SampleDataBanner';
import { colors } from '../theme/colors';

export default function CitySelectScreen({ navigation }) {
  const { cities, selectCity } = useAppData();

  const handleSelect = async (city) => {
    if (city.status !== 'available') return;
    await selectCity(city.id);
    navigation.navigate('RouteList', { cityId: city.id, cityName: city.name });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RotFinder PNG</Text>
        <Text style={styles.subtitle}>Find your PMV bus route and fare</Text>
      </View>

      <SampleDataBanner style={styles.banner} />

      <Text style={styles.sectionLabel}>Choose a city</Text>

      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const available = item.status === 'available';
          return (
            <TouchableOpacity
              style={[styles.cityCard, !available && styles.cityCardDisabled]}
              onPress={() => handleSelect(item)}
              disabled={!available}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[styles.cityName, !available && styles.textDisabled]}>
                  {item.name}
                </Text>
                <Text style={[styles.cityProvince, !available && styles.textDisabled]}>
                  {item.province}
                </Text>
              </View>
              <Text style={[styles.statusTag, available ? styles.statusAvailable : styles.statusComingSoon]}>
                {available ? 'Available' : 'Coming soon'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.black,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },
  list: {
    paddingBottom: 24,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 6,
    minHeight: 72,
    borderLeftWidth: 5,
    borderLeftColor: colors.red,
  },
  cityCardDisabled: {
    borderLeftColor: colors.disabled,
    opacity: 0.7,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cityProvince: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  textDisabled: {
    color: colors.disabledText,
  },
  statusTag: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  statusAvailable: {
    backgroundColor: colors.gold,
    color: colors.black,
  },
  statusComingSoon: {
    backgroundColor: colors.border,
    color: colors.disabledText,
  },
});
