const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const verifySignature = require('../utils/verifySignature');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/check', async (req, res) => {
  const { wallet_address } = req.body;
  if (!wallet_address) {
    return res.status(400).json({ error: "wallet_address is required" });
  }

  
  try {
    const { data, error } = await supabase
      .from('Creators')
      .select('*')
      .eq('wallet_address', wallet_address);
    
    if (error) return res.status(500).json({ error: error.message });

    if (data.length > 0) {
      res.json({ results: true, creator: data[0] });
    } else {
      res.json({ results: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { wallet_address, username } = req.body;
  if (!wallet_address) {
    return res.status(400).json({ error: "wallet_address is required" });
  }

  try {
    const { data, error } = await supabase
    .from('Creators')
    .insert([
    { wallet_address: wallet_address, username: username },
    ])
    .select()
    
    if (error) return res.status(500).json({ error: error.message });

    if (data.length > 0) {
      res.json({ results: true, creator: data[0] });
    } else {
      res.json({ results: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:wallet_address', async (req, res) => {
    const { wallet_address } = req.params;
    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('wallet_address', wallet_address)
        .single();
    
    if (error) return res.status(404).json({ error: 'Creator not found' });
    res.json(data);
});

module.exports = router;
