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
  const filePath = `${fileName}`;

  // Step 1: Upload to Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('public-media')
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
        bucket: 'public-media',
        is_public: true,
        // If you're using auth, you could add:
        // uploaded_by: user.id
      }
    ]);

  if (insertError) {
    alert('Upload succeeded but DB insert failed: ' + insertError.message);
  } else {
    const { data: publicUrl } = supabase.storage
      .from('public-media')
      .getPublicUrl(filePath);
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
