import API from './api';

export const getOrgs = (page = 1, limit = 10, search = '') => {
  return API.get('/api/orgs', {
    params: { page, limit, search }
  });
};
export const getOrgById = async (id: number) => {
  const res = await API.get(`/api/orgs/${id}`);
  return res.data;
};
export const createOrg = (data: any) => {
  return API.post('/api/orgs', data);
};

export const updateOrg = (id: number, data: any) => {
  return API.put(`/api/orgs/${id}`, data);
};

export const deleteOrg = (id: number) => {
  return API.delete(`/api/orgs/${id}`);
};