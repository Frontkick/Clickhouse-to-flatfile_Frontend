import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const IngestionControls = ({
  direction,
  clickhouseConnection,
  selectedTables,
  selectedColumns,
  flatFile,
  setPreviewData,
  startIngestion,
}) => {
  const handlePreview = async () => {
    if (direction === 'clickhouse_to_flatfile' && selectedTables.length === 1) {
      try {
        const response = await axios.post('https://test-pg5s.onrender.com/preview_clickhouse', {
          connection: clickhouseConnection,
          table: selectedTables[0],
          columns: selectedColumns,
        });
        setPreviewData(response.data.data);
      } catch (err) {
        console.error('Failed to preview data');
      }
    } else if (direction === 'flatfile_to_clickhouse' && flatFile) {
      try {
        const response = await axios.post('https://test-pg5s.onrender.com/preview_flatfile', {
          file_id: flatFile.fileId,
          columns: selectedColumns,
          delimiter: flatFile.delimiter,
        });
        setPreviewData(response.data.data);
      } catch (err) {
        console.error('Failed to preview data');
      }
    } else {
      alert('Preview is only available for single table or flat file');
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <div className="d-flex justify-content-between">
        <button
          onClick={handlePreview}
          className="btn btn-success w-48"
        >
          Preview Data
        </button>
        <button
          onClick={startIngestion}
          className="btn btn-primary w-48"
        >
          Start Ingestion
        </button>
      </div>
    </div>
  );
};

export default IngestionControls;
