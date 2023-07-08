import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationArrow,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const key = process.env.REACT_APP_API_KEY;
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [showInstructions, setShowInstructions] = useState(false);

  const fetchData = async (latitude, longitude, city = "") => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
      );
      const result = await response.json();
      setWeather(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchDataForCity();
    }
  };

  const fetchDataForCity = () => {
    fetchData(null, null, city);
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchData(latitude, longitude);
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 w-80">
        <h1 className="text-3xl text-center font-bold mb-6">Weather App</h1>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            className="border border-gray-300 rounded-lg py-2 px-4 w-48 focus:outline-none"
            value={city}
            onChange={handleCityChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 rounded-lg ml-2 px-4 py-2 text-white focus:outline-none"
            onClick={fetchDataForCity}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div>
            {weather.main && weather.main.temp ? (
              <span className="text-5xl font-bold">
                {Math.round(weather.main.temp)}°C
              </span>
            ) : (
              <span className="text-5xl font-bold">--°C</span>
            )}
          </div>
          <div className="text-xl font-semibold mb-4">
            {weather.name && weather.name ? (
              <span>{weather.name}</span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 text-white focus:outline-none"
            onClick={fetchCurrentLocation}
          >
            <FontAwesomeIcon icon={faLocationArrow} />
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 rounded-lg ml-2 px-4 py-2 text-gray-700 focus:outline-none"
            onClick={toggleInstructions}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
        </div>
        {showInstructions && (
          <div className="text-center mt-4">
            <p className="text-gray-500">Instructions:</p>
            <p className="text-gray-500">
              1. Enter a city name in the input field.
            </p>
            <p className="text-gray-500">
              2. Press Enter or click the search button to fetch weather data
              for the entered city.
            </p>
            <p className="text-gray-500">
              3. Click the location button to fetch weather data for your
              current location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
