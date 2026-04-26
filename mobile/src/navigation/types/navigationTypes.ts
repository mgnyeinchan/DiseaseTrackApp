export type Project = {
  project_id: number;
  project_code: string;
  project_name: string;
  project_funder?: string;
  project_startdate?: string;
  project_enddate?: string;
  project_description?: string;
  project_status: number;
};

export type ProjectStackParamList = {
  ProjectList: undefined;
  ProjectForm: { project?: Project } | undefined;
};