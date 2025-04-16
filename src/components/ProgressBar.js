import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="position-fixed top-0 start-5 w-100 bg-light" style={{ zIndex: 1050 }}>
      <div className="progress" style={{ height: '1rem' }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <p className="text-center small mt-1 mb-0">{progress.toFixed(0)}% Complete</p>
    </div>
  );
};

export default ProgressBar;
