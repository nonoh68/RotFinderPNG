# RotFinder PNG

A public transport guide for PMV (Public Motor Vehicle) buses in Papua New Guinea.
First release covers **Lae, Morobe Province**. Built with React Native + Expo so it
runs in Expo Go on everyday Android phones.

> **All route, stop and fare data in this app is SAMPLE / DUMMY data.**
> Nothing here has been verified against real PMV operators. Do not use it for
> real travel planning. See [Replacing the dummy data](#replacing-the-dummy-data-with-real-data)
> below for how to swap it out.

## Features

- City selection screen (Lae available now, other PNG cities marked "Coming soon")
- Route list with search by route name, stop or area
- Route detail screen with a Google Map: the route drawn as a line, markers for
  every stop, and the fare shown clearly
- Ordered stop list for each route
- "Find a route" screen: pick a start and a destination, see every route that
  connects them
- Routes and fares are cached on-device after the first load, so the app keeps
  working with no internet connection

## Tech stack

- React Native with **Expo** (SDK 58)
- `react-native-maps` for the Google Map view
- Local JSON files for route/stop/fare data (one file per city)
- React hooks + Context for state (no Redux or other state library)
- `@react-native-async-storage/async-storage` for offline caching

## Project structure

```
RotFinder PNG/
├── App.js                      # App entry: providers + navigation
├── app.json                    # Expo config (name, icons, Google Maps keys)
├── src/
│   ├── context/
│   │   └── AppDataContext.js   # Loads city data, search, "find a route" logic
│   ├── data/
│   │   ├── cities.js           # Registry of every city (available / coming soon)
│   │   └── cities/
│   │       └── lae.json        # Dummy Lae routes, stops, fares, coordinates
│   ├── components/
│   │   ├── RouteCard.js
│   │   └── SampleDataBanner.js
│   ├── screens/
│   │   ├── CitySelectScreen.js
│   │   ├── RouteListScreen.js
│   │   ├── RouteDetailScreen.js
│   │   └── FindRouteScreen.js
│   ├── navigation/
│   │   └── RootNavigator.js
│   ├── theme/
│   │   └── colors.js           # PNG-inspired red / black / gold palette
│   └── utils/
│       └── storage.js          # AsyncStorage read/write helpers
└── README.md
```

## Setup instructions

### 1. Install prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- The **Expo Go** app on your Android or iOS phone (from the Play Store / App Store)
- A free [Expo account](https://expo.dev/) is not required to run locally, but is
  handy for sharing a build later

### 2. Install project dependencies

From inside the `RotFinder PNG` folder:

```bash
npm install
```

### 3. Get a Google Maps API key (for the map screen)

Android's Google Maps SDK needs a key even for local testing. Without one the
map on the Route Detail screen may appear blank or grey.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or pick an existing one).
3. Go to **APIs & Services → Library** and enable:
   - **Maps SDK for Android**
   - **Maps SDK for iOS** (only if you'll test on iOS with the Google provider)
4. Go to **APIs & Services → Credentials → Create Credentials → API key**.
5. Copy the key.
6. (Recommended) Click **Restrict key** and limit it to the Maps SDKs you enabled,
   and to your app's package name (`pg.rotfinder.png`) once you build a standalone app.
7. Open `app.json` in this project and paste your key in **both** places marked
   `YOUR_GOOGLE_MAPS_API_KEY_HERE`:

```jsonc
"android": {
  "config": { "googleMaps": { "apiKey": "YOUR_KEY_HERE" } }
},
"ios": {
  "config": { "googleMapsApiKey": "YOUR_KEY_HERE" }
}
```

8. Restart the dev server with the cache cleared (see below) after saving the key.

> iOS in Expo Go uses Apple Maps by default (no key needed) unless you force the
> Google provider. The code in `RouteDetailScreen.js` only forces Google Maps on
> Android, so iOS testers don't need a key to see a map.

### 4. Run the app in Expo Go

```bash
npx expo start -c
```

- `-c` clears the Metro bundler cache - always use it the first time you run the
  app after changing `app.json` (e.g. after adding your Maps API key).
- Scan the QR code shown in the terminal with the Expo Go app (Android: in-app
  scanner; iOS: the device camera).
- Or press `a` in the terminal to open on a connected Android emulator, or `i`
  for an iOS simulator (Mac only).

## Replacing the dummy data with real data

All sample data lives in **one file per city** under `src/data/cities/`, e.g.
`src/data/cities/lae.json`. To put in real data:

1. Open `src/data/cities/lae.json`.
2. For each route, update:
   - `start`, `end`, `fare`, `fareDisplay` (e.g. `"K2.00"`)
   - `stops`: an ordered list of `{ id, name, latitude, longitude }`
   - `polyline`: the `{ latitude, longitude }` points the line should follow
     (can be the same points as `stops`, or more points for a smoother road path)
   - `lastUpdated`: today's date
3. Once you're confident the data is accurate, you can remove `"isDummyData"`
   and the `"disclaimer"` field from the file, and remove `<SampleDataBanner />`
   from the screens that use it.
4. Coordinates can be found by right-clicking a location in
   [Google Maps](https://maps.google.com) and copying the lat/lng shown.

## Adding a new city (e.g. Port Moresby)

1. Create `src/data/cities/port-moresby.json` with the same shape as `lae.json`
   (see the Lae file as a template — `city`, `cityId`, `mapInitialRegion`, and a
   `routes` array).
2. Open `src/data/cities.js`:
   - Import the new file: `import portMoresbyData from './cities/port-moresby.json';`
   - Add it to `CITY_DATA`: `'port-moresby': portMoresbyData`
   - Change that city's entry in the `CITIES` array to `status: 'available'`
3. That's it - the City Select, Route List, Route Detail and Find Route screens
   all read from this registry automatically. No other code changes needed.

## Suggested future features

- Crowd-reported fares (commuters flag a route if the fare has changed)
- Live bus tracking using driver or commuter location sharing
- More PNG cities and provinces (Port Moresby, Mount Hagen, Madang, ...)
- Offline map tiles for areas with no data connection
- Multi-language support (Tok Pisin, Hiri Motu, English)
- Push notifications for route or fare changes
