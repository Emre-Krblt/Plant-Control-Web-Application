import axios from 'axios';

const TOKEN_KEY = 'plantControlToken';
const USER_KEY = 'plantControlUser';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  const data = error.response?.data;

  if (!data) {
    return error.message || 'Something went wrong.';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (data.message) {
    return data.message;
  }

  if (data.error) {
    return data.error;
  }

  const fieldErrors = Object.values(data).flat().filter(Boolean);
  if (fieldErrors.length > 0) {
    return fieldErrors.join(' ');
  }

  return 'Something went wrong.';
}

export { TOKEN_KEY, USER_KEY };
export default apiClient;
