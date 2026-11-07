import React, { useMemo } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAppData } from '../context/AppDataContext';
import { colors } from '../theme/colors';

function regionForStops(stops) {
  const lats = stops.map((stop) => stop.latitude);
  const lngs = stops.map((stop) => stop.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  return {
    latitude,
    longitude,
    latitudeDelta: Math.max(maxLat - minLat, 0.02) * 1.6,
    longitudeDelta: Math.max(maxLng - minLng, 0.02) * 1.6,
  };
}

export default function RouteDetailScreen({ route: navRoute }) {
  const { routeId } = navRoute.params;
  const { getRouteById } = useAppData();
  const route = getRouteById(routeId);

  const initialRegion = useMemo(() => regionForStops(route.stops), [route]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={initialRegion}
        >
          <Polyline
            coordinates={route.polyline}
            strokeColor={colors.red}
            strokeWidth={4}
          />
          {route.stops.map((stop) => (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.name}
              pinColor={colors.gold}
            />
          ))}
        </MapView>
      </View>

      <FlatList
        data={route.stops}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.infoCard}>
            <Text style={styles.routeName}>{route.name}</Text>
            <Text style={styles.routePath}>
              {route.start} → {route.end}
            </Text>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Fare</Text>
              <Text style={styles.fareValue}>{route.fareDisplay}</Text>
            </View>
            <Text style={styles.stopsLabel}>Stops in order</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.stopRow}>
            <View style={styles.stopDot}>
              <Text style={styles.stopDotText}>{index + 1}</Text>
            </View>
            <Text style={styles.stopName}>{item.name}</Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.footerNote}>
            Sample data - last updated {route.lastUpdated}. This route is not verified and is
            shown for demonstration only.
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrap: {
    height: 260,
  },
  map: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: colors.red,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  routePath: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  fareLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginRight: 8,
  },
  fareValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.black,
  },
  stopsLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 18,
  },
  listContent: {
    paddingBottom: 24,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  stopDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopDotText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  stopName: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 16,
    marginTop: 12,
    fontStyle: 'italic',
  },
});
