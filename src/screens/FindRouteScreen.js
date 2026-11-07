import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import RouteCard from '../components/RouteCard';
import { colors } from '../theme/colors';

function PlaceField({ label, value, onChangeText, onPickSuggestion, suggestions, active, onFocus, onBlur }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="Type an area or stop name"
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCorrect={false}
      />
      {active && suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions.slice(0, 5).map((name) => (
            <TouchableOpacity
              key={name}
              style={styles.suggestionRow}
              onPress={() => onPickSuggestion(name)}
            >
              <Text style={styles.suggestionText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function FindRouteScreen({ navigation }) {
  const { allPlaceNames, findRoutesBetween } = useAppData();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromActive, setFromActive] = useState(false);
  const [toActive, setToActive] = useState(false);
  const [results, setResults] = useState(null);

  const fromSuggestions = useMemo(
    () => filterNames(allPlaceNames, from),
    [allPlaceNames, from]
  );
  const toSuggestions = useMemo(
    () => filterNames(allPlaceNames, to),
    [allPlaceNames, to]
  );

  function filterNames(names, query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return names;
    return names.filter((name) => name.toLowerCase().includes(normalized));
  }

  const handleSearch = () => {
    setResults(findRoutesBetween(from, to));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a route</Text>
        <Text style={styles.subtitle}>Pick where you are and where you want to go</Text>
      </View>

      <View style={styles.form}>
        <PlaceField
          label="From"
          value={from}
          onChangeText={(text) => {
            setFrom(text);
            setResults(null);
          }}
          onPickSuggestion={(name) => {
            setFrom(name);
            setFromActive(false);
          }}
          suggestions={fromSuggestions}
          active={fromActive}
          onFocus={() => {
            setFromActive(true);
            setToActive(false);
          }}
          onBlur={() => setTimeout(() => setFromActive(false), 150)}
        />

        <PlaceField
          label="To"
          value={to}
          onChangeText={(text) => {
            setTo(text);
            setResults(null);
          }}
          onPickSuggestion={(name) => {
            setTo(name);
            setToActive(false);
          }}
          suggestions={toSuggestions}
          active={toActive}
          onFocus={() => {
            setToActive(true);
            setFromActive(false);
          }}
          onBlur={() => setTimeout(() => setToActive(false), 150)}
        />

        <TouchableOpacity
          style={[styles.searchButton, (!from || !to) && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!from || !to}
        >
          <Text style={styles.searchButtonText}>Find Routes</Text>
        </TouchableOpacity>
      </View>

      {results !== null && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RouteCard
              route={item}
              onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
            />
          )}
          ListHeaderComponent={
            <Text style={styles.resultsLabel}>
              {results.length > 0
                ? `${results.length} route${results.length > 1 ? 's' : ''} found`
                : 'No routes found between these two places'}
            </Text>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gold,
  },
  subtitle: {
    fontSize: 13,
    color: colors.white,
    marginTop: 4,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
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
  suggestionBox: {
    backgroundColor: colors.card,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
  },
  suggestionText: {
    fontSize: 15,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 4,
  },
  searchButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  resultsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 4,
  },
  list: {
    paddingBottom: 24,
  },
});
