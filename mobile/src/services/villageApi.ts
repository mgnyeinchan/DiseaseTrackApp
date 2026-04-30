import API from './api';

export const getVillages = (
  page = 1,
  limit = 10,
  search = '',
  township_id?: number
) => {
  return API.get('/api/villages', {
    params: { page, limit, search, township_id }
  });
};

export const createVillage = (data: any) =>
  API.post('/api/villages', data);

export const updateVillage = (id: number, data: any) =>
  API.put(`/api/villages/${id}`, data);

export const deleteVillage = (id: number) =>
  API.delete(`/api/villages/${id}`);

export const getTownshipsDropdown = () =>
  API.get('/api/townships/dropdown');

export const getVillagesDropdown = () =>
  API.get('/api/villages/dropdown');