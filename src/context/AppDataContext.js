import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { CITIES, CITY_DATA } from '../data/cities';
import { getCachedCityData, setCachedCityData } from '../utils/storage';

const AppDataContext = createContext(null);

function normalize(text) {
  return (text || '').trim().toLowerCase();
}

export function AppDataProvider({ children }) {
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [cityMeta, setCityMeta] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load a city's routes, preferring whatever was cached from the last
  // successful load so the screen still works with no internet connection.
  const selectCity = useCallback(async (cityId) => {
    setLoading(true);
    setSearchQuery('');
    try {
      let data = await getCachedCityData(cityId);
      if (!data) {
        data = CITY_DATA[cityId];
        if (data) {
          await setCachedCityData(cityId, data);
        }
      }
      setSelectedCityId(cityId);
      setCityMeta(data || null);
      setRoutes(data ? data.routes : []);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredRoutes = useMemo(() => {
    const query = normalize(searchQuery);
    if (!query) return routes;
    return routes.filter((route) => {
      const haystack = [
        route.name,
        route.start,
        route.end,
        ...route.stops.map((stop) => stop.name),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [routes, searchQuery]);

  const allPlaceNames = useMemo(() => {
    const names = new Set();
    routes.forEach((route) => {
      route.stops.forEach((stop) => names.add(stop.name));
    });
    return Array.from(names).sort();
  }, [routes]);

  const getRouteById = useCallback(
    (routeId) => routes.find((route) => route.id === routeId),
    [routes]
  );

  const findRoutesBetween = useCallback(
    (fromPlace, toPlace) => {
      const from = normalize(fromPlace);
      const to = normalize(toPlace);
      if (!from || !to) return [];
      const matchesPlace = (route, place) =>
        route.stops.some((stop) => normalize(stop.name).includes(place));
      return routes.filter(
        (route) => matchesPlace(route, from) && matchesPlace(route, to)
      );
    },
    [routes]
  );

  const value = {
    cities: CITIES,
    selectedCityId,
    cityMeta,
    routes,
    filteredRoutes,
    allPlaceNames,
    loading,
    searchQuery,
    setSearchQuery,
    selectCity,
    getRouteById,
    findRoutesBetween,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used inside an AppDataProvider');
  }
  return context;
}
