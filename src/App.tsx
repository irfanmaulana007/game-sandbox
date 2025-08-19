import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, MapDetail, Login, Register } from './pages';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Inventory from './pages/Inventory';
import Character from './pages/Character';
import OnBoarding from './pages/OnBoarding';
import Equipment from './pages/Equipment';
import Shop from './pages/Shop';
import './App.css';
import MapZoneDetail from './pages/MapZoneDetail';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute requireAuth={false} redirectTo="/">
                      <Login />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute requireAuth={false} redirectTo="/">
                      <Register />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/character"
                  element={
                    <ProtectedRoute>
                      <Character />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnBoarding />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/map/:mapId"
                  element={
                    <ProtectedRoute>
                      <MapDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map/:mapId/zone/:zoneId"
                  element={
                    <ProtectedRoute>
                      <MapZoneDetail />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/equipment"
                  element={
                    <ProtectedRoute>
                      <Equipment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <ProtectedRoute>
                      <Shop />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </ToastProvider>
  );
};

export default App;
