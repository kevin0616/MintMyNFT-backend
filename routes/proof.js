const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const verifySignature = require('../utils/verifySignature');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/create', async (req, res) => {
    const { tag, event_info, address, token_id, creator_address, token_uri } = req.body;

    //if (!token_id || !creator_address || !event_info || !proof_hash || !signature) {
    //    return res.status(400).json({ error: 'Missing required fields' });
    //}
    console.log(creator_address)
    //const message = proof_hash;
    //if (!verifySignature(message, signature, creator_address)) {
    //    return res.status(400).json({ error: 'Invalid signature' });
    //}

    //password & address verification(not done)
    //

    const { data, error } = await supabase
        .from('Proofs')
        .insert([{
            token_id: token_id,
            creator_address: creator_address,
            info: event_info,
            token_uri: token_uri,
            created_at: new Date(),
            tag: tag,
        }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

router.post('/list', async (req, res) => {
    const { token_id } = req.body;
    const { data, error } = await supabase
        .from('Proofs')
        .select('*')
        .eq('token_id', token_id)
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
