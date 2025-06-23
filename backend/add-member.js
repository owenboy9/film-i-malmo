const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Supabase project URL and service role key
const supabase = createClient(
  'https://llslxcymbxcvwrufjaqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc2x4Y3ltYnhjdndydWZqYXFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA3OTUyNiwiZXhwIjoyMDY1NjU1NTI2fQ.46CPV8wXbEbspW9OS-aGCCE9i2lVo_DJ14PX3RVoWeE'
);

app.post('/api/add-member', async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    birth_date,
    address_street,
    address_st_num,
    address_city,
    newsletter,
    role
  } = req.body;

  // 1. Create user in Supabase Auth (do NOT set email_confirm: true)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      display_name: `${first_name} ${last_name}`,
      first_name,
      last_name,
      birth_date,
      address_street,
      address_st_num,
      address_city,
      newsletter,
      role
    }
    // Do NOT add email_confirm here!
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // 2. Insert into users table
  const userId = data.user?.id;
  if (userId) {
    const { error: dbError } = await supabase.from('users').insert([{
      id: userId,
      first_name,
      last_name,
      email,
      birth_date,
      address_street,
      address_st_num,
      address_city,
      newsletter,
      created_at: new Date().toISOString()
    }]);
    if (dbError) {
      return res.status(400).json({ error: 'Auth created, but failed to save user info: ' + dbError.message });
    }
  }

  res.json({ success: true, user: data.user });
});

// backend/add-member.js (add this endpoint)
app.post('/api/resend-confirmation', async (req, res) => {
  const { email } = req.body;
  const { error } = await supabase.auth.admin.resend({
    email,
    type: 'signup'
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ success: true });
});

// backend/add-member.js (add this endpoint)
app.post('/api/edit-member', async (req, res) => {
  const {
    id, // Supabase Auth user ID
    first_name,
    last_name,
    birth_date,
    address_street,
    address_st_num,
    address_city,
    newsletter,
    role
  } = req.body;

  // 1. Update Auth metadata
  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: {
      display_name: `${first_name} ${last_name}`,
      first_name,
      last_name,
      birth_date,
      address_street,
      address_st_num,
      address_city,
      newsletter,
      role
    }
  });
  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // 2. Update users table
  const { error: dbError } = await supabase.from('users').update({
    first_name,
    last_name,
    birth_date,
    address_street,
    address_st_num,
    address_city,
    newsletter
  }).eq('id', id);
  if (dbError) {
    return res.status(400).json({ error: 'Auth updated, but failed to update user info: ' + dbError.message });
  }

  res.json({ success: true });
});

// Delete member endpoint
app.post('/api/delete-member', async (req, res) => {
  const { id } = req.body; // Supabase Auth user ID

  // 1. Delete from Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // 2. Delete from users table
  const { error: dbError } = await supabase.from('users').delete().eq('id', id);
  if (dbError) {
    return res.status(400).json({ error: 'Auth deleted, but failed to delete user info: ' + dbError.message });
  }

  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});