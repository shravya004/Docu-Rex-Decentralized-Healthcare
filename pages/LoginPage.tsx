import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Illustration = () => (
    <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] p-12 text-white flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold mb-4">Docu-Rex</h1>
        <p className="text-xl max-w-sm">A new era of secure, decentralized, and verifiable healthcare document management.</p>
        <svg className="w-2/3 max-w-xs mt-12" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 0L200 50V150L100 200L0 150V50L100 0Z" fill="white" fillOpacity="0.1"/>
            <path d="M40 80L100 115L160 80" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M100 115V170" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M175 60V140C175 145.523 170.523 150 165 150H35C29.4772 150 25 145.523 25 140V60C25 54.4772 29.4772 50 35 50H165C170.523 50 175 54.4772 175 60Z" stroke="white" strokeOpacity="0.5" strokeWidth="3"/>
            <path d="M65 85H135" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M65 105H115" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        </svg>
    </div>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-stretch justify-center min-h-screen bg-white">
      <div className="hidden md:flex md:w-1/2">
        <Illustration />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl font-bold text-center text-gray-900">Welcome Back</h2>
          <p className="text-center text-[#4B5563] mt-2 mb-8">Sign in to access your dashboard.</p>
          
          <div className="p-4 bg-[#E0F2FE]/50 border border-[#60A5FA]/50 rounded-xl text-sm text-[#1E40AF] mb-6">
              <h3 className="font-bold mb-2">Demo Credentials:</h3>
              <ul className="list-disc list-inside space-y-1">
                  <li><strong className="font-semibold">Admin:</strong> charlie@docurex.com</li>
                  <li><strong className="font-semibold">Doctor:</strong> alice@docurex.com</li>
                  <li><strong className="font-semibold">Patient:</strong> bob@docurex.com</li>
              </ul>
              <p className="mt-2 text-xs">Any password will work for this demo.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#60A5FA] focus:border-[#2563EB]"
                placeholder="you@example.com"
              />
            </div>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </span>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#60A5FA] focus:border-[#2563EB]"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-[#EF4444]">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60A5FA] disabled:bg-[#93C5FD] transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
