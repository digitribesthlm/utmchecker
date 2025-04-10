import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import UTMForm from './utm-form';
import Link from 'next/link';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Check if user is already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('utm_auth');
    if (auth === 'true') {
      router.push('/utm-form');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call our API endpoint
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Set authentication in localStorage
        localStorage.setItem('utm_auth', 'true');
        router.push('/utm-form');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>UTM Link Builder - Login</title>
        <meta name="description" content="Login to access the UTM link builder" />
      </Head>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            color: '#0052cc'
          }}>
            UTM Link Builder
          </h1>
          
          <form onSubmit={handleLogin}>
            {error && (
              <p style={{ 
                color: '#e53935', 
                backgroundColor: '#ffebee',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                {error}
              </p>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="userId" 
                style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}
              >
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isLoading ? '#cccccc' : '#0052cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
