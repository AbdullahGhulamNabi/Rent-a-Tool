import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Api_Route } from '../../config';

function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${Api_Route}/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage('Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(data.msg || 'Verification failed');
        }
      } catch (error) {
        setError('An error occurred while verifying your email');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Email Verification</h2>
        {error ? (
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700">{message}</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailVerification; 