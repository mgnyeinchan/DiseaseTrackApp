-- =========================
-- tbl_org
-- =========================
INSERT INTO tbl_org (org_code, org_name, org_shortname) VALUES
('ORG001', 'Ministry of Health', 'MOH'),
('ORG002', 'World Health Organization', 'WHO'),
('ORG003', 'UNICEF Myanmar', 'UNICEF');

-- =========================
-- tbl_division
-- =========================
INSERT INTO tbl_division (div_code, div_name, div_namemm) VALUES
('YGN', 'Yangon Division', 'ရန်ကုန်တိုင်း'),
('MDY', 'Mandalay Division', 'မန္တလေးတိုင်း'),
('BGO', 'Bago Division', 'ပဲခူးတိုင်း');

-- =========================
-- tbl_township
-- =========================
INSERT INTO tbl_township (tsp_code, tsp_name, tps_div_id) VALUES
('YGN-01', 'Hlaing', 1),
('YGN-02', 'Insein', 1),
('MDY-01', 'Chanayethazan', 2),
('BGO-01', 'Bago Township', 3);

-- =========================
-- tbl_village
-- =========================
INSERT INTO tbl_village (
    village_code,
    village_name,
    village_namemm,
    village_malepop,
    village_femalepop,
    village_latitude,
    village_longitude,
    village_household,
    village_tsp_id,
    village_status,
    village_remark
) VALUES
('V001', 'Thar Yar Kone', 'သာယာကုန်း', 500, 520, 16.8661, 96.1951, 200, 1, 1, 'Urban area'),
('V002', 'Shwe Pyi Thar', 'ရွှေပြည်သာ', 800, 850, 16.9000, 96.1500, 350, 2, 1, 'Industrial zone'),
('V003', 'Myay Ni Gone', 'မြေနီကုန်း', 600, 630, 21.9588, 96.0891, 250, 3, 1, 'Downtown area'),
('V004', 'Bago Village', 'ပဲခူးရွာ', 400, 420, 17.3350, 96.4810, 150, 4, 1, 'Rural area');

-- =========================
-- tbl_clinic
-- =========================
INSERT INTO tbl_clinic (cln_code, cln_name, cln_tsp_id) VALUES
('CLN001', 'Hlaing Health Center', 1),
('CLN002', 'Insein General Clinic', 2),
('CLN003', 'Mandalay Central Clinic', 3),
('CLN004', 'Bago Township Clinic', 4);

INSERT INTO tbl_project (
    project_code, project_name, project_funder,
    project_startdate, project_enddate,
    project_description, project_status
) VALUES
('PRJ-001', 'Malaria Control Program', 'WHO', '2023-01-01', '2025-12-31', 'Malaria prevention and treatment', 1),
('PRJ-002', 'Maternal Health Improvement', 'UNICEF', '2022-06-01', '2026-05-30', 'Support for maternal healthcare', 1),
('PRJ-003', 'COVID-19 Response', 'MOH', '2020-03-01', '2023-12-31', 'Pandemic response and vaccination', 0),
('PRJ-004', 'Nutrition Support Program', 'SCM', '2024-01-01', '2027-12-31', 'Child nutrition improvement', 1);

