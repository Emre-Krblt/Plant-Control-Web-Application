import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const statCards = [
  { key: 'totalActivePlants', label: 'Total Plants' },
  { key: 'normalPlants', label: 'Normal' },
  { key: 'warningPlants', label: 'Warning' },
  { key: 'criticalPlants', label: 'Critical' },
  { key: 'activeAlerts', label: 'Active Alerts' },
];

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data } = await apiClient.get('/api/dashboard');
        setDashboard(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Overview</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Dashboard</h1>
      </div>

      <ErrorMessage message={error} />

      {dashboard && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((card) => (
              <article key={card.key} className="rounded-2xl bg-white p-5 shadow-sm shadow-emerald-900/5">
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{dashboard[card.key] ?? 0}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-950">Recent Plants</h2>
                <Link to="/plants" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  View all
                </Link>
              </div>
              <div className="mt-5 grid gap-3">
                {dashboard.recentPlants?.length ? (
                  dashboard.recentPlants.map((plant) => (
                    <Link
                      key={plant.id}
                      to={`/plants/${plant.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{plant.name}</p>
                        <p className="text-sm text-slate-500">
                          {plant.plantType} {plant.location ? `- ${plant.location}` : ''}
                        </p>
                      </div>
                      <StatusBadge value={plant.healthStatus} />
                    </Link>
                  ))
                ) : (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No recent plants yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-950">Recent Active Alerts</h2>
                <Link to="/alerts" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  View alerts
                </Link>
              </div>
              <div className="mt-5 grid gap-3">
                {dashboard.recentActiveAlerts?.length ? (
                  dashboard.recentActiveAlerts.map((alert) => (
                    <article key={alert.id} className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{alert.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{alert.plantName}</p>
                        </div>
                        <StatusBadge value={alert.severity} />
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No active alerts.</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
