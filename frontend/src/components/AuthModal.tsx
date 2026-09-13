import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'trainee' | 'trainer' | 'admin'>('trainee');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  const validateInput = () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setErrorMessage('Please provide a valid institutional email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateInput()) return;

    setIsSubmitting(true);
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      if (isRegisterMode) {
        const res = await fetch(`${apiBaseUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sanitizedEmail, password, name: name.trim(), role }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed. Check your parameters.');
        }

        setIsRegisterMode(false);
        setErrorMessage('Account initialized successfully. Please sign in with your credentials.');
        setIsSubmitting(false);
        return;
      }

      // OAuth2 URL-encoded Grant
      const formData = new URLSearchParams();
      formData.append('username', sanitizedEmail);
      formData.append('password', password);

      const res = await fetch(`${apiBaseUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 404) {
          throw new Error('NOT_REGISTERED');
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication handshake rejected.');
      }

      const data = await res.json();
      const accessToken = data.access_token;

      let userProfile = data.user;
      if (!userProfile) {
        const roleInferred = sanitizedEmail.includes('admin')
          ? 'admin'
          : sanitizedEmail.includes('aarav')
          ? 'trainer'
          : 'trainee';

        userProfile = {
          id: data.user_id || 1,
          email: sanitizedEmail,
          name: sanitizedEmail.split('@')[0].toUpperCase(),
          role: roleInferred,
        };
      }

      login(accessToken, userProfile);
      onClose();
    } catch (err: any) {
      if (err.message === 'NOT_REGISTERED') {
        setErrorMessage('NOT_REGISTERED');
      } else {
        setErrorMessage(err.message || 'Authentication error.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#0E1526] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-lg text-white">
            {isRegisterMode ? 'Create Institutional ID' : 'Portal Sign In'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {errorMessage === 'NOT_REGISTERED' ? (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 space-y-2">
            <p className="font-semibold">
              No account registered for <span className="underline">{email}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsRegisterMode(true);
              }}
              className="font-bold underline text-indigo-400 hover:text-indigo-300 block"
            >
              Click here to register this candidate ID →
            </button>
          </div>
        ) : errorMessage ? (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 font-medium">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Candidate Name"
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@connect.edu"
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs text-white focus:outline-none focus:border-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-xs text-slate-500 hover:text-slate-300"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Role Track
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0B101E] text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="trainee">Trainee / Candidate</option>
                <option value="trainer">Trainer / Instructor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {isSubmitting
              ? 'Handshaking...'
              : isRegisterMode
              ? 'Complete Candidate Registration'
              : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          {isRegisterMode ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsRegisterMode(false);
              }}
              className="font-bold text-indigo-400 hover:underline"
            >
              Already registered? Sign in instead
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsRegisterMode(true);
              }}
              className="font-bold text-indigo-400 hover:underline"
            >
              Need an account? Register as a candidate →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;