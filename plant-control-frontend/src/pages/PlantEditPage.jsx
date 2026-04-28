import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../api/apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlantForm } from './PlantCreatePage';

export default function PlantEditPage() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPlant() {
      try {
        const { data } = await apiClient.get(`/api/plants/${plantId}`);
        setForm({
          name: data.name || '',
          plantType: data.plantType || '',
          location: data.location || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          plantedDate: data.plantedDate || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    fetchPlant();
  }, [plantId]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await apiClient.put(`/api/plants/${plantId}`, {
        ...form,
        imageUrl: form.imageUrl || null,
      });
      navigate(`/plants/${plantId}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading plant..." />;
  }

  return (
    <PlantForm
      title="Edit Plant"
      subtitle="Update plant details and care context."
      form={form}
      error={error}
      submitting={submitting}
      submitLabel="Save Changes"
      onChange={updateField}
      onSubmit={handleSubmit}
    />
  );
}
