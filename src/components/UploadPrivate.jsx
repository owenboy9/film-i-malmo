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
    const filePath = `${fileName}`;

    // Step 1: Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('private-media')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // Step 2: Save metadata to DB
    const { data: insertData, error: insertError } = await supabase
      .from('media_files')
      .insert([
        {
          file_name: filePath,
          bucket: 'private-media',
          is_public: false,
          // uploaded_by: user.id (if auth is used)
        }
      ]);

    if (insertError) {
      alert('Upload succeeded but DB insert failed: ' + insertError.message);
    } else {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('private-media')
        .createSignedUrl(filePath, 3600); // 1 hour signed access

      if (signedUrlError) {
        alert('Signed URL generation failed: ' + signedUrlError.message);
      } else {
        setUrl(signedUrlData.signedUrl);
      }
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
          <a href={url} target="_blank" rel="noopener noreferrer">
            View (1h access)
          </a>
        </div>
      )}
    </div>
  );
}

export default UploadPrivate;
