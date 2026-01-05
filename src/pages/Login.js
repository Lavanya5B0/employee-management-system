import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email.length < 5) {
            setError("Username must be at least 5 characters");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        login({ email });
        navigate('/dashboard');
    };

    return (
        <div style={containerStyle}>
            {/* Left Side: Brand/Visual Area */}
            <div style={brandSectionStyle}>
                <div style={{ maxWidth: '400px' }}>
                    <ShieldCheck size={60} color="white" style={{ marginBottom: '20px' }} />
                    <h1 style={brandTitleStyle}>HR Management System</h1>
                    <p style={brandSubStyle}>Manage your workforce, track performance, and streamline administrative tasks with our secure portal.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div style={formSectionStyle}>
                <div style={cardStyle}>
                    <h2 style={headerStyle}>HR Admin Login</h2>
                    <p style={{ color: '#64748b', marginBottom: '30px', textAlign: 'center' }}>Please enter your credentials to access the dashboard.</p>

                    <form onSubmit={handleLogin}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Email Address</label>
                            <div style={inputWrapperStyle}>
                                <Mail size={18} style={iconStyle} />
                                <input
                                    type="text" placeholder="admin@test.com" style={inputStyle}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Password</label>
                            <div style={inputWrapperStyle}>
                                <Lock size={18} style={iconStyle} />
                                <input
                                    type="password" placeholder="••••••••" style={inputStyle}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <div style={errorBoxStyle}>{error}</div>}

                        <button type="submit" style={btnStyle}>Sign In to Dashboard</button>
                    </form>

                    <div style={creditsStyle}>
                        <p style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Demo Credentials</p>
                        <p>User: <strong>admin@test.com</strong> | Pass: <strong>123456</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Updated Styles ---

const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Inter', sans-serif"
};

const brandSectionStyle = {
    flex: 1,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px',
    color: 'white',
    // Hide on small screens for mobile responsiveness
    '@media (max-width: 768px)': { display: 'none' }
};

const brandTitleStyle = { fontSize: '42px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' };
const brandSubStyle = { fontSize: '18px', opacity: '0.9', lineHeight: '1.6' };

const formSectionStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '40px'
};

const cardStyle = {
    padding: '50px',
    background: 'white',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 15px 15px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const headerStyle = {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 10px 0'
};

const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' };

const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const iconStyle = { position: 'absolute', left: '14px', color: '#94a3b8' };

const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 45px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
};

const btnStyle = {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.2s'
};

const errorBoxStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '15px',
    textAlign: 'center',
    border: '1px solid #fee2e2'
};

const creditsStyle = {
    marginTop: '35px',
    padding: '15px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#64748b',
    textAlign: 'center'
};

export default Login;