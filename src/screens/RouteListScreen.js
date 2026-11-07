import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import RouteCard from '../components/RouteCard';
import SampleDataBanner from '../components/SampleDataBanner';
import { colors } from '../theme/colors';

export default function RouteListScreen({ navigation, route }) {
  const { cityName } = route.params;
  const { filteredRoutes, searchQuery, setSearchQuery, loading } = useAppData();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{cityName} PMV Routes</Text>
        <TouchableOpacity
          style={styles.findButton}
          onPress={() => navigation.navigate('FindRoute')}
        >
          <Text style={styles.findButtonText}>Find a route</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by route, stop or area"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
      </View>

      <SampleDataBanner style={styles.banner} />

      {loading ? (
        <Text style={styles.emptyText}>Loading routes...</Text>
      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RouteCard
              route={item}
              onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No routes match your search.</Text>
          }
        />
      )}
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
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gold,
    flex: 1,
    marginRight: 12,
  },
  findButton: {
    backgroundColor: colors.red,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  findButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 15,
  },
});
