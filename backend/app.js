const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const caseRoutes = require('./routes/case.routes');
const projectRoutes = require('./routes/project.routes');
const orgRoutes = require('./routes/org.routes');
const divisionRoutes = require('./routes/division.routes');
const townshipRoutes = require('./routes/township.routes');
const villageRoutes = require('./routes/village.routes');
const clinicRoutes = require('./routes/clinic.routes');
const diseaseRoutes = require('./routes/disease.routes');
const facilityRoutes = require('./routes/facility.router');
const casebaseRoutes = require('./routes/casebase.routes');
const weeklyreportRoutes = require('./routes/weeklyreport.router');
const agegroupRoutes = require('./routes/agegroup.router');
const awarenesssourceRoutes = require('./routes/awarenesssource.router');
const surveillanceRoutes = require('./routes/surveillance.router');

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/townships', townshipRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/casebases', casebaseRoutes);
app.use('/api/weeklyreports', weeklyreportRoutes);
app.use('/api/agegroups', agegroupRoutes);
app.use('/api/awarenesssources', awarenesssourceRoutes);
app.use('/api/surveillance', surveillanceRoutes);

module.exports = app;