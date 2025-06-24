import data from '../public/pokedex.json';
import Link from 'next/link';

export default function Pokedex() {
  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Pokédex</h1>
      <ul>
        {data.map(p => (
          <li key={p.id}>
            <img src={p.sprite} alt={p.name} width="32" /> {p.name}
          </li>
        ))}
      </ul>
      <Link href="/">🏠 Back to Main Page</Link>
    </div>
  );
}
