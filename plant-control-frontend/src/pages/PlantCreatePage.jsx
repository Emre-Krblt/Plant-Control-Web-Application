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
  const updateImageValue = (value) => {
    onChange({
      target: {
        name: 'imageUrl',
        value,
      },
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert('Please select an image smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateImageValue(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

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
            <div className="grid gap-3">
              <span className="field-label">
                Plant photo
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/45 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-2xl font-black text-emerald-800 shadow-sm shadow-emerald-950/5">
                    +
                  </span>
                  <span>
                    <span className="block text-base font-black text-slate-950">Choose photo from computer</span>
                    <span className="mt-1 block text-sm font-medium text-slate-500">PNG, JPG, or WEBP up to 2 MB</span>
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
                </label>
              </span>

              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => updateImageValue('')}
                  className="justify-self-start rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
                >
                  Remove photo
                </button>
              )}
            </div>
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
