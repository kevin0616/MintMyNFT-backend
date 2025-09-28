const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const creatorRoutes = require('./routes/creator');
const proofRoutes = require('./routes/proof');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/creator', creatorRoutes);
app.use('/api/proof', proofRoutes);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
