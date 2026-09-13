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
  const [name, setName] = useState('');
  const [role, setRole] = useState<'trainee' | 'trainer' | 'admin'>('trainee');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://academia-prototype.onrender.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        // --- Registration Flow ---
        const res = await fetch(`${apiBaseUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed. Try a different email.');
        }

        // Auto-login or switch to login tab upon successful creation
        setIsRegisterMode(false);
        setErrorMessage('Account created successfully! Please sign in with your credentials.');
        setIsSubmitting(false);
        return;
      }

      // --- Login Flow (OAuth2 Password Grant) ---
      const formData = new URLSearchParams();
      formData.append('username', email.trim());
      formData.append('password', password);

      const res = await fetch(`${apiBaseUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 404) {
          throw new Error('UNREGISTERED_OR_INVALID');
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Unable to sign in.');
      }

      const data = await res.json();
      const accessToken = data.access_token;

      // Extract user info from response payload or fallback parsing
      let userProfile = data.user;
      if (!userProfile) {
        // Fetch current user or infer from demo personas/inputs
        const roleInferred = email.includes('admin')
          ? 'admin'
          : email.includes('aarav')
          ? 'trainer'
          : 'trainee';

        userProfile = {
          id: data.user_id || 1,
          email: email.trim(),
          name: email.split('@')[0].toUpperCase(),
          role: roleInferred,
        };
      }

      // Commit to context & storage
      login(accessToken, userProfile);
      onClose();
    } catch (err: any) {
      if (err.message === 'UNREGISTERED_OR_INVALID') {
        setErrorMessage('NOT_REGISTERED');
      } else {
        setErrorMessage(err.message || 'Authentication failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            {isRegisterMode ? 'Create New Account' : 'Portal Sign In'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Error & Redirection Banner */}
        {errorMessage === 'NOT_REGISTERED' ? (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 space-y-2">
            <p className="font-semibold">
              No account found for <span className="underline">{email}</span> or incorrect password.
            </p>
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsRegisterMode(true);
              }}
              className="font-bold underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 block"
            >
              Don't have an account? Click here to register →
            </button>
          </div>
        ) : errorMessage ? (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Candidate Name"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@connect.edu"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Role Track
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="trainee">Trainee / Candidate</option>
                <option value="trainer">Trainer / Instructor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white text-sm shadow-md transition disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : isRegisterMode
              ? 'Complete Registration'
              : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {isRegisterMode ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsRegisterMode(false);
              }}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
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
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
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