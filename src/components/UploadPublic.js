import React, { useState } from 'react';
import { supabase } from '../supabase';

function UploadPublic() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('public-media') 
      .upload(fileName, file);

    if (error) {
      alert('Upload error: ' + error.message);
    } else {
      const { data: publicUrl } = supabase
        .storage
        .from('public-media')
        .getPublicUrl(fileName);
      setUrl(publicUrl.publicUrl);
    }

    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {url && (
        <div>
          <p>File uploaded!</p>
          <a href={url} target="_blank" rel="noopener noreferrer">View File</a>
        </div>
      )}
    </div>
  );
}

export default UploadPublic;
