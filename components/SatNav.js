// components/SatNav.js
import { useState, useEffect } from 'react';
import { counties } from '../data/regions';

export default function SatNav({ currentCounty, onChange }) {
  // Extract unique countries, preserving order from counties array
  const countryOrder = ['England', 'Wales', 'Scotland', 'Northern Ireland'];
  const countries = countryOrder.filter(country =>
    counties.some(c => c.country === country)
  );

  // Figure out the initial selected country from the current county
  const getCountryOfCounty = (countyId) => {
    const found = counties.find(c => c.id === countyId);
    return found ? found.country : countries[0];
  };

  const [selectedCountry, setSelectedCountry] = useState(getCountryOfCounty(currentCounty));

  // When currentCounty changes (from props), update selected country if needed
  useEffect(() => {
    setSelectedCountry(getCountryOfCounty(currentCounty));
  }, [currentCounty]);

  // Counties in the selected country, in travel order as per counties array
  const filteredCounties = counties.filter(c => c.country === selectedCountry);

  // Handler for country selection
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    // Automatically select the first county in that country
    const firstCounty = counties.find(c => c.country === newCountry);
    if (firstCounty) onChange(firstCounty.id);
  };

  // Handler for county selection
  const handleCountyChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '18px 0' }}>
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        style={{
          fontSize: '1rem',
          padding: '10px 18px',
          borderRadius: 7,
          minWidth: 120,
        }}
      >
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      <select
        value={currentCounty}
        onChange={handleCountyChange}
        style={{
          fontSize: '1rem',
          padding: '10px 18px',
          borderRadius: 7,
          minWidth: 180,
        }}
      >
        {filteredCounties.map(county => (
          <option key={county.id} value={county.id}>{county.name}</option>
        ))}
      </select>
    </div>
  );
}
