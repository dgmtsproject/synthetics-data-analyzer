import React, { useState } from 'react';
import { DatasetConfig } from '../types';
import { Play, Settings, Loader } from 'lucide-react';

interface DatasetControlsProps {
  onGenerateDataset: (config: DatasetConfig) => void;
  isGenerating: boolean;
}

const DatasetControls: React.FC<DatasetControlsProps> = ({
  onGenerateDataset,
  isGenerating
}) => {
  const [config, setConfig] = useState<DatasetConfig>({
    n_subjects: 1000,
    months: 12,
    include_validation: true,
    export_format: 'json'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateDataset(config);
  };

  const handleConfigChange = (field: keyof DatasetConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="dataset-controls">
      <div className="controls-header">
        <h2>Dataset Configuration</h2>
        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings size={16} />
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>
      </div>

      <form onSubmit={handleSubmit} className="controls-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="n_subjects">Number of Subjects</label>
            <select
              id="n_subjects"
              value={config.n_subjects}
              onChange={(e) => handleConfigChange('n_subjects', parseInt(e.target.value))}
              disabled={isGenerating}
            >
              <option value={100}>100 (Quick Test)</option>
              <option value={1000}>1,000 (Small Dataset)</option>
              <option value={5000}>5,000 (Medium Dataset)</option>
              <option value={10000}>10,000 (Large Dataset)</option>
              <option value={25000}>25,000 (Research Grade)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="months">Time Period (Months)</label>
            <select
              id="months"
              value={config.months}
              onChange={(e) => handleConfigChange('months', parseInt(e.target.value))}
              disabled={isGenerating}
            >
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
            </select>
          </div>
        </div>

        {showAdvanced && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="export_format">Export Format</label>
              <select
                id="export_format"
                value={config.export_format}
                onChange={(e) => handleConfigChange('export_format', e.target.value)}
                disabled={isGenerating}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.include_validation}
                  onChange={(e) => handleConfigChange('include_validation', e.target.checked)}
                  disabled={isGenerating}
                />
                <span className="checkmark"></span>
                Include Research Validation
              </label>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="generate-button"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader className="spinner" size={16} />
                Generating Dataset...
              </>
            ) : (
              <>
                <Play size={16} />
                Generate Dataset
              </>
            )}
          </button>
        </div>
      </form>

      <div className="config-info">
        <h4>Research Foundation</h4>
        <ul>
          <li>✅ 14 validated biomarkers of aging</li>
          <li>✅ Blue Zone lifestyle patterns</li>
          <li>✅ Evidence-based behavior correlations</li>
          <li>✅ Longitudinal aging trajectories</li>
          <li>✅ Seasonal variation modeling</li>
        </ul>
      </div>
    </div>
  );
};

export default DatasetControls;
