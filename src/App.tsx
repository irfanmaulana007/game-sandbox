import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home } from './pages';
import Character from './pages/Character';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character" element={<Character />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
