import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

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
        <section className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{plant.plantType}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">{plant.name}</h1>
              <p className="mt-2 text-slate-500">{plant.location || 'No location'}</p>
              {plant.description && <p className="mt-4 max-w-3xl text-slate-600">{plant.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={plant.healthStatus} />
              <Link to={`/plants/${plant.id}/edit`} className="btn-secondary">
                Edit
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-slate-950">Sensors</h2>
          <button type="button" onClick={generateReadings} disabled={working} className="btn-primary">
            {working ? 'Working...' : 'Generate Simulated Readings'}
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Connected</th>
                <th className="py-3 pr-4">Min</th>
                <th className="py-3 pr-4">Max</th>
                <th className="py-3 pr-4">Unit</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sensors.map((sensor) => (
                <tr key={sensor.id}>
                  <td className="py-3 pr-4 font-semibold text-slate-900">{sensor.sensorType}</td>
                  <td className="py-3 pr-4">{sensor.connected ? 'Yes' : 'No'}</td>
                  <td className="py-3 pr-4">{sensor.minThreshold}</td>
                  <td className="py-3 pr-4">{sensor.maxThreshold}</td>
                  <td className="py-3 pr-4">{sensor.unit}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge value={sensor.lastStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!sensors.length && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No sensors found.</p>}
        </div>
      </section>

      {generatedReadings && (
        <section className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-950">Generated Readings</h2>
            <StatusBadge value={generatedReadings.plantHealthStatus} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {generatedReadings.readings?.map((reading) => (
              <article key={reading.id} className="rounded-xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-900">{reading.sensorType}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {reading.value} {reading.unit}
                </p>
                <div className="mt-3">
                  <StatusBadge value={reading.readingStatus} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
        <h2 className="text-xl font-bold text-slate-950">Alert History</h2>
        <div className="mt-5 grid gap-3">
          {alerts.length ? (
            alerts.map((alert) => (
              <article key={alert.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={alert.severity} />
                      <StatusBadge value={alert.status} />
                    </div>
                    <h3 className="mt-3 font-bold text-slate-950">{alert.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                  </div>
                  {alert.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateAlert(alert.id, 'resolve')} className="btn-secondary">
                        Resolve
                      </button>
                      <button type="button" onClick={() => updateAlert(alert.id, 'ignore')} className="btn-secondary">
                        Ignore
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No alerts for this plant.</p>
          )}
        </div>
      </section>
    </div>
  );
}
