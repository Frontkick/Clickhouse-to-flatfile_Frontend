import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataPreview = ({ previewData }) => {
  if (!previewData || previewData.length === 0) return null;

  const columns = Object.keys(previewData[0]);

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h2 className="card-title mb-3">Data Preview</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;
