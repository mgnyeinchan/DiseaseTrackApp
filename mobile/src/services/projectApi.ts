import API from './api';

// GET all
export const getProjects = (page = 1, limit = 10, search = '', status = '') => {
  return API.get('/api/projects', {
    params: {
      page,
      limit,
      search,
      status
    }
  });
};

// GET by id
export const getProjectById = async (id: number) => {
  const res = await API.get(`/api/projects/${id}`);
  return res.data;
};

// CREATE
export const createProject = async (data: any) => {
  const res = await API.post('/api/projects', data);
  return res.data;
};

// UPDATE
export const updateProject = async (id: number, data: any) => {
  const res = await API.put(`/api/projects/${id}`, data);
  return res.data;
};

// DELETE
export const deleteProject = async (id: number) => {
  const res = await API.delete(`/api/projects/${id}`);
  return res.data;
};