import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/apiClient';
import { useAuth } from '../auth/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-emerald-900/10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Plant Control</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to monitor your plants and alerts.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <ErrorMessage message={error} />
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              required
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
