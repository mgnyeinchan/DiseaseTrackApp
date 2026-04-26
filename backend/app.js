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

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/townships', townshipRoutes);

module.exports = app;