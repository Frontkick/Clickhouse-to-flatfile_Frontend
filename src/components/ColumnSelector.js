import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ColumnSelector = ({ columns, selectedColumns, setSelectedColumns }) => {
  const handleColumnChange = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h2 className="card-title mb-3">Select Columns</h2>
      <div className="form-check">
        {columns.map((column) => (
          <div key={column} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnChange(column)}
              id={`column-${column}`}
            />
            <label className="form-check-label" htmlFor={`column-${column}`}>
              {column}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;
