import API from './api';

export const getCasebases = (
  page = 1,
  limit = 10,
  search = '',
  filters: any = {}
) => {
  return API.get('/api/casebases', {
    params: {
      page,
      limit,
      search,
      ...filters
    }
  });
};
// casebaseApi.ts
export const getCasebaseById = (id: number) =>
  API.get(`/api/casebases/${id}`);

export const createCasebase = (data: any) =>
  API.post('/api/casebases', data);

export const updateCasebase = (id: number, data: any) =>
  API.put(`/api/casebases/${id}`, data);

export const deleteCasebase = (id: number) =>
  API.delete(`/api/casebases/${id}`);