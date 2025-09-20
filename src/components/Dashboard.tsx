import React, { useState } from 'react';
import { DatasetConfig, MonthlyRecord, ValidationResults as ValidationResultsType } from '../types';
import DatasetControls from './DatasetControls';
import DatasetOverview from './DatasetOverview';
import BehaviorAnalysis from './BehaviorAnalysis';
import OutcomeAnalysis from './OutcomeAnalysis';
import ValidationResults from './ValidationResults';
import ExportControls from './ExportControls';

interface DashboardProps {
  dataset: MonthlyRecord[];
  isGenerating: boolean;
  validationResults: ValidationResultsType | null;
  error: string | null;
  onGenerateDataset: (config: DatasetConfig) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  dataset,
  isGenerating,
  validationResults,
  error,
  onGenerateDataset
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'behaviors' | 'outcomes' | 'validation' | 'export'>('overview');

  const tabs = [
    { id: 'overview', label: 'Dataset Overview', icon: '📊' },
    { id: 'behaviors', label: 'TWA Behaviors', icon: '🏃‍♂️' },
    { id: 'outcomes', label: 'Wellness Outcomes', icon: '💊' },
    { id: 'validation', label: 'Validation', icon: '✅' },
    { id: 'export', label: 'Export Data', icon: '📤' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <DatasetControls 
          onGenerateDataset={onGenerateDataset}
          isGenerating={isGenerating}
        />
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>

      {dataset.length > 0 && (
        <>
          <div className="dashboard-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="dashboard-content">
            {activeTab === 'overview' && (
              <DatasetOverview dataset={dataset} />
            )}
            {activeTab === 'behaviors' && (
              <BehaviorAnalysis dataset={dataset} />
            )}
            {activeTab === 'outcomes' && (
              <OutcomeAnalysis dataset={dataset} />
            )}
            {activeTab === 'validation' && (
              <ValidationResults results={validationResults} />
            )}
            {activeTab === 'export' && (
              <ExportControls dataset={dataset} />
            )}
          </div>
        </>
      )}

      {dataset.length === 0 && !isGenerating && (
        <div className="empty-state">
          <div className="empty-state-icon">🔬</div>
          <h3>Welcome to TWA Research Dashboard</h3>
          <p>Generate a synthetic dataset to explore wellness and aging outcomes based on Tiny Wellness Activities (TWA).</p>
          <p>Configure your dataset parameters above and click "Generate Dataset" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
