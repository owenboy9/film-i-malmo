import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // adjust path if needed

export default function UploadPrivateMedia() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMsg('Please select a file.');
      return;
    }
    const { data, error } = await supabase.storage
      .from('private-media')
      .upload(`uploads/${Date.now()}_${file.name}`, file);

    if (error) {
      setMsg('Upload failed: ' + error.message);
    } else {
      setMsg('Upload successful!');
    }
  };

  return (
    <div>
      <h2>Upload to Private Media</h2>
      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} style={{ marginLeft: 8 }}>
        Upload
      </button>
      <div>{msg}</div>
    </div>
  );
}