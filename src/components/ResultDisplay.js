import React from 'react';

const ResultDisplay = ({ recordCount }) => {
  return (
    <p className="text-green-600">Ingestion completed. Records processed: {recordCount}</p>
  );
};

export default ResultDisplay;