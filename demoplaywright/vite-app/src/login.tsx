
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageWithExpiry } from './help/StorageWithExpiry';
import { GlobalFetch } from './help/fetch';
import './Login.css';
import Navbar from './Nav';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // State for the bottom-left Reset UI
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showSucceedReset, setShowSucceedReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [ResetFeedback, setResetFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const navigate = useNavigate();

  const handleQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage("Thank you for your question! We will never get back to you.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    if (submitter && submitter.textContent === 'Info') {
      setInfoMessage('Use your assigned training credentials. Contact the admin if needed.');
      return;
    }
    setInfoMessage('');

    let res: Response | undefined = undefined;
    let retryCount = 0;
    try {
      while (!res || !res.ok) {
        if (res) {
          await new Promise((f) => setTimeout(f, 100));
        }
        res = await GlobalFetch('http://localhost:3000/login/', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
        });
        retryCount++;
        if (retryCount >= 3) break;
      }

      if (res && res.ok) {
        const element = document.getElementById('login');
        if (element) {
          element.textContent = 'Logout';
        }

        const token = await res.json();
        StorageWithExpiry.set('isAuthenticated', true, 15 * 60 * 1000);
        StorageWithExpiry.set('token', token, 15 * 60 * 1000);
        navigate('/Persons');
      } else if (res) {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
      } else {
        setError('Login failed: no response');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        setError(error.message);
      } else {
        console.error('Unknown error:', error);
        setError('An unknown error occurred');
      }
    }
  };

  // Open inline confirmation (no window.confirm)
  const openConfirmReset = () => {
    setResetFeedback({ type: null, message: '' });
    setShowConfirmReset(true);
  };

  // Execute Reset and show inline success/error
  const confirmResetAll = async () => {
    setResetting(true);
    setError('');
    setInfoMessage('');
    setResetFeedback({ type: null, message: '' });

    try {
      let res: Response | undefined = undefined;
      let retryCount = 0;
      let myError: Error | null = null;
      while (!res || !res.ok) {
        if (res) {
          await new Promise((f) => setTimeout(f, 200));
        }
        try {
          res = await GlobalFetch('http://localhost:3000/reset/all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (err) { myError = err as Error; }
        retryCount++;
        if (retryCount >= 3) break;
      }

      if (myError) {
        setResetFeedback({ type: 'error', message: myError.message });
      }
      else if (res) {

        if(!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Reset failed with status ${res.status}`);
        }

        const data = await res.json().catch(() => ({}));
        const message = data.message || 'Data has been erased';

        setResetFeedback({ type: 'success', message });

        setShowSucceedReset(true);
        setTimeout(() => setShowSucceedReset(false), 3000);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred while deleting all data.';
      setResetFeedback({ type: 'error', message: msg });
    } finally {
      setResetting(false);
    }
  };

  const cancelResetAll = () => {
    setShowConfirmReset(false);
    setResetFeedback({ type: null, message: '' });
  };

  return (
    <div className="login-container">
      <Navbar />

      <div className="question-box" style={{ position: 'absolute', top: '60px', right: '10px' }}>
        <form
          onSubmit={handleQuestion}
          style={{
            marginTop: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '15px',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          <div className="row mb-3">
            <div className="col-sm-6">
              <label htmlFor="question">
                Do you have any questions this <b>doesn't</b> answer it:
              </label>
            </div>
            <div className="col-sm-6">
              <input type="text" id="question" name="question?" placeholder="question" required />
            </div>
          </div>
          <button type="submit">Ok</button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="Username"
              name="Username"
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              id="Password"
              name="Password"
            />

            {error && (
              <div className="error-message">
                <p>😕 Oeps! {error}. Try again or contact the adminstrator</p>
              </div>
            )}
            {infoMessage && (
              <div className="info-message">
                <p>{infoMessage}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="submit">Ok</button>
              {/* Optional “Info” submit (your code branches on this) */}
              <button type="submit">Info</button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom-left Reset UI (fixed position) */}
      <div style={{ position: 'fixed', bottom: '10px', left: '10px', zIndex: 1000 }}>
        {!showConfirmReset ? (
          <>
            {showSucceedReset && (
              <div
                id="Reset-succeeded"
                role="status"
                aria-live="polite"
                style={{
                  marginBottom: '8px',
                  backgroundColor: '#ecfdf5', // green-50
                  border: '1px solid #10b981', // green-500
                  color: '#065f46', // green-800
                  padding: '8px',
                  borderRadius: '6px',
                }}
              >
                Reset succeeded
              </div>
            )}

            <button
              type="button"
              onClick={openConfirmReset}
              style={{
                backgroundColor: '#b91c1c',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
              aria-label="Reset all data"
              title="Reset all data"
            >
              Reset all data
            </button>
          </>
        ) : (
          <div
            role="dialog"
            aria-labelledby="Reset-title"
            aria-live="polite"
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
              width: '280px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <div id="Reset-title" style={{ fontWeight: 700, marginBottom: '8px' }}>
              Reset all data
            </div>

            {/* Initial confirmation view */}
            {ResetFeedback.type === null && (
              <>
                <p style={{ margin: '0 0 12px' }}>
                  Are you sure you want to Reset <strong>ALL</strong> data? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={confirmResetAll}
                    disabled={resetting}
                    style={{
                      backgroundColor: resetting ? '#9ca3af' : '#b91c1c',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: resetting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {resetting ? 'resetting' : 'Reset'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelResetAll}
                    style={{
                      backgroundColor: '#111827',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Success message */}
            {ResetFeedback.type === 'success' && (
              <div
                role="status"
                style={{
                  marginTop: '8px',
                  backgroundColor: '#ecfdf5', // green-50
                  border: '1px solid #10b981', // green-500
                  color: '#065f46', // green-800
                  padding: '8px',
                  borderRadius: '6px',
                }}
              >
                ✅ {ResetFeedback.message}
              </div>
            )}

            {/* Error message */}
            {ResetFeedback.type === 'error' && (
              <div
                role="alert"
                style={{
                  marginTop: '8px',
                  backgroundColor: '#fef2f2', // red-50
                  border: '1px solid #ef4444', // red-500
                  color: '#7f1d1d', // red-800
                  padding: '8px',
                  borderRadius: '6px',
                }}
              >
                ❌ {ResetFeedback.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
