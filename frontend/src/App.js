import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyScreen from './screens/VerifyScreen';
import UserFormScreen from './screens/UserFormScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/verify/:token" element={<VerifyScreen />} />
            <Route 
              path="/form" 
              element={
                <PrivateRoute>
                  <UserFormScreen />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboardScreen />
                </AdminRoute>
              } 
            />
          </Routes>
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;