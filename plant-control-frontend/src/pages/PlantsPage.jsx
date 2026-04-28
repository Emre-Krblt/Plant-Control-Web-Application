import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchPlants = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await apiClient.get('/api/plants');
      setPlants(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const deletePlant = async (plant) => {
    const confirmed = window.confirm(`Delete ${plant.name}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(plant.id);
    setError('');

    try {
      await apiClient.delete(`/api/plants/${plant.id}`);
      setPlants((current) => current.filter((item) => item.id !== plant.id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading plants..." />;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Collection</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">My Plants</h1>
        </div>
        <Link to="/plants/new" className="btn-primary">
          Add Plant
        </Link>
      </div>

      <ErrorMessage message={error} />

      {plants.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plants.map((plant) => (
            <article key={plant.id} className="rounded-2xl bg-white p-5 shadow-sm shadow-emerald-900/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{plant.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{plant.plantType}</p>
                  <p className="mt-1 text-sm text-slate-500">{plant.location || 'No location'}</p>
                </div>
                <StatusBadge value={plant.healthStatus} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/plants/${plant.id}`} className="btn-secondary">
                  Details
                </Link>
                <Link to={`/plants/${plant.id}/edit`} className="btn-secondary">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deletePlant(plant)}
                  disabled={deletingId === plant.id}
                  className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {deletingId === plant.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm shadow-emerald-900/5">
          <h2 className="text-xl font-bold text-slate-950">No plants yet</h2>
          <p className="mt-2 text-slate-500">Add your first plant to begin monitoring sensors and alerts.</p>
          <Link to="/plants/new" className="btn-primary mt-5 inline-flex">
            Add Plant
          </Link>
        </section>
      )}
    </div>
  );
}
