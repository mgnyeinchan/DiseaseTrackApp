import API from './api';

export const getClinics = (
  page = 1,
  limit = 10,
  search = '',
  township_id?: number
) => {
  return API.get('/api/clinics', {
    params: { page, limit, search, township_id }
  });
};

export const createClinic = (data: any) =>
  API.post('/api/clinics', data);

export const updateClinic = (id: number, data: any) =>
  API.put(`/api/clinics/${id}`, data);

export const deleteClinic = (id: number) =>
  API.delete(`/api/clinics/${id}`);

export const getTownshipsDropdown = () =>
  API.get('/api/townships/dropdown');