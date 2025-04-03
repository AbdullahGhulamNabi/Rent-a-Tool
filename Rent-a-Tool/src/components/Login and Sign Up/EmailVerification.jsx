import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Api_Route } from '../../config';
import { toast, Toaster } from 'react-hot-toast';

function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${Api_Route}/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage('Email verified successfully!');
          toast.success('Email verified successfully! You can now log in.', {
            duration: 5000,
            position: 'top-center',
          });
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setError(data.msg || 'Verification failed');
          toast.error(data.msg || 'Verification failed. Please try again.', {
            duration: 5000,
            position: 'top-center',
          });
        }
      } catch (error) {
        setError('An error occurred while verifying your email');
        toast.error('An error occurred while verifying your email', {
          duration: 5000,
          position: 'top-center',
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Email Verification</h2>
        {error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 mb-4">{message}</p>
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            {!isLoading && !error && (
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Home
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailVerification; 