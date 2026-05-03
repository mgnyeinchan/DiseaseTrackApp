import API from './api';

export const getSurveillance = (params: any) => {
  return API.get('/api/surveillance', { params });
};

export const getSurveillanceById = (id: number) =>
  API.get(`/api/surveillance/${id}`);

export const deleteSurveillance = (id: number) =>
  API.delete(`/api/surveillance/${id}`);

export const createSurveillance = (data: any) =>
  API.post('/api/surveillance', data);

export const updateSurveillance = (id: number, data: any) =>
  API.put(`/api/surveillance/${id}`, data);

// dropdowns
export const getFacilities = () => API.get('/api/facilities/dropdown');
export const getTownships = () => API.get('/api/townships/dropdown');
export const getAgegroups = () => API.get('/api/agegroups/dropdown');
export const getSources = () => API.get('/api/awarenesssources/dropdown');