import React, { useState } from 'react';
import { apiFetch } from "./lib/api";
import { setAuthToken } from "./lib/authToken";

type LoginPageProps = {
    onAuthSuccess?: () => void;
    onStartDriverSignup?: (draft: {
        firstName: string;
        middleNames: string;
        lastName: string;
        emailOrUsername: string;
    }) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess, onStartDriverSignup }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    // Form state
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [middleNames, setMiddleNames] = useState('');
    const [lastName, setLastName] = useState('');
    const [signupAsDriver, setSignupAsDriver] = useState(false);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        if (mode === 'signup') {
            if (!firstName.trim() || !lastName.trim()) {
                setError('Please provide your first name and last name.');
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                setLoading(false);
                return;
            }
        }

        const endpoint = mode === 'login' ? 'auth/login' : 'auth/register';

        const payload =
            mode === 'login'
                ? { email: emailOrUsername, password }
                : {
                    email: emailOrUsername,
                    password,
                    full_name: [firstName, middleNames, lastName].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
                    first_name: firstName,
                    middle_names: middleNames,
                    last_name: lastName,
                    signup_as_driver: signupAsDriver,
                };

        try {
            const data = await apiFetch<any>(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                auth: false,
            });


            if (mode === 'login') {
                if (data.access_token || data.token) {
                    setAuthToken(data.access_token || data.token);
                    if (onAuthSuccess) onAuthSuccess();
                } else {
                    throw new Error('Invalid login credentials.');
                }
            }
            else {
                // Capture values before we clear state
                const draft = {
                    firstName: firstName.trim(),
                    middleNames: middleNames.trim(),
                    lastName: lastName.trim(),
                    emailOrUsername: emailOrUsername.trim(),
                };
                const email = emailOrUsername.trim();
                const pw = password; // keep the password for auto-login

                // Clear form UI state
                setEmailOrUsername('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setMiddleNames('');
                setLastName('');
                setSignupAsDriver(false);

                if (signupAsDriver) {
                    // IMPORTANT: register doesn't return a token, but /drivers/upgrade requires auth.
                    // So we immediately log in and store authToken before launching DriverSignupPage.
                    try {
                        const loginRes = await apiFetch<any>('auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password: pw }),
                            auth: false,
                        });

                        const token = loginRes?.access_token || loginRes?.token;
                        if (!token) throw new Error('Auto-login failed: missing token');

                        setAuthToken(token);
                        setSuccessMessage('Account created! Complete driver signup.');
                        onStartDriverSignup?.(draft);
                        return;
                    } catch (err: any) {
                        setError(err?.message ?? 'Account created, but auto-login failed. Please log in, then complete driver signup.');
                        setMode('login');
                        return;
                    }
                }

                setSuccessMessage(data.message || 'Account created! Please check your email to verify and log in.');
                setMode('login');
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to manage your rides or create a new account.</p>

            <div className="auth-card">
                <div className="auth-toggle">
                    <button
                        type="button"
                        className={`auth-toggle-button ${mode === 'login' ? 'auth-toggle-button-active' : ''}`}
                        onClick={() => setMode('login')}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        className={`auth-toggle-button ${mode === 'signup' ? 'auth-toggle-button-active' : ''}`}
                        onClick={() => setMode('signup')}
                    >
                        Sign up
                    </button>
                </div>

                {error && (
                    <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px' }}>
                        {error}
                    </p>
                )}

                {successMessage && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        color: '#4ade80',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <>
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="firstName">First name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className="auth-input"
                                    placeholder="Alex"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label" htmlFor="middleNames">Middle names (optional)</label>
                                <input
                                    id="middleNames"
                                    type="text"
                                    className="auth-input"
                                    placeholder="James"
                                    value={middleNames}
                                    onChange={(e) => setMiddleNames(e.target.value)}
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label" htmlFor="lastName">Last name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className="auth-input"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Email or university username</label>
                        <input
                            id="email"
                            type="text"
                            className="auth-input"
                            placeholder="you@bath.ac.uk or abc123"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="auth-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {mode === 'signup' && (
                        <>
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="confirmPassword">Confirm password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="auth-input"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <label
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                    color: '#e5e7eb',
                                    userSelect: 'none',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={signupAsDriver}
                                    onChange={(e) => setSignupAsDriver(e.target.checked)}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                Do you want to sign up as a driver?
                            </label>
                        </>
                    )}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Processing...' : mode === 'login' ? 'Continue' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
