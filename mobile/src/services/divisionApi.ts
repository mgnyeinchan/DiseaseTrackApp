import API from './api';

// GET all
export const getDivisions = (page = 1, limit = 10, search = '') => {
  return API.get('/api/divisions', {
    params: { page, limit, search }
  });
};

// GET by id
export const getDivisionById = async (id: number) => {
  const res = await API.get(`/api/divisions/${id}`);
  return res.data;
};

// CREATE
export const createDivision = async (data: any) => {
  const res = await API.post('/api/divisions', data);
  return res.data;
};

// UPDATE
export const updateDivision = async (id: number, data: any) => {
  const res = await API.put(`/api/divisions/${id}`, data);
  return res.data;
};

// DELETE
export const deleteDivision = async (id: number) => {
  const res = await API.delete(`/api/divisions/${id}`);
  return res.data;
};