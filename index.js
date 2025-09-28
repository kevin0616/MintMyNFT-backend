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

// 2️⃣ 讀取所有 creators
app.get('/test/creator', async (req, res) => {
    const { data, error } = await supabase
        .from('creators')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 3️⃣ 更新 creator username
app.put('/test/creator/:wallet_address', async (req, res) => {
    const { wallet_address } = req.params;
    const { username } = req.body;
    const { data, error } = await supabase
        .from('creators')
        .update({ username })
        .eq('wallet_address', wallet_address)
        .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// 4️⃣ 刪除 creator
app.delete('/test/creator/:wallet_address', async (req, res) => {
    const { wallet_address } = req.params;
    const { data, error } = await supabase
        .from('creators')
        .delete()
        .eq('wallet_address', wallet_address)
        .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ deleted: data.length });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
