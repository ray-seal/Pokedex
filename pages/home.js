import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Lab from './pages/lab';
import Store from './pages/store';

function App() {
  return (
    <Router>
      <ThemeSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lab " element={<Lab />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App;
