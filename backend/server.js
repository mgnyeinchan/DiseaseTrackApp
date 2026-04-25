const express = require('express');
const app = express();

app.use(express.json());

// routes import
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');

// use routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

app.listen(3000, () => console.log('Server running'));