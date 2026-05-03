import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const severityStyles = {
  CRITICAL: {
    accent: 'border-red-200 bg-red-50/60 text-red-800',
    dot: 'bg-red-500',
    ring: 'ring-red-100',
  },
  WARNING: {
    accent: 'border-amber-200 bg-amber-50/70 text-amber-800',
    dot: 'bg-amber-500',
    ring: 'ring-amber-100',
  },
  INFO: {
    accent: 'border-sky-200 bg-sky-50/70 text-sky-800',
    dot: 'bg-sky-500',
    ring: 'ring-sky-100',
  },
};

function formatLabel(value) {
  if (!value) {
    return 'Unknown';
  }

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    return value;
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(number);
}

function formatDate(value) {
  if (!value) {
    return 'No timestamp';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getThresholdText(alert) {
  const min = alert.thresholdMin;
  const max = alert.thresholdMax;

  if (min !== null && min !== undefined && max !== null && max !== undefined) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  if (min !== null && min !== undefined) {
    return `Min ${formatNumber(min)}`;
  }

  if (max !== null && max !== undefined) {
    return `Max ${formatNumber(max)}`;
  }

  return 'Not set';
}

function AlertMetric({ label, value, tone = '' }) {
  return (
    <div className={`rounded-3xl border border-emerald-100 bg-white/80 px-5 py-4 shadow-sm shadow-emerald-950/5 ${tone}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function AlertCard({ alert, working, onUpdate }) {
  const severity = alert.severity || 'INFO';
  const styles = severityStyles[severity] || severityStyles.INFO;

  return (
    <article className={`glass-panel overflow-hidden rounded-3xl border-l-8 ${styles.accent}`}>
      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_220px] xl:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-black ring-4 ${styles.accent} ${styles.ring}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
              {formatLabel(severity)}
            </span>
            <StatusBadge value={alert.status} />
            {alert.sensorType && <StatusBadge value={alert.sensorType} />}
          </div>

          <h2 className="mt-4 break-words text-3xl font-black leading-tight tracking-tight text-slate-950">
            {alert.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-slate-600">{alert.message}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <AlertMetric
              label="Plant"
              value={
                alert.plantId ? (
                  <Link to={`/plants/${alert.plantId}`} className="text-emerald-800 underline-offset-4 hover:underline">
                    {alert.plantName || 'Unknown plant'}
                  </Link>
                ) : (
                  alert.plantName || 'Unknown plant'
                )
              }
            />
            <AlertMetric label="Current Value" value={formatNumber(alert.currentValue)} tone="bg-amber-50/70" />
            <AlertMetric label="Healthy Range" value={getThresholdText(alert)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-500">
            <span>Sensor: {formatLabel(alert.sensorType)}</span>
            <span>Type: {formatLabel(alert.alertType)}</span>
            <span>Created: {formatDate(alert.createdAt)}</span>
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl bg-white/72 p-4 ring-1 ring-emerald-100">
          <Link to={`/plants/${alert.plantId}`} className="btn-secondary h-12 text-base">
            Open Plant
          </Link>
          <button
            type="button"
            onClick={() => onUpdate(alert.id, 'resolve')}
            disabled={working}
            className="btn-primary h-12 text-base"
          >
            {working ? 'Working...' : 'Resolve'}
          </button>
          <button
            type="button"
            onClick={() => onUpdate(alert.id, 'ignore')}
            disabled={working}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          >
            Ignore
          </button>
        </div>
      </div>
    </article>
  );
}

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

  const summary = useMemo(() => {
    const critical = alerts.filter((alert) => alert.severity === 'CRITICAL').length;
    const warning = alerts.filter((alert) => alert.severity === 'WARNING').length;
    return { critical, warning, total: alerts.length };
  }, [alerts]);

  if (loading) {
    return <LoadingSpinner label="Loading alerts..." />;
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Attention</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">Active Alerts</h1>
          <p className="mt-3 max-w-2xl text-lg font-medium text-slate-600">
            Review the plants that need care, compare their current readings, and resolve alerts when the issue is handled.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-3xl bg-white/80 p-3 shadow-lg shadow-emerald-950/5 ring-1 ring-white/80">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{summary.total}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Warning</p>
            <p className="mt-1 text-2xl font-black text-amber-800">{summary.warning}</p>
          </div>
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-red-700">Critical</p>
            <p className="mt-1 text-2xl font-black text-red-800">{summary.critical}</p>
          </div>
        </div>
      </section>

      <ErrorMessage message={error} />

      <section className="grid gap-5">
        {alerts.length ? (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              working={workingId === alert.id}
              onUpdate={updateAlert}
            />
          ))
        ) : (
          <section className="glass-panel rounded-3xl p-8">
            <EmptyState title="No active alerts" message="Everything looks calm right now. New alerts will appear here with plant, sensor, and reading details." />
          </section>
        )}
      </section>
    </div>
  );
}
