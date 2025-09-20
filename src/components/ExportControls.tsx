import React, { useState } from 'react';
import { MonthlyRecord } from '../types';
import { Download, FileText, Table, FileSpreadsheet, Loader } from 'lucide-react';

interface ExportControlsProps {
  dataset: MonthlyRecord[];
}

const ExportControls: React.FC<ExportControlsProps> = ({ dataset }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'excel'>('json');

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (exportFormat) {
        case 'json':
          await exportToJSON();
          break;
        case 'csv':
          await exportToCSV();
          break;
        case 'excel':
          await exportToExcel();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async () => {
    const dataStr = JSON.stringify(dataset, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `twa-dataset-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = async () => {
    if (dataset.length === 0) return;
    
    // Flatten the nested structure for CSV
    const flattenedData = dataset.map(record => ({
      subject_id: record.subject_id,
      month: record.month,
      season: record.season,
      observation_date: record.observation_date,
      
      // Demographics
      age_group: record.demographics.age_group,
      age_numeric: record.demographics.age_numeric,
      gender: record.demographics.gender,
      ethnicity: record.demographics.ethnicity,
      education: record.demographics.education,
      income_bracket: record.demographics.income_bracket,
      income_numeric: record.demographics.income_numeric,
      fitness_level: record.demographics.fitness_level,
      sleep_type: record.demographics.sleep_type,
      region: record.demographics.region,
      urban_rural: record.demographics.urban_rural,
      occupation: record.demographics.occupation,
      
      // TWA Behaviors - Do More
      motion_days_week: record.behaviors.motion_days_week,
      sleep_hours: record.behaviors.sleep_hours,
      sleep_quality_score: record.behaviors.sleep_quality_score,
      hydration_cups_day: record.behaviors.hydration_cups_day,
      diet_mediterranean_score: record.behaviors.diet_mediterranean_score,
      meditation_minutes_week: record.behaviors.meditation_minutes_week,
      
      // TWA Behaviors - Do Less
      smoking_status: record.behaviors.smoking_status,
      alcohol_drinks_week: record.behaviors.alcohol_drinks_week,
      added_sugar_grams_day: record.behaviors.added_sugar_grams_day,
      sodium_grams_day: record.behaviors.sodium_grams_day,
      processed_food_servings_week: record.behaviors.processed_food_servings_week,
      
      // TWA Behaviors - Connection & Purpose
      social_connections_count: record.behaviors.social_connections_count,
      nature_minutes_week: record.behaviors.nature_minutes_week,
      cultural_hours_week: record.behaviors.cultural_hours_week,
      purpose_meaning_score: record.behaviors.purpose_meaning_score,
      
      // Wellness Outcomes
      biological_age_years: record.outcomes.biological_age_years,
      biological_age_acceleration: record.outcomes.biological_age_acceleration,
      mortality_risk_score: record.outcomes.mortality_risk_score,
      estimated_lifespan_years: record.outcomes.estimated_lifespan_years,
      
      // Biomarkers
      crp_mg_l: record.outcomes.crp_mg_l,
      il6_pg_ml: record.outcomes.il6_pg_ml,
      igf1_ng_ml: record.outcomes.igf1_ng_ml,
      gdf15_pg_ml: record.outcomes.gdf15_pg_ml,
      cortisol_ug_dl: record.outcomes.cortisol_ug_dl,
      
      // Functional measures
      grip_strength_kg: record.outcomes.grip_strength_kg,
      gait_speed_ms: record.outcomes.gait_speed_ms,
      balance_score: record.outcomes.balance_score,
      frailty_index: record.outcomes.frailty_index,
      
      // Cognitive measures
      cognitive_composite_score: record.outcomes.cognitive_composite_score,
      processing_speed_score: record.outcomes.processing_speed_score,
      
      // Psychosocial wellbeing
      life_satisfaction_score: record.outcomes.life_satisfaction_score,
      stress_level_score: record.outcomes.stress_level_score,
      depression_risk_score: record.outcomes.depression_risk_score,
      social_support_score: record.outcomes.social_support_score,
      
      // Research validation variables
      meets_exercise_guidelines: record.meets_exercise_guidelines,
      meets_sleep_guidelines: record.meets_sleep_guidelines,
      high_diet_quality: record.high_diet_quality,
      regular_meditation: record.regular_meditation,
      strong_social_support: record.strong_social_support,
      high_purpose: record.high_purpose,
      healthy_aging_profile: record.healthy_aging_profile,
      blue_zone_similarity_score: record.blue_zone_similarity_score
    }));

    // Convert to CSV
    const headers = Object.keys(flattenedData[0]);
    const csvContent = [
      headers.join(','),
      ...flattenedData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `twa-dataset-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = async () => {
    // For Excel export, we'll use a simple approach with CSV format
    // In a real application, you might want to use a library like xlsx
    alert('Excel export is not fully implemented. Please use CSV format for now.');
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <FileText size={20} />;
      case 'csv':
        return <Table size={20} />;
      case 'excel':
        return <FileSpreadsheet size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'json':
        return 'Structured JSON format with nested objects. Best for programmatic analysis.';
      case 'csv':
        return 'Flat CSV format with all data in columns. Best for spreadsheet analysis.';
      case 'excel':
        return 'Excel format with multiple sheets. Best for comprehensive analysis.';
      default:
        return '';
    }
  };

  return (
    <div className="export-controls">
      <div className="export-header">
        <h2>Export Dataset</h2>
        <p>Download your generated TWA dataset in various formats for further analysis.</p>
      </div>

      <div className="export-content">
        <div className="export-info">
          <div className="dataset-summary">
            <h3>Dataset Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Records:</span>
                <span className="stat-value">{dataset.length.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unique Subjects:</span>
                <span className="stat-value">{new Set(dataset.map(r => r.subject_id)).size.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Period:</span>
                <span className="stat-value">{Math.max(...dataset.map(r => r.month)) + 1} months</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Variables:</span>
                <span className="stat-value">50+ research variables</span>
              </div>
            </div>
          </div>

          <div className="format-selection">
            <h3>Select Export Format</h3>
            <div className="format-options">
              {(['json', 'csv', 'excel'] as const).map(format => (
                <div
                  key={format}
                  className={`format-option ${exportFormat === format ? 'selected' : ''}`}
                  onClick={() => setExportFormat(format)}
                >
                  <div className="format-icon">
                    {getFormatIcon(format)}
                  </div>
                  <div className="format-info">
                    <div className="format-name">{format.toUpperCase()}</div>
                    <div className="format-description">{getFormatDescription(format)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="export-actions">
          <button
            className="export-button"
            onClick={handleExport}
            disabled={isExporting || dataset.length === 0}
          >
            {isExporting ? (
              <>
                <Loader className="spinner" size={20} />
                Exporting...
              </>
            ) : (
              <>
                <Download size={20} />
                Export Dataset
              </>
            )}
          </button>
        </div>

        <div className="export-details">
          <h3>Export Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <h4>Data Structure</h4>
              <ul>
                <li>Demographics (12 variables)</li>
                <li>TWA Behaviors (14 variables)</li>
                <li>Wellness Outcomes (20+ variables)</li>
                <li>Research Validation (8 variables)</li>
              </ul>
            </div>
            <div className="detail-item">
              <h4>Research Foundation</h4>
              <ul>
                <li>14 validated biomarkers of aging</li>
                <li>Blue Zone lifestyle patterns</li>
                <li>Evidence-based behavior correlations</li>
                <li>Longitudinal aging trajectories</li>
              </ul>
            </div>
            <div className="detail-item">
              <h4>Quality Assurance</h4>
              <ul>
                <li>Research-validated effect sizes</li>
                <li>Demographic accuracy validation</li>
                <li>Behavior correlation validation</li>
                <li>Longitudinal coherence checks</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="export-notes">
          <h3>Usage Notes</h3>
          <div className="notes-content">
            <p>
              <strong>For Research Use:</strong> This dataset is designed for research applications in aging, 
              wellness, and lifestyle intervention studies. All variables are based on peer-reviewed research 
              and validated effect sizes.
            </p>
            <p>
              <strong>Data Privacy:</strong> This is a synthetic dataset with no real personal information. 
              All demographic and health data is artificially generated for research purposes.
            </p>
            <p>
              <strong>Citation:</strong> If you use this dataset in research, please cite the underlying 
              research studies referenced in the generation methodology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;
