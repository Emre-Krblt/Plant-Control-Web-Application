import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import apiClient, { getErrorMessage } from '../api/apiClient';
import { useAuth } from '../auth/AuthContext';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import SectionCard from '../components/SectionCard';
import SeverityBadge from '../components/SeverityBadge';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

const healthColors = {
  NORMAL: '#059669',
  WARNING: '#f59e0b',
  CRITICAL: '#dc2626',
};

const statCards = [
  { key: 'totalActivePlants', label: 'Total Plants', icon: 'TP', tone: 'emerald', helper: 'Currently monitored' },
  { key: 'normalPlants', label: 'Normal Plants', icon: 'OK', tone: 'emerald', helper: 'Healthy readings' },
  { key: 'warningPlants', label: 'Warning Plants', icon: 'WA', tone: 'amber', helper: 'Needs a check' },
  { key: 'criticalPlants', label: 'Critical Plants', icon: 'CR', tone: 'red', helper: 'Immediate attention' },
  { key: 'activeAlerts', label: 'Active Alerts', icon: 'AL', tone: 'sky', helper: 'Open notifications' },
];

function formatDate(value) {
  if (!value) {
    return 'No timestamp';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getDisplayName(user) {
  const candidate = user?.firstName || user?.displayName || user?.name;

  if (candidate) {
    return candidate.split(' ')[0];
  }

  return user?.email || 'there';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      setError('');

      try {
        const [dashboardResponse, plantsResponse] = await Promise.all([
          apiClient.get('/api/dashboard'),
          apiClient.get('/api/plants'),
        ]);
        setDashboard(dashboardResponse.data);
        setPlants(plantsResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const healthData = useMemo(
    () => [
      { name: 'NORMAL', value: dashboard?.normalPlants ?? 0 },
      { name: 'WARNING', value: dashboard?.warningPlants ?? 0 },
      { name: 'CRITICAL', value: dashboard?.criticalPlants ?? 0 },
    ],
    [dashboard],
  );

  const chartHasData = healthData.some((item) => item.value > 0);
  const needsAttention = plants.filter((plant) => ['WARNING', 'CRITICAL'].includes(plant.healthStatus)).slice(0, 5);
  const recentPlants = dashboard?.recentPlants ?? plants.slice(0, 5);
  const recentAlerts = dashboard?.recentActiveAlerts ?? [];

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-3xl bg-emerald-800 p-6 text-white shadow-sm shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">Plant Control</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {getDisplayName(user)}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
              Monitor your plants and sensor activity from one calm, focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/plants/new" className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50">
              Add Plant
            </Link>
            <Link to="/alerts" className="inline-flex items-center justify-center rounded-2xl border border-emerald-200/60 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
              View Alerts
            </Link>
            <Link to="/plants" className="inline-flex items-center justify-center rounded-2xl border border-emerald-200/60 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
              My Plants
            </Link>
          </div>
        </div>
      </section>

      <ErrorMessage message={error} />

      {dashboard && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((card) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={dashboard[card.key] ?? 0}
                icon={card.icon}
                tone={card.tone}
                helper={card.helper}
              />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <SectionCard title="Plant Health Overview" subtitle="Distribution by current plant health status">
              {chartHasData ? (
                <div className="grid gap-6 md:grid-cols-[minmax(220px,280px)_1fr] md:items-center">
                  <div className="flex justify-center">
                    <PieChart width={260} height={260}>
                      <Pie data={healthData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={4}>
                        {healthData.map((entry) => (
                          <Cell key={entry.name} fill={healthColors[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </div>
                  <div className="grid gap-3">
                    {healthData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: healthColors[item.name] }} />
                          <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-950">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No health data yet"
                  message="Add plants and generate sensor readings to see the health distribution."
                  action={<Link to="/plants/new" className="btn-primary">Add Plant</Link>}
                />
              )}
            </SectionCard>

            <SectionCard
              title="Needs Attention"
              subtitle="Warning and critical plants from your collection"
              action={<Link to="/plants" className="btn-secondary">View all plants</Link>}
            >
              {needsAttention.length ? (
                <div className="grid gap-3">
                  {needsAttention.map((plant) => (
                    <article key={plant.id} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-950">{plant.name}</h3>
                            <StatusBadge value={plant.healthStatus} />
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            {plant.plantType || 'Plant'} {plant.location ? `in ${plant.location}` : 'without a location'}
                          </p>
                        </div>
                        <Link to={`/plants/${plant.id}`} className="btn-secondary">Details</Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No plants need attention" message="Plants with warning or critical status will appear here." />
              )}
            </SectionCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              title="Recent Active Alerts"
              subtitle="Latest open alerts across your monitored plants"
              action={<Link to="/alerts" className="btn-secondary">View alerts</Link>}
            >
              {recentAlerts.length ? (
                <div className="grid gap-3">
                  {recentAlerts.map((alert) => (
                    <article key={alert.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <SeverityBadge value={alert.severity} />
                            <StatusBadge value={alert.status} />
                          </div>
                          <h3 className="mt-3 font-bold text-slate-950">{alert.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{alert.plantName || 'Unknown plant'}</p>
                          <p className="mt-2 text-xs font-medium text-slate-400">{formatDate(alert.createdAt)}</p>
                        </div>
                        {alert.plantId && <Link to={`/plants/${alert.plantId}`} className="btn-secondary">Plant</Link>}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No active alerts" message="Everything looks calm right now. New active alerts will appear here." />
              )}
            </SectionCard>

            <SectionCard
              title="Recent Plants"
              subtitle="Recently added plants in your monitoring workspace"
              action={<Link to="/plants" className="btn-secondary">My Plants</Link>}
            >
              {recentPlants.length ? (
                <div className="grid gap-3">
                  {recentPlants.map((plant) => (
                    <Link
                      key={plant.id}
                      to={`/plants/${plant.id}`}
                      className="rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-950">{plant.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {plant.plantType || 'Plant'} {plant.location ? `- ${plant.location}` : '- No location'}
                          </p>
                        </div>
                        <StatusBadge value={plant.healthStatus} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No plants yet"
                  message="Add your first plant to begin monitoring sensors and alerts."
                  action={<Link to="/plants/new" className="btn-primary">Add Plant</Link>}
                />
              )}
            </SectionCard>
          </section>
        </>
      )}
    </div>
  );
}
