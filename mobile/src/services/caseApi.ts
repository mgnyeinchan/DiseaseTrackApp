import API from './api';

// GET ALL
export const getCases = async () => {
  const res = await API.get('/api/cases');
  return res.data;
};

// GET ONE
export const getCaseById = async (id: number) => {
  const res = await API.get(`/api/cases/${id}`);
  return res.data;
};

// CREATE
export const createCase = async (data: any) => {
  const res = await API.post('/api/cases', data);
  return res.data;
};

// UPDATE
export const updateCase = async (id: number, data: any) => {
  const res = await API.put(`/api/cases/${id}`, data);
  return res.data;
};

// DELETE
export const deleteCase = async (id: number) => {
  const res = await API.delete(`/api/cases/${id}`);
  return res.data;
};