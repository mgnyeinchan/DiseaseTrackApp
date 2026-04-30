CREATE TABLE tbl_cases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INT CHECK (age >= 0)
);

CREATE TABLE tbl_users (
    user_id SERIAL PRIMARY KEY,
    user_username TEXT UNIQUE NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    user_phone TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    user_role TEXT DEFAULT 'user',
    user_failed_attempts INT DEFAULT 0,
    user_is_locked BOOLEAN DEFAULT false,
    user_status INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_project (
    project_id SERIAL PRIMARY KEY,
    project_code VARCHAR(10),
    project_name VARCHAR(100),
    project_funder VARCHAR(10),
    project_startdate DATE,
    project_enddate DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    project_description VARCHAR(100),
    project_status SMALLINT
);

CREATE TABLE tbl_org (
    org_id SERIAL PRIMARY KEY,
    org_code VARCHAR(10),
    org_name VARCHAR(100),
    org_shortname VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tbl_division (
    div_id SERIAL PRIMARY KEY,
    div_code VARCHAR(7),
    div_name VARCHAR(100),
    div_namemm VARCHAR(225),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tbl_township (
    tsp_id SERIAL PRIMARY KEY,
    tsp_code VARCHAR(100),
    tsp_name VARCHAR(100),
    tps_div_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_township_division
        FOREIGN KEY (tps_div_id)
        REFERENCES tbl_division(div_id)
);

CREATE TABLE tbl_village (
    village_id SERIAL PRIMARY KEY,
    village_code VARCHAR(20),
    village_name VARCHAR(100),
    village_namemm VARCHAR(100),
    village_malepop INT,
    village_femalepop INT,
    village_latitude DOUBLE PRECISION,
    village_longitude DOUBLE PRECISION,
    village_household INT,
    village_tsp_id INT,
    village_status INT,
    village_remark VARCHAR(1000),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_village_township
        FOREIGN KEY (village_tsp_id)
        REFERENCES tbl_township(tsp_id)
);

CREATE TABLE tbl_clinic (
    cln_id SERIAL PRIMARY KEY,
    cln_code VARCHAR(100),
    cln_name VARCHAR(100),
    cln_tsp_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_clinic_township
        FOREIGN KEY (cln_tsp_id)
        REFERENCES tbl_township(tsp_id)
);

CREATE TABLE tbl_disease (
    disease_id SERIAL PRIMARY KEY,
    disease_name VARCHAR(255),
    disease_name_eng VARCHAR(255),
    disease_name_mm VARCHAR(255),
    disease_definition TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tbl_facility (
    facility_id SERIAL PRIMARY KEY,
    facility_code VARCHAR(50),
    facility_name VARCHAR(255),
    facility_div_id INT,
    facility_tsp_id INT,
    facility_org_id INT,
    facility_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_facility_div
        FOREIGN KEY (facility_div_id)
        REFERENCES tbl_division(div_id),

    CONSTRAINT fk_facility_tsp
        FOREIGN KEY (facility_tsp_id)
        REFERENCES tbl_township(tsp_id),

    CONSTRAINT fk_facility_org
        FOREIGN KEY (facility_org_id)
        REFERENCES tbl_org(org_id)
);

CREATE TABLE tbl_casebase (
    casebase_id SERIAL PRIMARY KEY,

    -- Reporter Info
    reporter_name VARCHAR(255),
    reporter_position VARCHAR(255),

    facility_id INT,

    -- Case Info
    visit_date DATE,

    patient_code VARCHAR(100),
    patient_name VARCHAR(255),
    gender SMALLINT, -- 1=Male, 2=Female

    age_year INT,
    age_month INT,

    father_name VARCHAR(255),
    mother_name VARCHAR(255),

    tsp_id INT,
    div_id INT,
    village_id INT,

    phone VARCHAR(20),

    disease_id INT,

    -- Image / Attachment
    attachment_url TEXT,
    
    remark VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- FK Constraints
    CONSTRAINT fk_case_facility
        FOREIGN KEY (facility_id)
        REFERENCES tbl_facility(facility_id),

    CONSTRAINT fk_case_tsp
        FOREIGN KEY (tsp_id)
        REFERENCES tbl_township(tsp_id),

    CONSTRAINT fk_case_div
        FOREIGN KEY (div_id)
        REFERENCES tbl_division(div_id),

    CONSTRAINT fk_case_village
        FOREIGN KEY (village_id)
        REFERENCES tbl_village(village_id),

    CONSTRAINT fk_case_disease
        FOREIGN KEY (disease_id)
        REFERENCES tbl_disease(disease_id)
);

CREATE TABLE tbl_afp (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    opv_ipv_vaccinated TEXT, -- ပိုလီယိုကာကွယ်ဆေး
    paralysis_duration TEXT, -- ပျော့ခွေ
    acute_paralysis TEXT, -- လတ်တလောအကြောသေ
    fever_within_3weeks TEXT,
    fever_onset_day TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_feverwithrash (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    mr_mmr_vaccinated TEXT,
    fever TEXT,
    rash TEXT,
    cough TEXT,
    runny_nose TEXT,
    red_eyes TEXT,
    joint_pain TEXT,
    lymph_nodes TEXT,
    other_symptoms TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_diphtheria (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    dpt_vaccine TEXT,
    fever_start_date DATE,
    fever TEXT,
    sore_throat TEXT,
    difficulty_swallowing TEXT,
    stridor TEXT,
    tonsil_swelling TEXT,
    voice_change TEXT,
    tachycardia TEXT,
    neck_swelling TEXT,
    weakness TEXT,
    membrane_present TEXT,
    complications TEXT,
    airway_block TEXT,
    myocarditis TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_nnt (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    tt_vaccinated TEXT,
    symptom_onset_date DATE,
    normal_breastfeeding TEXT,
    difficulty_feeding TEXT,
    stiffness TEXT,
    convulsion TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_aes (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    je_vaccine TEXT,
    onset_date DATE,
    rapid_onset TEXT,
    fever TEXT,
    paresis TEXT,
    headache TEXT,
    paralysis TEXT,
    neck_stiffness TEXT,
    seizure TEXT,
    mental_change TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_whoopingcough (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    dpt_vaccine TEXT,
    fever_start_date DATE,
    fever_days TEXT,
    cough TEXT,
    breathing_difficulty TEXT,
    paroxysm_date DATE,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_meningococcal (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    meningococcal_vaccine TEXT,
    onset_date DATE,
    rapid_onset TEXT,
    fever TEXT,
    diarrhea TEXT,
    headache TEXT,
    vomiting TEXT,
    shock TEXT,
    kernig_sign TEXT,
    mental_change TEXT,
    rash TEXT,
    convulsion TEXT,
    muscle_pain TEXT,
    anemia TEXT,
    neck_stiffness TEXT,
    clinical_diagnosis TEXT,
    travel_history TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);
CREATE TABLE tbl_suspectedcholera (
    id SERIAL PRIMARY KEY,
    casebase_id INT,
    disease_id INT,

    cholera_vaccine TEXT,
    onset_date DATE,
    diarrhea TEXT,
    vomiting TEXT,
    nausea TEXT,
    abdominal_pain TEXT,
    fever TEXT,
    headache TEXT,
    myalgia TEXT,
    other_symptoms TEXT,
    patient_status TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (casebase_id) REFERENCES tbl_casebase(casebase_id),
    FOREIGN KEY (disease_id) REFERENCES tbl_disease(disease_id)
);