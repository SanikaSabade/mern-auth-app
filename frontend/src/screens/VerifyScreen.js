import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyScreen = () => {
  const { token } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`/api/users/verify-email/${token}`);
      } catch (err) {
        setError(
          err.response?.data?.message || 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="text-center my-5">
      <h1>Email Verification</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="alert alert-success">
          Your email has been verified successfully! You can now{' '}
          <Link to="/login">login</Link>.
        </div>
      )}
    </div>
  );
};

export default VerifyScreen;
