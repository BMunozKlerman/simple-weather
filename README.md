# Simple Weather App

A modern weather application built with Vue 3, Vite, Ionic, and Tailwind CSS.

## Features

- 🌤️ Real-time weather data from OpenWeatherMap API
- 📍 Pre-configured cities (Rio de Janeiro, Beijing, Los Angeles)
- ⏰ Hourly forecast for the next hours
- 📅 5-day daily forecast with weighted weather conditions
- 🌡️ Detailed weather information (temperature, weather conditions)
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 📱 Mobile-friendly with Ionic components
- 🌙 Dark mode support
- 🖼️ Weather icons from OpenWeatherMap

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Ionic Vue** - Mobile UI components
- **Tailwind CSS** - Utility-first CSS framework
- **OpenWeatherMap API** - Weather data provider

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
   VITE_OPENWEATHER_ICON_URL=https://openweathermap.org/img/wn
   ```
   **Note:** All environment variables are required. The app will throw an error if any are missing.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
simple-weather/
├── src/
│   ├── components/
│   │   ├── CityTabs.vue       # City tabs component
│   │   ├── HourlyForecast.vue # Hourly forecast display
│   │   └── DailyForecast.vue  # Daily forecast display
│   ├── router/
│   │   └── index.js           # Vue Router configuration
│   ├── services/
│   │   └── weatherService.js  # OpenWeatherMap API integration
│   ├── views/
│   │   └── Home.vue           # Main weather view
│   ├── App.vue                # Root component
│   ├── main.js                # Application entry point
│   └── style.css              # Global styles
├── .env                        # Environment variables (gitignored)
├── .env.example               # Environment variables template
├── postcss.config.js          # PostCSS configuration
└── vite.config.js             # Vite configuration
```

## Services

### Weather Service (`weatherService.js`)

Provides methods to interact with the OpenWeatherMap API:

- `getWeatherForecast(lat, lon)` - Get 5-day weather forecast (3-hour intervals)
- `getWeatherIconUrl(iconCode)` - Get URL for weather icon images

## API Usage

The app uses the OpenWeatherMap API with the following endpoint:

- 5-Day Forecast: `api.openweathermap.org/data/2.5/forecast`

All requests include:
- `lat` - Latitude coordinate
- `lon` - Longitude coordinate
- `appid` - API key (from environment variable)
- `units=metric` - Temperature in Celsius

Weather icons are loaded from:
- Icon URL: `openweathermap.org/img/wn/{icon}@2x.png`

## Pre-configured Cities

The app includes three pre-configured cities:
- **Rio de Janeiro, Brazil** - A vibrant coastal city in South America
- **Beijing, China** - The capital of China in East Asia
- **Los Angeles, United States** - A major city on the US West Coast

## Development

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |
| `VITE_OPENWEATHER_BASE_URL` | OpenWeatherMap API base URL | Yes |
| `VITE_OPENWEATHER_ICON_URL` | OpenWeatherMap icon base URL | Yes |

## Commentaries

I made this application with Vue and Ionic. It took a little more than 2 hours, considering this is my first app with this stack. I used Cursor to build this app.
I couldn't complete the search cities feature in time, but I did implement it later. However, I didn't push it to the repo.

### Considerations

The free API endpoints available provide data for 5 days in 3-hour intervals. Therefore, the hourly forecast shows data for approximately one day, and for the daily forecast, I calculate the minimum and maximum temperatures. For the weather icon, I calculate the most common condition during the day.
