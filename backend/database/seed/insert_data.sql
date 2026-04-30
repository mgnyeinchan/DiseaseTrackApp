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

--- 
--- test
INSERT INTO tbl_project (
    project_code,
    project_name,
    project_funder,
    project_startdate,
    project_enddate,
    project_description,
    project_status
)
SELECT
    'PRJ-' || gs,
    'Project ' || gs,
    'FND-' || (gs % 10),
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    'Load test data ' || gs,
    1
FROM generate_series(1, 50000) gs;

INSERT INTO tbl_org (
    org_code,
    org_name,
    org_shortname
)
SELECT
    'ORG-' || LPAD(gs::text, 3, '0'),
    'Organization ' || gs,
    'ORG' || gs
FROM generate_series(1, 500) gs;

INSERT INTO tbl_division (div_code, div_name)
SELECT
    'DIV-' || gs,
    'Division ' || gs
FROM generate_series(1, 10) gs;

INSERT INTO tbl_township (
    tsp_code,
    tsp_name,
    tps_div_id
)
SELECT
    'TSP-' || gs,
    'Township ' || gs,
    (SELECT div_id FROM tbl_division ORDER BY RANDOM() LIMIT 1)  -- 🔥 SAFE
FROM generate_series(1, 50) gs;

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
)
SELECT
    'VIL-' || gs,
    'Village ' || gs,
    'ရွာ ' || gs,
    (random() * 500)::int,
    (random() * 500)::int,
    16 + random(),
    96 + random(),
    (random() * 200)::int,
    (SELECT tsp_id FROM tbl_township ORDER BY RANDOM() LIMIT 1), -- 🔥 SAFE
    1,
    'Remark ' || gs
FROM generate_series(1, 500) gs;

INSERT INTO tbl_clinic (
    cln_code,
    cln_name,
    cln_tsp_id
)
SELECT
    'CLN-' || gs,
    'Clinic ' || gs,
    (SELECT tsp_id FROM tbl_township ORDER BY RANDOM() LIMIT 1) -- 🔥 SAFE
FROM generate_series(1, 100) gs;

-- =========================
-- tbl_disease
-- =========================
INSERT INTO tbl_disease (
    disease_name,
    disease_name_eng,
    disease_name_mm,
    disease_definition
) VALUES
-- 1 AFP
(
'လတ်တလောပျောခွေအကြောသေရောဂါ (AFP)',
'AFP',
'လတ်တလောပျောခွေအကြောသေရောဂါ',
'AFP (Acute Flaccid Paralysis) သံသယလူနာ (suspected case)
အသက် (၁၅) နှစ်အောက် ကလေးတစ်ဦး လတ်တလောပျော့ခွေ၍ အကြောသေဖြစ်ပွားလျှင် သို့မဟုတ် ဆရာဝန် မှ ပိုလီယိုအကြောသေရောဂါ ဖြစ်ပွားသည်ဟု သံသယရှိသူအားလုံးကို လတ်တလော ပျော့ခွေ-အကြောသေလူနာ အဖြစ် သတ်မှတ်ရမည်ဖြစ်ပါသည်။
(လတ်တလော (Acute) ဆိုသည်မှာ ၁ ရက်မှ ၁၀ ရက်အတွင်း အကြောသေ ဖြစ်ပွားလာခြင်းဖြစ်သည်)'
),

-- 2 Fever with Rash
(
'အနီကွက်ထွက်၍ဖျားနာခြင်း (Fever with Rash)',
'Fever with Rash',
'အနီကွက်ထွက်၍ဖျားနာခြင်း',
'Fever with rash သံသယလူနာ (suspected case)
မည်သူမဆို ဖျားခြင်းနှင့် အနီကွက်ထွက်ခြင်း၊ အဖုအပိန့်များပေါ်ခြင်း (အရည်ကြည်ဖုများ မဟုတ်ပါ) စသည့် ရောဂါလက္ခဏာများရှိပါက ဝက်သက်ရောဂါသံသယလူနာအဖြစ် သတ်မှတ်ပါမည်။
သို့မဟုတ် ကျန်းမာရေးဝန်ထမ်းတစ်ဦး သို့မဟုတ် ဆရာဝန်တစ်ဦးဦးမှ ဝက်သက်ရောဂါ ဖြစ်ပွားနေသည်ဟု သံသယရှိသူအား ဝက်သက်ရောဂါ သံသယလူနာအဖြစ် သတ်မှတ်ပါမည်။'
),

