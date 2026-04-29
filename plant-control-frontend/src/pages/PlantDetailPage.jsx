import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import SectionCard from '../components/SectionCard';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';

function formatDate(value) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatShortDate(value) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || 'Not set'}</p>
    </div>
  );
}

export default function PlantDetailPage() {
  const { plantId } = useParams();
  const [plant, setPlant] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [generatedReadings, setGeneratedReadings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    setError('');

    try {
      const [plantResponse, sensorsResponse, alertsResponse] = await Promise.all([
        apiClient.get(`/api/plants/${plantId}`),
        apiClient.get(`/api/plants/${plantId}/sensors`),
        apiClient.get(`/api/plants/${plantId}/alerts`),
      ]);
      setPlant(plantResponse.data);
      setSensors(sensorsResponse.data);
      setAlerts(alertsResponse.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const generateReadings = async () => {
    setWorking(true);
    setError('');

    try {
      const { data } = await apiClient.post(`/api/plants/${plantId}/sensor-readings/generate`);
      setGeneratedReadings(data);
      await fetchDetails();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setWorking(false);
    }
  };

  const updateAlert = async (alertId, action) => {
    setWorking(true);
    setError('');

    try {
      await apiClient.put(`/api/alerts/${alertId}/${action}`);
      await fetchDetails();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading plant details..." />;
  }

  return (
    <div className="grid gap-6">
      <ErrorMessage message={error} />

      {plant && (
        <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-sm shadow-emerald-950/5">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {plant.plantType || 'Plant'}
                  </p>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{plant.name}</h1>
                  <p className="mt-3 max-w-3xl text-slate-500">
                    {plant.description || 'No description has been added for this plant yet.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={plant.healthStatus} />
                  <Link to={`/plants/${plant.id}/edit`} className="btn-secondary">
                    Edit
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DetailItem label="Location" value={plant.location} />
                <DetailItem label="Planted" value={formatShortDate(plant.plantedDate)} />
                <DetailItem label="Active" value={plant.active ? 'Yes' : 'No'} />
                <DetailItem label="Updated" value={formatDate(plant.updatedAt)} />
              </div>
            </div>

            <div className="bg-emerald-50 p-6 sm:p-8">
              <div className="rounded-3xl bg-white p-5 shadow-sm shadow-emerald-950/5">
                <p className="text-sm font-semibold text-slate-500">Monitoring Summary</p>
                <div className="mt-5 grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Sensors</span>
                    <span className="font-bold text-slate-950">{sensors.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Connected</span>
                    <span className="font-bold text-slate-950">{sensors.filter((sensor) => sensor.connected).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Active alerts</span>
                    <span className="font-bold text-slate-950">{alerts.filter((alert) => alert.status === 'ACTIVE').length}</span>
                  </div>
                </div>
                <button type="button" onClick={generateReadings} disabled={working} className="btn-primary mt-6 w-full">
                  {working ? 'Generating...' : 'Generate Simulated Readings'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <SectionCard
        title="Sensors"
        subtitle="Configured thresholds, connection state, and latest sensor status"
        action={
          <button type="button" onClick={generateReadings} disabled={working} className="btn-primary">
            {working ? 'Generating...' : 'Generate Simulated Readings'}
          </button>
        }
      >
        {sensors.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
              <span>Sensor</span>
              <span>Connected</span>
              <span>Threshold</span>
              <span>Unit</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-100">
              {sensors.map((sensor) => (
                <div key={sensor.id} className="grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] md:items-center">
                  <div>
                    <p className="font-bold text-slate-950">{sensor.sensorType}</p>
                    <p className="mt-1 text-xs text-slate-400">Updated {formatDate(sensor.updatedAt)}</p>
                  </div>
                  <StatusBadge value={sensor.connected ? 'CONNECTED' : 'DISCONNECTED'} />
                  <p className="text-sm font-semibold text-slate-700">
                    {sensor.minThreshold} - {sensor.maxThreshold}
                  </p>
                  <p className="text-sm text-slate-500">{sensor.unit || 'No unit'}</p>
                  <StatusBadge value={sensor.lastStatus} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="No sensors found" message="Sensors configured for this plant will appear here." />
        )}
      </SectionCard>

      {generatedReadings && (
        <SectionCard
          title="Generated Readings"
          subtitle="Latest simulated readings returned by the backend"
          action={<StatusBadge value={generatedReadings.plantHealthStatus} />}
        >
          {generatedReadings.readings?.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {generatedReadings.readings.map((reading) => (
                <article key={reading.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{reading.sensorType}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        {reading.value} <span className="text-base text-slate-500">{reading.unit}</span>
                      </p>
                    </div>
                    <StatusBadge value={reading.readingStatus} />
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    {reading.source || 'SIMULATED'} at {formatDate(reading.recordedAt)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No readings returned" message="The generate action completed, but no readings were returned." />
          )}
        </SectionCard>
      )}

      <SectionCard title="Sensor Trends" subtitle="Time-series charts can be added when reading history is available">
        <EmptyState
          title="Sensor history endpoint required"
          message="Sensor history endpoint is required to display time-series charts."
        />
      </SectionCard>

      <SectionCard title="Alerts" subtitle="Recent alert history for this plant">
        {alerts.length ? (
          <div className="grid gap-3">
            {alerts.map((alert) => (
              <article key={alert.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <SeverityBadge value={alert.severity} />
                      <StatusBadge value={alert.status} />
                      {alert.sensorType && <StatusBadge value={alert.sensorType} />}
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-950">{alert.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{alert.message}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
                      <span>Created {formatDate(alert.createdAt)}</span>
                      {alert.currentValue !== null && alert.currentValue !== undefined && (
                        <span>Current value {alert.currentValue}</span>
                      )}
                    </div>
                  </div>
                  {alert.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateAlert(alert.id, 'resolve')}
                        disabled={working}
                        className="btn-secondary"
                      >
                        Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAlert(alert.id, 'ignore')}
                        disabled={working}
                        className="btn-secondary"
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No alerts for this plant" message="Alert history will appear here when thresholds are exceeded." />
        )}
      </SectionCard>
    </div>
  );
}
