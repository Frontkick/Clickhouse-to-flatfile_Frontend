import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FlatFileUpload = ({ setFlatFile }) => {
  const [file, setFile] = React.useState(null);
  const [delimiter, setDelimiter] = React.useState(',');
  const [error, setError] = React.useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('delimiter', delimiter);
    try {
      const response = await axios.post('https://test-pg5s.onrender.com/upload_flatfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFlatFile({ fileId: response.data.file_id, columns: response.data.columns, delimiter });
      setError('');
    } catch (err) {
      setError('Failed to upload file');
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h2 className="card-title mb-3">Upload Flat File</h2>
      <div className="mb-3">
        <label htmlFor="fileUpload" className="form-label">Choose a File</label>
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="delimiterInput" className="form-label">Delimiter</label>
        <input
          id="delimiterInput"
          type="text"
          placeholder="Enter delimiter (e.g., ,)"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="form-control"
        />
      </div>
      <button
        onClick={handleUpload}
        className="btn btn-primary w-100"
      >
        Upload
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default FlatFileUpload;
