import React from 'react';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <div className="text-center my-5">
      <h1>Welcome to MERN Admin & User Panel</h1>
      <p className="lead">A simple application with User authentication and Admin Dashboard</p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-secondary">Register</Link>
      </div>
    </div>
  );
};

export default HomeScreen;