-- 3 Diphtheria
(
'ဆုံဆို့နာရောဂါ (Diphtheria)',
'Diphtheria',
'ဆုံဆို့နာရောဂါ',
'Diphtheria ဆုံဆို့နာရောဂါ သံသယလူနာ (suspected case)
အသက်ရှူလမ်းကြောင်း အထက်ပိုင်းဆိုင်ရာ ရောဂါလက္ခဏာများဖြစ်သော အာခေါင်ရောင်ခြင်း (Pharyngitis)၊ နှာခေါင်းနှင့် အာခေါင်ရောင်ခြင်း (nasopharyngitis)၊ အာသီးရောင်ခြင်း (Tonsilitis) သို့မဟုတ် အသံအိုးရောင်ခြင်း (laryngitis) တို့နှင့် အသံအိမ်၊ အာခေါင်၊ အာသီးတို့တွင် အမြှေးပါး တွယ်ကပ်နေပါက ဆုံဆို့နာရောဂါသံသယလူနာ ဟုသတ်မှတ်နိုင်ပါသည်။'
),

-- 4 NNT
(
'မွေးကင်းစမေးခိုင်ရောဂါ (NNT)',
'NNT',
'မွေးကင်းစမေးခိုင်ရောဂါ',
'Neonatal tetanus မွေးကင်းစကလေးမေးခိုင်ရောဂါ သံသယလူနာ (suspected case)
မွေးကင်းစကလေးတစ်ဦးသည် မွေးဖွားပြီးနှစ်ရက်အတွင်း ပုံမှန်အတိုင်း နို့စို့နိုင်၊ ငိုနိုင်ပြီး (၃) ရက်မှ (၂၈) ရက်အတွင်း မေးခိုင်ရောဂါလက္ခဏာများ ဖြစ်ပေါ်လာခြင်း သို့မဟုတ် သေဆုံးခြင်း
သို့မဟုတ် မွေးကင်းစကလေးတစ်ဦးသည် မွေးဖွားပြီး တစ်လအတွင်း အကြောင်းမရှိသေဆုံးခြင်း

မွေးကင်းစကလေးမေးခိုင်ရောဂါ အတည်ပြုလူနာ (Confirmed case)
သံသယလူနာတစ်ဦးကို စုံစမ်းစစ်ဆေးရာတွင် အောက်ပါအချက်များတွေ့ရှိပါက အတည်ပြုလူနာ ဟုသတ်မှတ်ပါသည်။
မွေးဖွားပြီး ၂ ရက်အတွင်း ပုံမှန်အတိုင်း နို့စို့နိုင်၊ ငိုနိုင်ခြင်း
မွေးစ ၃ ရက်မှ ၂၈ ရက်အတွင်း နို့မစို့နိုင်တော့ခြင်း
ကြွက်သားတောင့်တင်းခြင်း (Stiffness) နှင့်/ သို့မဟုတ် အကြောဆွဲခြင်း (Spasm) များ ဖြစ်ပေါ်လာခြင်း'
),

-- 5 AES
(
'လတ်တလောဦးနှောက်ရောင်ရောဂါ (AES)',
'AES',
'လတ်တလောဦးနှောက်ရောင်ရောဂါ',
'Acute encephalitis syndrome လတ်တလော ဦးနှောက်ရောင်ရောဂါလက္ခဏာစု သံသယလူနာ (suspected case)
မည်သည့်အသက်အရွယ်မဆို အချိန်မရွေး ရုတ်တရက် အပြင်းဖျားကာ အောက်ပါ အချက်တစ်ခု အနည်းဆုံးရှိရပါမည်။
စိတ်အခြေအနေပြောင်းလဲခြင်း (change in mental status၊ confusion၊ disorientation၊ coma or inability to talk)
ရုတ်တရက်တက်ခြင်း (new onset of seizures) (simple febrile seizures မဖြစ်ရပါ)'
),

