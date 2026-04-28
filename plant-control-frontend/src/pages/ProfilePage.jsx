import { useEffect, useState } from 'react';
import { getErrorMessage } from '../api/apiClient';
import { useAuth } from '../auth/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(!user?.firstName);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        await refreshUser();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    if (!user?.firstName) {
      fetchProfile();
    }
  }, [refreshUser, user?.firstName]);

  if (loading) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Account</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Profile</h1>
      </div>

      <ErrorMessage message={error} />

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
        <div className="grid gap-5 md:grid-cols-2">
          <ProfileField label="Email" value={user?.email} />
          <ProfileField label="First name" value={user?.firstName} />
          <ProfileField label="Last name" value={user?.lastName} />
          <ProfileField label="Role" value={user?.role} />
          <div>
            <p className="text-sm font-semibold text-slate-500">Active</p>
            <div className="mt-2">
              <StatusBadge value={user?.active ? 'ACTIVE' : 'INACTIVE'} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value || '-'}</p>
    </div>
  );
}
