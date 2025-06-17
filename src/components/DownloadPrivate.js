import React, { useState } from 'react';
import { supabase } from '../supabase';

function DownloadPrivate() {
  const [fileName, setFileName] = useState('');
  const [signedUrl, setSignedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!fileName) return;

    setLoading(true);

    const { data, error } = await supabase
      .storage
      .from('private-media')
      .createSignedUrl(fileName, 60 * 60); // 1 hour

    if (error) {
      alert('Error generating signed URL: ' + error.message);
      setLoading(false);
      return;
    }

    setSignedUrl(data.signedUrl);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter exact file name (e.g. 17292739.jpg)"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating...' : 'Get Download Link'}
      </button>
      {signedUrl && (
        <div>
          <p>Signed URL (1 hour):</p>
          <a href={signedUrl} target="_blank" rel="noopener noreferrer">Download/View File</a>
        </div>
      )}
    </div>
  );
}

export default DownloadPrivate;
