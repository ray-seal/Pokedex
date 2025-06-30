import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Joystick } from 'react-joystick-component';
import './index.css'; // Optional: your styles

mapboxgl.accessToken = 'pk.eyJ1IjoicmF5c2VhbCIsImEiOiJjbWNqbmRxdngwMnpmMmtxcnAyaGF3YXRrIn0.XMUTirooUCUzGuI0CAQ2hA';

const FAST_TRAVEL_UNLOCKED = [
  // Example: { name: "Big Forest", lat: 51.5, lng: -0.12 }
];

const Index = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null); // No default; wait for GPS
  const markerRef = useRef(null);
  const [showSatnav, setShowSatnav] = useState(false);

  // Get GPS location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        // Fallback if GPS denied
        setPosition({ lat: 51.5072, lng: -0.1276 });
      }
    );
  }, []);

  // Initialize map when position is set
  useEffect(() => {
    if (!position || map) return;
    const initMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [position.lng, position.lat],
      zoom: 16,
      pitch: 60,
      bearing: -17.6,
      antialias: true,
    });

    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([position.lng, position.lat])
      .addTo(initMap);

    markerRef.current = marker;
    setMap(initMap);

    return () => initMap.remove();
    // eslint-disable-next-line
  }, [position]);

  // Move marker when position changes
  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLngLat([position.lng, position.lat]);
      if (map) map.flyTo({ center: [position.lng, position.lat], speed: 0.5 });
    }
    // eslint-disable-next-line
  }, [position]);

  // Joystick movement
  const moveBy = (dx, dy) => {
    if (!position) return;
    const step = 0.0005; // Adjust as desired
    const newLat = position.lat + dy * step;
    const newLng = position.lng + dx * step;
    setPosition({ lat: newLat, lng: newLng });
  };

  const handleJoystickMove = (event) => {
    // event: {x: -100..100, y: -100..100}
    if (!event.x && !event.y) return;
    const dx = event.x / 100; // Normalize to -1..1
    const dy = -event.y / 100; // Joystick Y is usually inverted
    moveBy(dx, dy);
  };

  // Fast Travel Handler
  const fastTravel = (location) => {
    setPosition({ lat: location.lat, lng: location.lng });
    setShowSatnav(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />

      {/* Compass Icon */}
      <button
        onClick={() => setShowSatnav(true)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'white',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="Open Satnav"
      >
        {/* Simple compass icon SVG */}
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="15" fill="#fff" stroke="#333" strokeWidth="2"/>
          <polygon points="16,5 20,24 16,19 12,24" fill="#f00"/>
        </svg>
      </button>

      {/* Joystick Controls */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10 }}>
        <Joystick
          size={80}
          baseColor="#eee"
          stickColor="#333"
          move={handleJoystickMove}
          stop={() => {}}
        />
      </div>

      {/* Satnav Modal */}
      {showSatnav && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setShowSatnav(false)}
        >
          <div style={{ background: 'white', padding: 24, borderRadius: 12, minWidth: 280 }} onClick={e => e.stopPropagation()}>
            <h3>Fast Travel</h3>
            {FAST_TRAVEL_UNLOCKED.length === 0 && <div>No fast travel locations unlocked</div>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {FAST_TRAVEL_UNLOCKED.map(loc => (
                <li key={loc.name}>
                  <button
                    style={{ display: 'block', margin: '8px 0', width: '100%' }}
                    onClick={() => fastTravel(loc)}
                  >
                    {loc.name}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowSatnav(false)} style={{ marginTop: 16 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
