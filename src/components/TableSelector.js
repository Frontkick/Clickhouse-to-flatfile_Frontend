import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TableSelector = ({ tables, selectedTables, setSelectedTables }) => {
  const handleTableChange = (table) => {
    if (selectedTables.includes(table)) {
      setSelectedTables(selectedTables.filter((t) => t !== table));
    } else {
      setSelectedTables([...selectedTables, table]);
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h2 className="card-title mb-3">Select Tables</h2>
      <div className="form-check">
        {tables.map((table) => (
          <div key={table} className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id={table}
              checked={selectedTables.includes(table)}
              onChange={() => handleTableChange(table)}
            />
            <label className="form-check-label" htmlFor={table}>
              {table}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelector;
