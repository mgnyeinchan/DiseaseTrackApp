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