import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    setError('');

    try {
      const { data } = await apiClient.get('/api/alerts/active');
      setAlerts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const updateAlert = async (alertId, action) => {
    setWorkingId(alertId);
    setError('');

    try {
      await apiClient.put(`/api/alerts/${alertId}/${action}`);
      await fetchAlerts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setWorkingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading alerts..." />;
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Attention</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Active Alerts</h1>
      </div>

      <ErrorMessage message={error} />

      <section className="grid gap-4">
        {alerts.length ? (
          alerts.map((alert) => (
            <article key={alert.id} className="rounded-2xl bg-white p-5 shadow-sm shadow-emerald-900/5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={alert.severity} />
                    <StatusBadge value={alert.status} />
                    {alert.sensorType && <StatusBadge value={alert.sensorType} />}
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-slate-950">{alert.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    <Link to={`/plants/${alert.plantId}`} className="text-emerald-700 hover:text-emerald-800">
                      {alert.plantName}
                    </Link>
                    {alert.currentValue !== null && alert.currentValue !== undefined
                      ? ` - Current value: ${alert.currentValue}`
                      : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateAlert(alert.id, 'resolve')}
                    disabled={workingId === alert.id}
                    className="btn-secondary"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAlert(alert.id, 'ignore')}
                    disabled={workingId === alert.id}
                    className="btn-secondary"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-2xl bg-white p-8 text-center shadow-sm shadow-emerald-900/5">
            <h2 className="text-xl font-bold text-slate-950">No active alerts</h2>
            <p className="mt-2 text-slate-500">Everything looks calm right now.</p>
          </article>
        )}
      </section>
    </div>
  );
}
