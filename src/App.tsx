import React, { useState } from 'react';
import { DatasetConfig, MonthlyRecord, ValidationResults as ValidationResultsType } from './types';
import { LongitudinalTWADataGenerator } from './services/LongitudinalDataGenerator';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [dataset, setDataset] = useState<MonthlyRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResultsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataGenerator = new LongitudinalTWADataGenerator();

  const handleGenerateDataset = async (config: DatasetConfig) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedDataset = await dataGenerator.generateCompleteDataset(config);
      setDataset(generatedDataset);
      
      if (config.include_validation) {
        const validation = dataGenerator.validateDataset(generatedDataset);
        setValidationResults(validation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the dataset');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>TWA Research Dashboard</h1>
        <p>Enhanced Synthetic US Wellness & Aging Dataset Generation</p>
      </header>
      
      <main className="app-main">
        <Dashboard
          dataset={dataset}
          isGenerating={isGenerating}
          validationResults={validationResults}
          error={error}
          onGenerateDataset={handleGenerateDataset}
        />
      </main>
    </div>
  );
}

export default App;
