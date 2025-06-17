import React, { useState } from 'react';
import { supabase } from '../supabase';

function UploadPrivate() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('private-media')
      .upload(fileName, file);

    if (error) {
      alert('Upload error: ' + error.message);
      setUploading(false);
      return;
    }

    // Now generate a signed URL to allow temporary access (e.g. 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('private-media')
      .createSignedUrl(fileName, 60 * 60); // 1 hour = 3600 seconds

    if (signedUrlError) {
      alert('Signed URL error: ' + signedUrlError.message);
    } else {
      setUrl(signedUrlData.signedUrl);
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
          <p>Private file uploaded!</p>
          <a href={url} target="_blank" rel="noopener noreferrer">View (1h access)</a>
        </div>
      )}
    </div>
  );
}

export default UploadPrivate;
