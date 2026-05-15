import { useState } from "react";
import "./App.css";

const API_CONFIG = {
  KEY: "dbaa3a8a234377227b8aa996b963937e",
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
};

const fetchCityWeather = async (cityName) => {
  const url = `${API_CONFIG.BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_CONFIG.KEY}&units=metric`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Target location not found");
  }
  
  return response.json();
};

export default function App() {
  const [query, setQuery] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "" });

  const executeSearch = async (e) => {
    e.preventDefault();
    
    const sanitizedQuery = query.trim();
    if (!sanitizedQuery) return;

    // Batching state updates for UI reset
    setCurrentWeather(null);
    setStatus({ loading: true, error: "" });

    try {
      const data = await fetchCityWeather(sanitizedQuery);
      setCurrentWeather(data);
      setQuery(""); // Unique UX touch: clears input box on success
    } catch (err) {
      setStatus({ loading: false, error: "Could not find that city. Try again!" });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <main className="container">
      <section className="weather-card">
        <h1>Weather Finder</h1>

        <form onSubmit={executeSearch} className="search-box">
          <input
            type="text"
            placeholder="Type a city name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={status.loading}>
            {status.loading ? "Searching..." : "Search"}
          </button>
        </form>

        {status.loading && <p className="status-message">Gathering weather metrics...</p>}

        {status.error && <p className="error-alert">{status.error}</p>}

        {currentWeather && (
          <article className="weather-info">
            <h2>{currentWeather.name}</h2>
            <p className="temperature">
              <strong>{Math.round(currentWeather.main.temp)}°C</strong>
            </p>
            <p className="description">
              Expect {currentWeather.weather[0].description} today.
            </p>
          </article>
        )}
      </section>
    </main>
  );
}