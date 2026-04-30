import API from './api';

export const getFacilities = (
  page = 1,
  limit = 10,
  search = '',
  div_id?: number,
  tsp_id?: number,
  org_id?: number
) => {
  return API.get('/api/facilities', {
    params: {
      page,
      limit,
      search,
      div_id,
      tsp_id,
      org_id
    }
  });
};

export const createFacility = (data: any) =>
  API.post('/api/facilities', data);

export const updateFacility = (id: number, data: any) =>
  API.put(`/api/facilities/${id}`, data);

export const deleteFacility = (id: number) =>
  API.delete(`/api/facilities/${id}`);

export const getDivisionsDropdown = () =>
  API.get('/api/divisions/dropdown');

export const getTownshipsDropdown = () =>
  API.get('/api/townships/dropdown');

export const getOrgsDropdown = () =>
  API.get('/api/orgs/dropdown');

export const getFacilitiesDropdown = () =>
  API.get('/api/facilities/dropdown');