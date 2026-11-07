// Registry of every PNG city the app knows about.
//
// To add a new city once you have real route data:
//   1. Create src/data/cities/<cityId>.json (copy the shape of lae.json).
//   2. Import it below and add it to CITY_DATA.
//   3. Add an entry to CITIES with status: 'available'.
// No other file needs to change - screens and navigation read from this list.
import laeData from './cities/lae.json';

export const CITIES = [
  {
    id: 'lae',
    name: 'Lae',
    province: 'Morobe Province',
    status: 'available',
  },
  {
    id: 'port-moresby',
    name: 'Port Moresby',
    province: 'National Capital District',
    status: 'coming-soon',
  },
  {
    id: 'mount-hagen',
    name: 'Mount Hagen',
    province: 'Western Highlands Province',
    status: 'coming-soon',
  },
  {
    id: 'madang',
    name: 'Madang',
    province: 'Madang Province',
    status: 'coming-soon',
  },
];

// Bundled sample data, keyed by city id. Only cities marked 'available' above
// need an entry here.
export const CITY_DATA = {
  lae: laeData,
};
