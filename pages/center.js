export default function Center() {
  const heal = () => {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (saved) {
      saved.playerHP = 100;
      localStorage.setItem("gameState", JSON.stringify(saved));
      alert("✅ Your Pokémon have been fully healed!");
    } else {
      alert("⚠️ No game state found.");
    }
  };

  return (
    <main style={{
      fontFamily: 'monospace',
      padding: '20px',
      background: 'url(/backgrounds/center.png) center/cover no-repeat',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <h1>🏥 Pokémon Center</h1>
      <p>Welcome! Let Nurse Joy heal your Pokémon back to full health.</p>
      <button onClick={heal} style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>❤️ Heal Pokémon</button>
      <br /><br />
      <a href="/" style={{ color: '#fff', textDecoration: 'underline' }}>⬅️ Back to Main Menu</a>
    </main>
  );
}
