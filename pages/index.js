import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useGame } from '../context/GameContext';
import SatNav from '../components/SatNav';
import ArenaChallenge from '../components/ArenaChallenge';
import { counties } from '../data/regions';
import wildlifejournal from '../public/wildlifejournal.json';
import { getPokemonStats } from '../lib/pokemonStats';

// Add this at top: import nipplejs
import nipplejs from 'nipplejs';

export default function Home() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const panoramaRef = useRef(null);
  const [virtualPos, setVirtualPos] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // ... existing state/context/hooks here ...

  // 1. Get real GPS once, set virtual position
  useEffect(() => {
    if (!mapReady) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const pos = {
          lat: coords.latitude,
          lng: coords.longitude
        };
        setVirtualPos(pos);
        initMap(pos);
      }, (err) => console.error(err));
    }
  }, [mapReady]);

  // 2. Initialize Google Map + StreetView + Joystick
  function initMap(initialPos) {
    const map = new window.google.maps.Map(mapRef.current, {
      center: initialPos,
      zoom: 17
    });
    markerRef.current = new window.google.maps.Marker({
      position: initialPos,
      map
    });
    panoramaRef.current = new window.google.maps.StreetViewPanorama(
      document.getElementById('street-view'), {
        position: initialPos,
        pov: { heading: 165, pitch: 0 },
        visible: true
      }
    );
    map.setStreetView(panoramaRef.current);
    initJoystick(map, panoramaRef.current);
    setMapReady(true);
  }

  // 3. Joystick setup and movement logic
  function initJoystick(map, panorama) {
    const zone = document.getElementById('joystick-zone');
    zone.style.position = 'absolute';
    zone.style.bottom = '20px';
    zone.style.left = '20px';
    zone.style.width = '120px';
    zone.style.height = '120px';
    const manager = nipplejs.create({
      zone,
      mode: 'static',
      position: { left: '60px', bottom: '60px' },
      color: 'gray',
      size: 100
    });
    const speed = 0.00005; // adjust as needed

    manager.on('move', (_, data) => {
      if (!virtualPos) return;
      const dx = data.vector.x * speed;
      const dy = -data.vector.y * speed; // Y-axis invert
      const next = {
        lat: virtualPos.lat + dy,
        lng: virtualPos.lng + dx
      };
      setVirtualPos(next);
      markerRef.current.setPosition(next);
      map.panTo(next);
      panorama.setPosition(next);
    });
  }

  return (
    <main style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Map & StreetView */}
      <div ref={mapRef} id="map" style={{ width: '50%', height: '100%', float: 'left' }} />
      <div id="street-view" style={{ width: '50%', height: '100%', float: 'right' }} />
      <div id="joystick-zone" />

      {/* Existing UI */}
      {/* ... existing markup from your return ... */}
    </main>
  );
}