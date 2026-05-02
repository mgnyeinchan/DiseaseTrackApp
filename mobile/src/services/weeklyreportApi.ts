import API from './api';

export const getWeeklyReports = (
  page = 1,
  limit = 10,
  year?: number,
  week?: number,
  facility_id?: number
) => {
  return API.get('/api/weeklyreports', {
    params: { page, limit, year, week, facility_id }
  });
};

export const getWeeklyReportById = (id: number) => {
  return API.get(`/api/weeklyreports/${id}`);
};

export const createWeeklyReport = (data: any) =>
  API.post('/api/weeklyreports', data);

export const updateWeeklyReport = (id: number, data: any) =>
  API.put(`/api/weeklyreports/${id}`, data);

export const deleteWeeklyReport = (id: number) =>
  API.delete(`/api/weeklyreports/${id}`);