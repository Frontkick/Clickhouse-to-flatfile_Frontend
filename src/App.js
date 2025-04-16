import React from 'react';
import axios from 'axios';
import DirectionSelector from './components/DirectionSelector';
import ClickHouseConfig from './components/ClickHouseConfig';
import FlatFileUpload from './components/FlatFileUpload';
import TableSelector from './components/TableSelector';
import JoinConfig from './components/JoinConfig';
import ColumnSelector from './components/ColumnSelector';
import DataPreview from './components/DataPreview';
import IngestionControls from './components/IngestionControls';
import ProgressIndicator from './components/ProgressIndicator';
import ResultDisplay from './components/ResultDisplay';
import ProgressBar from './components/ProgressBar';

const App = () => {
  const [direction, setDirection] = React.useState('clickhouse_to_flatfile');
  const [clickhouseConnection, setClickhouseConnection] = React.useState(null);
  const [tables, setTables] = React.useState([]);
  const [selectedTables, setSelectedTables] = React.useState([]);
  const [schemas, setSchemas] = React.useState({});
  const [selectedColumns, setSelectedColumns] = React.useState([]);
  const [joinType, setJoinType] = React.useState('INNER');
  const [joinKeys, setJoinKeys] = React.useState(['', '']);
  const [flatFile, setFlatFile] = React.useState(null);
  const [targetTable, setTargetTable] = React.useState('');
  const [outputFileName, setOutputFileName] = React.useState('output.csv');
  const [previewData, setPreviewData] = React.useState(null);
  const [ingestionStatus, setIngestionStatus] = React.useState('idle');
  const [progress, setProgress] = React.useState(0);
  const [recordCount, setRecordCount] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const BASE_URL = 'https://test-pg5s.onrender.com';

  // Calculate progress based on direction and completed steps
  React.useEffect(() => {
    let stepsCompleted = 0;
    if (direction === 'clickhouse_to_flatfile') {
      if (clickhouseConnection && tables.length > 0) stepsCompleted += 1; // Connect button success
      if (selectedTables.length > 0) stepsCompleted += 1; // Table selected
      if (selectedColumns.length > 0) stepsCompleted += 1; // Columns selected
    } else {
      if (flatFile) stepsCompleted += 1; // File uploaded
      if (clickhouseConnection && tables.length > 0) stepsCompleted += 1; // Connect button success
      if (targetTable) stepsCompleted += 1; // Target table selected
    }
    const progressValue = (stepsCompleted / 3) * 100; // Each step is 33.33%
    setProgress(progressValue);
  }, [
    direction,
    clickhouseConnection,
    tables,
    selectedTables,
    selectedColumns,
    flatFile,
    targetTable,
  ]);

  React.useEffect(() => {
    if (selectedTables.length > 0 && clickhouseConnection) {
      const fetchSchemas = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/get_schemas`, {
            connection: clickhouseConnection,
            tables: selectedTables,
          });
          setSchemas(response.data.schemas);
        } catch (err) {
          console.error('Failed to fetch schemas');
        }
      };
      fetchSchemas();
    }
  }, [selectedTables, clickhouseConnection]);

  React.useEffect(() => {
    let interval;
    if (ingestionStatus === 'in_progress') {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${BASE_URL}/ingestion_progress`);
          const progressValue = response.data.progress;
          setProgress(progressValue);
          if (progressValue === 100) {
            setIngestionStatus('completed');
            clearInterval(interval);
          }
        } catch (err) {
          setIngestionStatus('error');
          setErrorMessage('Failed to get progress');
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [ingestionStatus]);

  const startIngestion = async () => {
    setIngestionStatus('in_progress');
    setProgress(0);
    try {
      if (direction === 'clickhouse_to_flatfile') {
        if (!clickhouseConnection || selectedTables.length === 0 || selectedColumns.length === 0) {
          setIngestionStatus('error');
          setErrorMessage('Please provide connection details, select at least one table, and select columns');
          return;
        }
        const response = await axios.post(`${BASE_URL}/ingest_clickhouse_to_flatfile`, {
          connection: clickhouseConnection,
          tables: selectedTables,
          columns: selectedColumns,
          delimiter: ',',
          join_type: selectedTables.length === 2 ? joinType : null,
          join_keys: selectedTables.length === 2 ? joinKeys : null,
        }, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outputFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setRecordCount(response.headers['x-record-count']);
        setIngestionStatus('completed');
      } else {
        if (!flatFile || !clickhouseConnection || !targetTable || selectedColumns.length === 0) {
          setIngestionStatus('error');
          setErrorMessage('Please upload a file, provide connection details, select a target table, and select columns');
          return;
        }
        const response = await axios.post(`${BASE_URL}/ingest_flatfile_to_clickhouse`, {
          file_id: flatFile.fileId,
          columns: selectedColumns,
          delimiter: flatFile.delimiter,
          connection: clickhouseConnection,
          target_table: targetTable,
        });
        setRecordCount(response.data.record_count);
        setIngestionStatus('completed');
      }
    } catch (err) {
      setIngestionStatus('error');
      setErrorMessage(err.response?.data?.error || 'Ingestion failed');
    }
  };

  const sourceColumns = direction === 'clickhouse_to_flatfile'
    ? (selectedTables.length === 1
      ? schemas[selectedTables[0]]?.map(col => col.name) || []
      : selectedTables.flatMap(table =>
        schemas[table]?.map(col =>
          col.name.startsWith(`${table}.`) ? col.name : `${table}.${col.name}`
        ) || []
      ))
    : flatFile?.columns || [];


  return (
    <div className="pt-10">
      <ProgressBar progress={progress} />
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ paddingTop: '40px' }}>Data Ingestion Application</h1>
      <DirectionSelector direction={direction} setDirection={setDirection} />
      {direction === 'clickhouse_to_flatfile' ? (
        <div>
          <ClickHouseConfig setConnection={setClickhouseConnection} setTables={setTables} />
          {clickhouseConnection && (
            <TableSelector
              tables={tables}
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
            />
          )}
          {selectedTables.length > 0 && (
            <JoinConfig
              tables={selectedTables}
              schemas={schemas}
              joinType={joinType}
              setJoinType={setJoinType}
              joinKeys={joinKeys}
              setJoinKeys={setJoinKeys}
            />
          )}
          {selectedTables.length > 0 && selectedTables.length < 2 && (
            <ColumnSelector
              columns={sourceColumns}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
            />
          )}

          <label className="block mb-4">
            Output File Name:
            <input
              type="text"
              value={outputFileName}
              onChange={(e) => setOutputFileName(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
            />
          </label>
        </div>
      ) : (
        <div>
          <FlatFileUpload setFlatFile={setFlatFile} />
          {flatFile && (
            <ColumnSelector
              columns={sourceColumns}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
            />
          )}
          <ClickHouseConfig setConnection={setClickhouseConnection} setTables={setTables} />
          {clickhouseConnection && (
            <label className="block mb-4">
              Target Table:
              <select
                value={targetTable}
                onChange={(e) => setTargetTable(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="">Select a table</option>
                {tables.map((table) => (
                  <option key={table} value={table}>{table}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      <IngestionControls
        direction={direction}
        clickhouseConnection={clickhouseConnection}
        selectedTables={selectedTables}
        selectedColumns={selectedColumns}
        flatFile={flatFile}
        setPreviewData={setPreviewData}
        startIngestion={startIngestion}
      />
      {previewData && <DataPreview previewData={previewData} />}
      {ingestionStatus === 'in_progress' && <ProgressIndicator progress={progress} />}
      {ingestionStatus === 'completed' && <ResultDisplay recordCount={recordCount} />}
      {ingestionStatus === 'error' && (
        <p className="text-red-500">Error: {errorMessage}</p>
      )}
    </div>
  );
};


export default App;