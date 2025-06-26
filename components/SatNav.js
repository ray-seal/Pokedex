// components/SatNav.js
import { counties } from '../data/regions';

export default function SatNav({ currentCounty, onChange }) {
  // Keep country order as you wish to present in the dropdown
  const countryOrder = ['England', 'Wales', 'Scotland', 'Northern Ireland'];
  const grouped = countryOrder.map(country => ({
    country,
    counties: counties.filter(c => c.country === country)
  }));

  return (
    <select
      value={currentCounty}
      onChange={e => onChange(e.target.value)}
      style={{
        fontSize: '1rem',
        padding: '10px 18px',
        borderRadius: 7,
        marginBottom: 18,
        marginTop: 18,
        minWidth: 220,
      }}
    >
      <option value="" disabled>
        Choose your location…
      </option>
      {grouped.map(group => (
        <optgroup key={group.country} label={group.country}>
          {group.counties.map(county => (
            <option key={county.id} value={county.id}>
              {county.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
