import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const healthTone = {
  NORMAL: { label: 'Great', bar: 84, className: 'bg-emerald-500' },
  WARNING: { label: 'Check', bar: 58, className: 'bg-amber-500' },
  CRITICAL: { label: 'Urgent', bar: 28, className: 'bg-red-500' },
  NO_DATA: { label: 'No data', bar: 38, className: 'bg-slate-400' },
};

function getPlantInitials(name) {
  return (name || 'Plant')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatShortDate(value) {
  if (!value) {
    return 'Date not set';
  }

  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function getAgeText(value) {
  if (!value) {
    return 'Planting date missing';
  }

  const planted = new Date(value);
  const days = Math.max(0, Math.floor((Date.now() - planted.getTime()) / 86400000));

  if (days < 30) {
    return `${days || 1} day${days === 1 ? '' : 's'} in care`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} in care`;
}

function CareMeter({ label, value, tone = 'bg-emerald-500' }) {
  return (
    <div className="grid grid-cols-[84px_1fr_28px] items-center gap-3">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <span className={`block h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </span>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">OK</span>
    </div>
  );
}

function PlantImage({ plant }) {
  if (plant.imageUrl) {
    return <img src={plant.imageUrl} alt={plant.name} className="h-full w-full object-cover" />;
  }

  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-emerald-50 to-lime-100 text-3xl font-black text-emerald-800">
      {getPlantInitials(plant.name)}
    </div>
  );
}

function PlantCard({ plant, onDelete, deleting }) {
  const tone = healthTone[plant.healthStatus] || healthTone.NO_DATA;

  return (
    <article className="glass-panel overflow-hidden rounded-3xl">
      <div className="grid gap-0 sm:grid-cols-[210px_1fr]">
        <div className="p-5 pb-0 sm:pb-5">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-emerald-50 shadow-inner shadow-emerald-950/5">
            <PlantImage plant={plant} />
          </div>
          <div className="mx-2 -mt-5 relative">
            <div className="rounded-full bg-emerald-100 px-4 py-2 text-center text-sm font-bold text-emerald-950 ring-1 ring-emerald-200">
              Status: {tone.label}
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-black tracking-tight text-slate-950">{plant.name}</h2>
              <p className="mt-1 text-lg font-medium text-slate-700">{plant.plantType || 'Unknown plant type'}</p>
              <p className="mt-3 text-sm font-semibold text-slate-500">{plant.location || 'No location assigned'}</p>
            </div>
            <StatusBadge value={plant.healthStatus} />
          </div>

          <div className="grid gap-1 text-sm leading-6 text-slate-700">
            <p>Planted: {formatShortDate(plant.plantedDate)}</p>
            <p>{getAgeText(plant.plantedDate)}</p>
          </div>

          <div className="grid gap-3">
            <CareMeter label="Moisture" value={tone.bar} tone={tone.className} />
            <CareMeter label="Light" value={Math.min(tone.bar + 8, 92)} tone="bg-emerald-400" />
            <CareMeter label="Health" value={tone.bar} tone={tone.className} />
          </div>

          {plant.description && <p className="line-clamp-2 text-sm leading-6 text-slate-500">{plant.description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-emerald-100/80 bg-white/72 px-5 py-4">
        <Link to={`/plants/${plant.id}`} className="plant-action">
          <span className="plant-action-icon">i</span>
          Details
        </Link>
        <Link to={`/plants/${plant.id}/edit`} className="plant-action">
          <span className="plant-action-icon">e</span>
          Edit
        </Link>
        <Link to={`/plants/${plant.id}`} className="plant-action">
          <span className="plant-action-icon">s</span>
          Sensors
        </Link>
        <button type="button" onClick={() => onDelete(plant)} disabled={deleting} className="plant-action disabled:opacity-60">
          <span className="plant-action-icon bg-red-50 text-red-700 ring-red-100">x</span>
          {deleting ? 'Deleting' : 'Delete'}
        </button>
      </div>
    </article>
  );
}

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

  const plantStats = useMemo(() => {
    const healthy = plants.filter((plant) => plant.healthStatus === 'NORMAL').length;
    const attention = plants.filter((plant) => ['WARNING', 'CRITICAL'].includes(plant.healthStatus)).length;
    return { healthy, attention };
  }, [plants]);

  if (loading) {
    return <LoadingSpinner label="Loading plants..." />;
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Plant collection</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">My Plants</h1>
        </div>
        <Link to="/plants/new" className="btn-primary h-14 px-6 text-base">
          + Add Plant
        </Link>
        <div className="rounded-3xl bg-emerald-100/85 px-8 py-4 text-center text-2xl font-black text-emerald-900 ring-1 ring-emerald-200">
          Plants: {plants.length}
        </div>
      </section>

      <ErrorMessage message={error} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section>
          {plants.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {plants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onDelete={deletePlant}
                  deleting={deletingId === plant.id}
                />
              ))}
            </div>
          ) : (
            <section className="glass-panel rounded-3xl p-10 text-center">
              <h2 className="text-3xl font-black text-slate-950">No plants yet</h2>
              <p className="mx-auto mt-3 max-w-md text-slate-600">Add your first plant to begin monitoring sensors, alerts, and care status.</p>
              <Link to="/plants/new" className="btn-primary mt-6 inline-flex">
                Add Plant
              </Link>
            </section>
          )}
        </section>

        <aside className="grid content-start gap-6">
          <section className="glass-panel rounded-3xl overflow-hidden">
            <h2 className="bg-emerald-50/90 px-6 py-4 text-2xl font-black text-slate-950">Today</h2>
            <div className="grid gap-4 p-6 text-lg font-semibold text-slate-800">
              <div className="flex items-start gap-3">
                <span className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">W</span>
                <span>Check plants without fresh sensor data</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">A</span>
                <span>{plantStats.attention} plant{plantStats.attention === 1 ? '' : 's'} need attention</span>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-3xl overflow-hidden">
            <h2 className="bg-emerald-50/90 px-6 py-4 text-2xl font-black text-slate-950">Care Summary</h2>
            <div className="grid gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-600">Healthy plants</span>
                <span className="text-2xl font-black text-emerald-800">{plantStats.healthy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-600">Needs care</span>
                <span className="text-2xl font-black text-amber-700">{plantStats.attention}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-600">Total profiles</span>
                <span className="text-2xl font-black text-slate-950">{plants.length}</span>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-3xl overflow-hidden">
            <h2 className="bg-emerald-50/90 px-6 py-4 text-2xl font-black text-slate-950">Plant Tips</h2>
            <div className="grid gap-4 p-6 text-base leading-7 text-slate-700">
              <p>Use the image URL field to make each plant card easier to recognize.</p>
              <p>Keep location names consistent so indoor and balcony plants are easy to scan.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
