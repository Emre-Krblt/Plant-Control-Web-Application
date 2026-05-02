import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import ErrorMessage from '../components/ErrorMessage';

const initialForm = {
  name: '',
  plantType: '',
  location: '',
  description: '',
  imageUrl: '',
  plantedDate: '',
};

export default function PlantCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await apiClient.post('/api/plants', {
        ...form,
        imageUrl: form.imageUrl || null,
      });
      navigate('/plants');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PlantForm
      title="Add Plant"
      subtitle="Create a new plant profile for monitoring."
      form={form}
      error={error}
      submitting={submitting}
      submitLabel="Create Plant"
      onChange={updateField}
      onSubmit={handleSubmit}
    />
  );
}

export function PlantForm({ title, subtitle, form, error, submitting, submitLabel, onChange, onSubmit }) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Plant profile</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="grid gap-6">
            <ErrorMessage message={error} />
            <div className="grid gap-5 md:grid-cols-2">
              <label className="field-label">
                Name
                <input name="name" value={form.name} onChange={onChange} required className="input" placeholder="Monstera" />
              </label>
              <label className="field-label">
                Plant type
                <input name="plantType" value={form.plantType} onChange={onChange} required className="input" placeholder="Monstera deliciosa" />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="field-label">
                Location
                <input name="location" value={form.location} onChange={onChange} className="input" placeholder="Living room" />
              </label>
              <label className="field-label">
                Planted date
                <input name="plantedDate" type="date" value={form.plantedDate || ''} onChange={onChange} className="input" />
              </label>
            </div>
            <label className="field-label">
              Image URL
              <input name="imageUrl" value={form.imageUrl || ''} onChange={onChange} className="input" placeholder="https://..." />
            </label>
            <label className="field-label">
              Description
              <textarea
                name="description"
                value={form.description || ''}
                onChange={onChange}
                rows="6"
                className="input resize-none"
                placeholder="Care notes, placement, or growth observations"
              />
            </label>
            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="btn-primary h-12 px-6 text-base">
                {submitting ? 'Saving...' : submitLabel}
              </button>
            </div>
          </div>
        </section>

        <aside className="glass-panel rounded-3xl p-6">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-100 shadow-inner shadow-emerald-950/5">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt={form.name || 'Plant preview'} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center px-8 text-center text-2xl font-black text-emerald-900">
                Plant preview
              </div>
            )}
          </div>
          <div className="mt-5 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
            <h2 className="text-2xl font-black text-slate-950">{form.name || 'New plant'}</h2>
            <p className="mt-1 text-lg font-semibold text-slate-700">{form.plantType || 'Plant type'}</p>
            <p className="mt-3 text-sm font-semibold text-slate-500">{form.location || 'Location not set'}</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This preview uses the same profile fields that appear on the plant cards.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
