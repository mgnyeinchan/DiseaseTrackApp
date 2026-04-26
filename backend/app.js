const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const caseRoutes = require('./routes/case.routes');
const projectRoutes = require('./routes/project.routes');

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/projects', projectRoutes);

module.exports = app;