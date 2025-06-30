import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './index.css'; // Optional styling

mapboxgl.accessToken = 'pk.eyJ1IjoicmF5c2VhbCIsImEiOiJjbWNqbmRxdngwMnpmMmtxcnAyaGF3YXRrIn0.XMUTirooUCUzGuI0CAQ2hA';

const Index = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState({ lng: -0.1276, lat: 51.5072 }); // London start
  const markerRef = useRef(null);

  const moveMarker = (dir) => {
    const step = 0.0005;
    let { lat, lng } = position;

    if (dir === 'up') lat += step;
    if (dir === 'down') lat -= step;
    if (dir === 'left') lng -= step;
    if (dir === 'right') lng += step;

    setPosition({ lat, lng });
    if (markerRef.current) markerRef.current.setLngLat([lng, lat]);
    if (map) map.flyTo({ center: [lng, lat], speed: 0.5 });
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') moveMarker('up');
      if (e.key === 'ArrowDown' || e.key === 's') moveMarker('down');
      if (e.key === 'ArrowLeft' || e.key === 'a') moveMarker('left');
      if (e.key === 'ArrowRight' || e.key === 'd') moveMarker('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, map]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default Index;