-- 6 Whooping Cough
(
'ကြက်ညှာချောင်းဆိုးရောဂါ (Whooping Cough)',
'Whooping Cough',
'ကြက်ညှာချောင်းဆိုးရောဂါ',
'Whooping cough ကြက်ညှာချောင်းဆိုးရောဂါ သံသယလူနာ (suspected case)
နှစ်ပတ်နှင့်အထက် ချောင်းဆိုးနေပြီး အောက်ပါရောဂါလက္ခဏာများ တစ်ခုမဟုတ်တစ်ခု ရှိနေပါက သံသယလူနာ ဟုသတ်မှတ်နိုင်ပါသည်။
paroxysms of coughing
post-tussive vomiting
inspiratory whooping
apnoea (အသက် တစ်နှစ်အောက်ကလေးများတွင်သာ)'
),

-- 7 Meningococcal
(
'ကူးစက်မြန် ဦးနှောက်မြှေးရောင်ရောဂါ (Meningococcal meningitis)',
'Meningococcal meningitis',
'ကူးစက်မြန် ဦးနှောက်မြှေးရောင်ရောဂါ',
'Meningococcal ကူးစက်မြန် ဦးနှောက်ရောင်ရောဂါ သံသယလူနာ (probable case)
ဦးနှောက် အမြှေးရောင်ခြင်း (သို့) သွေးဆိပ်တက်ခြင်း စသည့် လက္ခဏာများအပြင် အောက်ပါတို့မှ အနည်းဆုံး တစ်ချက်ရှိခြင်း
အနီစက်များထွက်ခြင်း
gram negative diplococci တွေ့ရှိခြင်း
Neisseria meningitidis ရောဂါပိုး တွေ့ရှိခြင်း'
),

-- 8 Cholera
(
'ပြင်းထန်ဝမ်းပျက်ဝမ်းလျှောရောဂါ (Suspected Cholera)',
'Suspected Cholera',
'ပြင်းထန်ဝမ်းပျက်ဝမ်းလျှောရောဂါ',
'Cholera ပြင်းထန်ဝမ်းပျက်ဝမ်းလျှောရောဂါ သံသယလူနာ (Suspected Case)
အသက် (၂) နှစ်နှင့်အထက် လူတစ်ဦး လတ်တလော ဝမ်းပျက်ဝမ်းလျှောခြင်းနှင့် ပြင်းထန်ရေဓာတ်ခမ်းခြောက်မှု ဖြစ်ပွားခြင်း
သို့မဟုတ် လတ်တလော ဝမ်းပျက်ဝမ်းလျှောရောဂါဖြင့် သေဆုံးခြင်း
ကာလဝမ်းရောဂါဖြစ်ပွားသော နေရာများတွင် ဝမ်းပျက်ဝမ်းလျှောခြင်း ဖြစ်ပွားခြင်း'
);

INSERT INTO tbl_facility (
    facility_code,
    facility_name,
    facility_div_id,
    facility_tsp_id,
    facility_org_id,
    facility_type
) VALUES
('FACI-0001', 'KCC Hospital', 1, 1, 1, 'Hospital'),
('FACI-0002', 'TMH Hospital', 2, 2, 2, 'Hospital'),
('FACI-0003', 'O1 Hospital', 3, 3, 3, 'Hospital'),
('FACI-0004', 'Nway Oo Guru', 4, 4, 4, 'Clinic'),
('FACI-0005', 'See Mee Lar', 5, 5, 5, 'Clinic'),
('FACI-0006', 'Nway Oo Arr Man Clinic', 1, 2, 3, 'Clinic'),
('FACI-0007', 'Nway Oo Kyan Mar Hospital', 2, 3, 4, 'Hospital'),
('FACI-0008', 'Thar Day Kho', 3, 4, 5, 'Clinic'),
('FACI-0009', 'Saw Pa Htan', 4, 5, 1, 'Clinic'),
('FACI-0010', 'Law Pa Law Kho', 5, 1, 2, 'Clinic'),
('FACI-0011', 'Ho Seit', 1, 3, 5, 'Hospital'),
('FACI-0012', 'Romio', 2, 4, 1, 'Clinic'),
('FACI-0013', 'Thar Yar', 3, 5, 2, 'Clinic'),
('FACI-0014', 'Nan Man', 4, 1, 3, 'Clinic'),
('FACI-0015', 'Hlar Du', 5, 2, 4, 'Clinic'),
('FACI-0016', 'MBR 1 (Lwal Waing)', 1, 4, 2, 'Clinic');