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
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Plant profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm shadow-emerald-900/5">
        <div className="grid gap-5">
          <ErrorMessage message={error} />
          <div className="grid gap-5 md:grid-cols-2">
            <label className="field-label">
              Name
              <input name="name" value={form.name} onChange={onChange} required className="input" />
            </label>
            <label className="field-label">
              Plant type
              <input name="plantType" value={form.plantType} onChange={onChange} required className="input" />
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="field-label">
              Location
              <input name="location" value={form.location} onChange={onChange} className="input" />
            </label>
            <label className="field-label">
              Planted date
              <input name="plantedDate" type="date" value={form.plantedDate || ''} onChange={onChange} className="input" />
            </label>
          </div>
          <label className="field-label">
            Image URL
            <input name="imageUrl" value={form.imageUrl || ''} onChange={onChange} className="input" />
          </label>
          <label className="field-label">
            Description
            <textarea
              name="description"
              value={form.description || ''}
              onChange={onChange}
              rows="4"
              className="input resize-none"
            />
          </label>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
