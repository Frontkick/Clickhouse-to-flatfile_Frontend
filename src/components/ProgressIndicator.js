import React from 'react';

const ProgressIndicator = ({ progress }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Ingestion Progress</h2>
      <progress value={progress} max="100" className="w-full"></progress>
      <p className="text-center">{progress}%</p>
    </div>
  );
};

export default ProgressIndicator;