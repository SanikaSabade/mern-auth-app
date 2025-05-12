import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import AuthForm from './pages/AuthForm';
import UserForm from './pages/UserForm';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/user/form" element={<UserForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
