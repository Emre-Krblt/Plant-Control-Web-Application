import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/apiClient';
import { useAuth } from '../auth/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialForm);
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
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-8">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl shadow-emerald-900/10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Plant Control</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Start tracking plants, sensors, and alerts.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <ErrorMessage message={error} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              First name
              <input name="firstName" value={form.firstName} onChange={updateField} required className="input" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Last name
              <input name="lastName" value={form.lastName} onChange={updateField} required className="input" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} required className="input" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              required
              className="input"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
