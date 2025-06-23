import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Store from './pages/Store';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '15px' }}>🏠 Home</Link>
        <Link to="/store" style={{ marginRight: '15px' }}>🛍️ PokéMart</Link>
        <Link to="/lab">🧪 Professor Oak's Lab</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
}
