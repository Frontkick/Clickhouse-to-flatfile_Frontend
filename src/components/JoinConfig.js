import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const JoinConfig = ({ tables, schemas, joinType, setJoinType, joinKeys, setJoinKeys }) => {
  if (tables.length !== 2) return null;

  const [table1, table2] = tables;
  const table1Columns = schemas[table1] || [];
  const table2Columns = schemas[table2] || [];

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h3 className="card-title mb-3">Join Configuration</h3>
      <div className="mb-3">
        <label className="form-label">Join Type:</label>
        <select
          value={joinType}
          onChange={(e) => setJoinType(e.target.value)}
          className="form-select"
        >
          <option value="INNER">INNER JOIN</option>
          <option value="LEFT">LEFT JOIN</option>
          <option value="RIGHT">RIGHT JOIN</option>
          <option value="FULL">FULL JOIN</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Join Key for {table1}:</label>
        <select
          value={joinKeys[0]}
          onChange={(e) => setJoinKeys([e.target.value, joinKeys[1]])}
          className="form-select"
        >
          <option value="">Select key</option>
          {table1Columns.map((col) => (
            <option key={col.name} value={col.name}>{col.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label">Join Key for {table2}:</label>
        <select
          value={joinKeys[1]}
          onChange={(e) => setJoinKeys([joinKeys[0], e.target.value])}
          className="form-select"
        >
          <option value="">Select key</option>
          {table2Columns.map((col) => (
            <option key={col.name} value={col.name}>{col.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default JoinConfig;
