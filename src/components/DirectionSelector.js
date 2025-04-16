import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DirectionSelector = ({ direction, setDirection }) => {
  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h2 className="card-title mb-3">Ingestion Direction</h2>
      <div className="mb-3">
        <label className="form-label" htmlFor="directionSelect">
          Ingestion Direction:
        </label>
        <select
          id="directionSelect"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="form-select"
        >
          <option value="clickhouse_to_flatfile">ClickHouse to Flat File</option>
          <option value="flatfile_to_clickhouse">Flat File to ClickHouse</option>
        </select>
      </div>
    </div>
  );
};

export default DirectionSelector;
