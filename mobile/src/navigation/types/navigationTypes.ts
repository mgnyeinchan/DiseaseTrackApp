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

export type Township = {
  tsp_id: number;
  tsp_code: string;
  tsp_name: string;
  tps_div_id: number;
  div_name?: string;
};

export type TownshipStackParamList = {
  TownshipList: undefined;
  TownshipForm: {
    township?: Township;
  };
};

type Village = {
  village_id: number;
  village_name: string;
  village_code: string;
  village_tsp_id: number;
};

export type VillageStackParamList = {
  VillageList: undefined;
  VillageForm: {
    village?: Village;
  };
};