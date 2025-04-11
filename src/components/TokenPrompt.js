import React, { useState } from 'react';

const TokenPrompt = ({ onTokenValidated }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const res = await fetch('https://vigil-6sgu.onrender.com/read-rapid/verify_token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.setItem('accessToken', token);
        onTokenValidated();
      } else {
        setError('Invalid token. Try again.');
      }
    } catch (err) {
      setError('Error verifying token.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Enter Access Token</h2>
        <input
          type="text"
          placeholder="Access Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleVerify} style={styles.button}>Submit</button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    background: '#fff', padding: '2rem', borderRadius: '10px', textAlign: 'center', width: '300px',
  },
  input: {
    width: '100%', padding: '0.5rem', marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px',
  },
  error: {
    color: 'red', marginTop: '1rem',
  },
};

export default TokenPrompt;