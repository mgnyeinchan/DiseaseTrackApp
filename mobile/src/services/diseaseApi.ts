import API from './api';

export const getDiseases = (
  page = 1,
  limit = 10,
  search = ''
) => {
  return API.get('/api/diseases', {
    params: { page, limit, search }
  });
};

export const createDisease = (data: any) =>
  API.post('/api/diseases', data);

export const updateDisease = (id: number, data: any) =>
  API.put(`/api/diseases/${id}`, data);

export const deleteDisease = (id: number) =>
  API.delete(`/api/diseases/${id}`);

export const getCasebaseDropdown = () =>
  API.get('/api/diseases/casebasedropdown');

export const getWeeklyDropdown = () =>
  API.get('/api/diseases/weeklydropdown');