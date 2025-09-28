const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const verifySignature = require('../utils/verifySignature');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/add', async (req, res) => {
    const { token_id, creator_address, event_info, proof_hash, signature } = req.body;

    if (!token_id || !creator_address || !event_info || !proof_hash || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    
    const message = proof_hash;
    if (!verifySignature(message, signature, creator_address)) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    const { data, error } = await supabase
        .from('proofs')
        .insert([{
            token_id,
            creator_address,
            proof_hash,
            signature,
            event_info,
            created_at: new Date()
        }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

router.get('/:token_id', async (req, res) => {
    const { token_id } = req.params;

    const { data, error } = await supabase
        .from('proofs')
        .select('*')
        .eq('token_id', token_id)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
