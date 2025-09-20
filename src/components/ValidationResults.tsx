import React from 'react';
import { ValidationResults as ValidationResultsType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface ValidationResultsProps {
  results: ValidationResultsType | null;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="validation-results">
        <div className="no-validation">
          <AlertTriangle size={48} />
          <h3>No Validation Results</h3>
          <p>Generate a dataset with validation enabled to see research benchmark validation results.</p>
        </div>
      </div>
    );
  }

  // Calculate validation scores
  const validationScores = {
    demographic: {
      ageDistribution: results.demographic_accuracy.age_distribution_ks_test < 0.1 ? 'Pass' : 'Fail',
      incomeEducation: Math.abs(results.demographic_accuracy.income_education_correlation) > 0.3 ? 'Pass' : 'Fail',
      fitnessAge: Math.abs(results.demographic_accuracy.fitness_age_relationship) > 0.2 ? 'Pass' : 'Fail'
    },
    behavior: {
      exerciseSleep: Math.abs(results.behavior_correlations.exercise_sleep_correlation) > 0.2 ? 'Pass' : 'Fail',
      dietMeditation: Math.abs(results.behavior_correlations.diet_meditation_correlation) > 0.2 ? 'Pass' : 'Fail',
      socialPurpose: Math.abs(results.behavior_correlations.social_purpose_correlation) > 0.2 ? 'Pass' : 'Fail'
    },
    outcome: {
      biologicalAge: Math.abs(results.outcome_validity.biological_age_effects) > 0.5 ? 'Pass' : 'Fail',
      mortalityRisk: Math.abs(results.outcome_validity.mortality_risk_factors) > 0.5 ? 'Pass' : 'Fail',
      purposeLongevity: Math.abs(results.outcome_validity.purpose_longevity_relationship) > 1.0 ? 'Pass' : 'Fail'
    },
    longitudinal: {
      seasonal: results.longitudinal_coherence.seasonal_variations > 0.1 ? 'Pass' : 'Fail',
      aging: Math.abs(results.longitudinal_coherence.aging_trajectories) > 0.01 ? 'Pass' : 'Fail',
      behavior: results.longitudinal_coherence.behavior_stability > 0.5 ? 'Pass' : 'Fail'
    }
  };

  // Calculate overall validation score
  const allTests = [
    validationScores.demographic.ageDistribution,
    validationScores.demographic.incomeEducation,
    validationScores.demographic.fitnessAge,
    validationScores.behavior.exerciseSleep,
    validationScores.behavior.dietMeditation,
    validationScores.behavior.socialPurpose,
    validationScores.outcome.biologicalAge,
    validationScores.outcome.mortalityRisk,
    validationScores.outcome.purposeLongevity,
    validationScores.longitudinal.seasonal,
    validationScores.longitudinal.aging,
    validationScores.longitudinal.behavior
  ];

  const passedTests = allTests.filter(test => test === 'Pass').length;
  const overallScore = (passedTests / allTests.length) * 100;

  // Prepare data for charts
  const demographicData = [
    { test: 'Age Distribution', value: results.demographic_accuracy.age_distribution_ks_test, threshold: 0.1, status: validationScores.demographic.ageDistribution },
    { test: 'Income-Education Corr', value: Math.abs(results.demographic_accuracy.income_education_correlation), threshold: 0.3, status: validationScores.demographic.incomeEducation },
    { test: 'Fitness-Age Corr', value: Math.abs(results.demographic_accuracy.fitness_age_relationship), threshold: 0.2, status: validationScores.demographic.fitnessAge }
  ];

  const behaviorData = [
    { test: 'Exercise-Sleep Corr', value: Math.abs(results.behavior_correlations.exercise_sleep_correlation), threshold: 0.2, status: validationScores.behavior.exerciseSleep },
    { test: 'Diet-Meditation Corr', value: Math.abs(results.behavior_correlations.diet_meditation_correlation), threshold: 0.2, status: validationScores.behavior.dietMeditation },
    { test: 'Social-Purpose Corr', value: Math.abs(results.behavior_correlations.social_purpose_correlation), threshold: 0.2, status: validationScores.behavior.socialPurpose }
  ];

  const outcomeData = [
    { test: 'Biological Age Effect', value: Math.abs(results.outcome_validity.biological_age_effects), threshold: 0.5, status: validationScores.outcome.biologicalAge },
    { test: 'Mortality Risk Effect', value: Math.abs(results.outcome_validity.mortality_risk_factors), threshold: 0.5, status: validationScores.outcome.mortalityRisk },
    { test: 'Purpose-Longevity Effect', value: Math.abs(results.outcome_validity.purpose_longevity_relationship), threshold: 1.0, status: validationScores.outcome.purposeLongevity }
  ];

  const longitudinalData = [
    { test: 'Seasonal Variation', value: results.longitudinal_coherence.seasonal_variations, threshold: 0.1, status: validationScores.longitudinal.seasonal },
    { test: 'Aging Trajectory', value: Math.abs(results.longitudinal_coherence.aging_trajectories), threshold: 0.01, status: validationScores.longitudinal.aging },
    { test: 'Behavior Stability', value: results.longitudinal_coherence.behavior_stability, threshold: 0.5, status: validationScores.longitudinal.behavior }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pass':
        return <CheckCircle size={16} className="status-icon pass" />;
      case 'Fail':
        return <XCircle size={16} className="status-icon fail" />;
      default:
        return <AlertTriangle size={16} className="status-icon warning" />;
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'Pass':
  //       return '#82ca9d';
  //     case 'Fail':
  //       return '#ff7300';
  //     default:
  //       return '#ffc658';
  //   }
  // };

  return (
    <div className="validation-results">
      <div className="validation-header">
        <h2>Research Validation Results</h2>
        <div className="overall-score">
          <div className="score-circle">
            <div className="score-value">{overallScore.toFixed(0)}%</div>
            <div className="score-label">Overall Score</div>
          </div>
          <div className="score-details">
            <div className="score-passed">{passedTests} / {allTests.length} tests passed</div>
            <div className="score-status">
              {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'Fair' : 'Needs Improvement'}
            </div>
          </div>
        </div>
      </div>

      <div className="validation-sections">
        {/* Demographic Accuracy */}
        <div className="validation-section">
          <h3>📊 Demographic Accuracy</h3>
          <div className="validation-tests">
            {demographicData.map((test, index) => (
              <div key={index} className="validation-test">
                <div className="test-info">
                  {getStatusIcon(test.status)}
                  <span className="test-name">{test.test}</span>
                </div>
                <div className="test-values">
                  <span className="test-value">Value: {test.value.toFixed(3)}</span>
                  <span className="test-threshold">Threshold: {test.threshold}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-container">
            <h4>Demographic Validation Scores</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={demographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, 'Value']} />
                <Bar dataKey="value" fill="#8884d8" />
                <Bar dataKey="threshold" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Behavior Correlations */}
        <div className="validation-section">
          <h3>🔗 Behavior Correlations</h3>
          <div className="validation-tests">
            {behaviorData.map((test, index) => (
              <div key={index} className="validation-test">
                <div className="test-info">
                  {getStatusIcon(test.status)}
                  <span className="test-name">{test.test}</span>
                </div>
                <div className="test-values">
                  <span className="test-value">Value: {test.value.toFixed(3)}</span>
                  <span className="test-threshold">Threshold: {test.threshold}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-container">
            <h4>Behavior Correlation Validation</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={behaviorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, 'Value']} />
                <Bar dataKey="value" fill="#82ca9d" />
                <Bar dataKey="threshold" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Validity */}
        <div className="validation-section">
          <h3>💊 Outcome Validity</h3>
          <div className="validation-tests">
            {outcomeData.map((test, index) => (
              <div key={index} className="validation-test">
                <div className="test-info">
                  {getStatusIcon(test.status)}
                  <span className="test-name">{test.test}</span>
                </div>
                <div className="test-values">
                  <span className="test-value">Value: {test.value.toFixed(3)}</span>
                  <span className="test-threshold">Threshold: {test.threshold}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-container">
            <h4>Outcome Validity Validation</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, 'Value']} />
                <Bar dataKey="value" fill="#ffc658" />
                <Bar dataKey="threshold" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Longitudinal Coherence */}
        <div className="validation-section">
          <h3>📈 Longitudinal Coherence</h3>
          <div className="validation-tests">
            {longitudinalData.map((test, index) => (
              <div key={index} className="validation-test">
                <div className="test-info">
                  {getStatusIcon(test.status)}
                  <span className="test-name">{test.test}</span>
                </div>
                <div className="test-values">
                  <span className="test-value">Value: {test.value.toFixed(3)}</span>
                  <span className="test-threshold">Threshold: {test.threshold}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-container">
            <h4>Longitudinal Coherence Validation</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={longitudinalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, 'Value']} />
                <Bar dataKey="value" fill="#ff7300" />
                <Bar dataKey="threshold" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="validation-summary">
        <h3>Validation Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <TrendingUp size={24} />
            <div>
              <div className="summary-value">{overallScore.toFixed(1)}%</div>
              <div className="summary-label">Overall Validation Score</div>
            </div>
          </div>
          <div className="summary-item">
            <CheckCircle size={24} />
            <div>
              <div className="summary-value">{passedTests}</div>
              <div className="summary-label">Tests Passed</div>
            </div>
          </div>
          <div className="summary-item">
            <XCircle size={24} />
            <div>
              <div className="summary-value">{allTests.length - passedTests}</div>
              <div className="summary-label">Tests Failed</div>
            </div>
          </div>
        </div>
        
        <div className="validation-recommendations">
          <h4>Recommendations</h4>
          {overallScore >= 80 ? (
            <p className="recommendation success">
              ✅ Excellent validation results! The dataset meets research quality standards and is ready for analysis.
            </p>
          ) : overallScore >= 60 ? (
            <p className="recommendation warning">
              ⚠️ Good validation results with some areas for improvement. Consider adjusting generation parameters for better accuracy.
            </p>
          ) : (
            <p className="recommendation error">
              ❌ Validation results indicate significant issues. Please review generation parameters and consider regenerating the dataset.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationResults;
