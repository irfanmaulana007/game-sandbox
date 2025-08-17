import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, MapDetail } from './pages';

import Inventory from './pages/Inventory';
import Character from './pages/Character';
import OnBoarding from './pages/OnBoarding';
import Equipment from './pages/Equipment';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/character" element={<Character />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/map/:mapId" element={<MapDetail />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/equipment" element={<Equipment />} />
      </Routes>
    </Router>
  );
};

export default App;
