import API from './api';

export const getTownships = (
  page = 1,
  limit = 10,
  search = '',
  division_id?: number
) => {
  return API.get('/api/townships', {
    params: {
      page,
      limit,
      search,
      division_id
    }
  });
};

export const createTownship = (data: any) =>
  API.post('/api/townships', data);

export const updateTownship = (id: number, data: any) =>
  API.put(`/api/townships/${id}`, data);

export const deleteTownship = (id: number) =>
  API.delete(`/api/townships/${id}`);

export const getDivisions = () =>
  API.get('/api/divisions/dropdown');