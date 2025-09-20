import React from 'react';
import { MonthlyRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { Heart, Brain, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface OutcomeAnalysisProps {
  dataset: MonthlyRecord[];
}

const OutcomeAnalysis: React.FC<OutcomeAnalysisProps> = ({ dataset }) => {
  // Calculate outcome statistics
  const outcomeStats = {
    biologicalAge: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.biological_age_years, 0) / dataset.length,
      min: Math.min(...dataset.map(r => r.outcomes.biological_age_years)),
      max: Math.max(...dataset.map(r => r.outcomes.biological_age_years))
    },
    mortalityRisk: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.mortality_risk_score, 0) / dataset.length,
      min: Math.min(...dataset.map(r => r.outcomes.mortality_risk_score)),
      max: Math.max(...dataset.map(r => r.outcomes.mortality_risk_score))
    },
    lifespan: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.estimated_lifespan_years, 0) / dataset.length,
      min: Math.min(...dataset.map(r => r.outcomes.estimated_lifespan_years)),
      max: Math.max(...dataset.map(r => r.outcomes.estimated_lifespan_years))
    },
    healthyAging: {
      avg: dataset.reduce((sum, r) => sum + r.healthy_aging_profile, 0) / dataset.length,
      min: Math.min(...dataset.map(r => r.healthy_aging_profile)),
      max: Math.max(...dataset.map(r => r.healthy_aging_profile))
    }
  };

  // Biomarker statistics
  const biomarkerStats = {
    crp: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.crp_mg_l, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.crp_mg_l < 3.0).length / dataset.length * 100
    },
    il6: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.il6_pg_ml, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.il6_pg_ml < 3.0).length / dataset.length * 100
    },
    igf1: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.igf1_ng_ml, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.igf1_ng_ml > 100 && r.outcomes.igf1_ng_ml < 300).length / dataset.length * 100
    },
    cortisol: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.cortisol_ug_dl, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.cortisol_ug_dl > 5 && r.outcomes.cortisol_ug_dl < 25).length / dataset.length * 100
    }
  };

  // Functional measures
  const functionalStats = {
    gripStrength: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.grip_strength_kg, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.grip_strength_kg > 20).length / dataset.length * 100
    },
    gaitSpeed: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.gait_speed_ms, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.gait_speed_ms > 1.0).length / dataset.length * 100
    },
    balance: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.balance_score, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.balance_score > 6).length / dataset.length * 100
    },
    frailty: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.frailty_index, 0) / dataset.length,
      low: dataset.filter(r => r.outcomes.frailty_index < 0.2).length / dataset.length * 100
    }
  };

  // Cognitive measures
  const cognitiveStats = {
    cognitive: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.cognitive_composite_score, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.cognitive_composite_score > 80).length / dataset.length * 100
    },
    processingSpeed: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.processing_speed_score, 0) / dataset.length,
      normal: dataset.filter(r => r.outcomes.processing_speed_score > 80).length / dataset.length * 100
    }
  };

  // Psychosocial outcomes
  const psychosocialStats = {
    lifeSatisfaction: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.life_satisfaction_score, 0) / dataset.length,
      high: dataset.filter(r => r.outcomes.life_satisfaction_score > 7).length / dataset.length * 100
    },
    stress: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.stress_level_score, 0) / dataset.length,
      low: dataset.filter(r => r.outcomes.stress_level_score < 5).length / dataset.length * 100
    },
    depression: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.depression_risk_score, 0) / dataset.length,
      low: dataset.filter(r => r.outcomes.depression_risk_score < 5).length / dataset.length * 100
    },
    socialSupport: {
      avg: dataset.reduce((sum, r) => sum + r.outcomes.social_support_score, 0) / dataset.length,
      high: dataset.filter(r => r.outcomes.social_support_score > 7).length / dataset.length * 100
    }
  };

  // Monthly trends
  const monthlyTrends = Array.from({ length: Math.max(...dataset.map(r => r.month)) + 1 }, (_, month) => {
    const monthData = dataset.filter(r => r.month === month);
    if (monthData.length === 0) return { 
      month: `Month ${month + 1}`, 
      biologicalAge: 0, 
      mortalityRisk: 0, 
      healthyAging: 0,
      lifeSatisfaction: 0
    };
    
    return {
      month: `Month ${month + 1}`,
      biologicalAge: monthData.reduce((sum, r) => sum + r.outcomes.biological_age_years, 0) / monthData.length,
      mortalityRisk: monthData.reduce((sum, r) => sum + r.outcomes.mortality_risk_score, 0) / monthData.length,
      healthyAging: monthData.reduce((sum, r) => sum + r.healthy_aging_profile, 0) / monthData.length,
      lifeSatisfaction: monthData.reduce((sum, r) => sum + r.outcomes.life_satisfaction_score, 0) / monthData.length
    };
  });

  // Age group analysis
  const ageGroupAnalysis = dataset.reduce((acc, record) => {
    const ageGroup = record.demographics.age_group;
    if (!acc[ageGroup]) {
      acc[ageGroup] = {
        count: 0,
        biologicalAge: 0,
        mortalityRisk: 0,
        healthyAging: 0
      };
    }
    acc[ageGroup].count++;
    acc[ageGroup].biologicalAge += record.outcomes.biological_age_years;
    acc[ageGroup].mortalityRisk += record.outcomes.mortality_risk_score;
    acc[ageGroup].healthyAging += record.healthy_aging_profile;
    return acc;
  }, {} as Record<string, any>);

  const ageGroupData = Object.entries(ageGroupAnalysis).map(([ageGroup, data]) => ({
    ageGroup,
    biologicalAge: data.biologicalAge / data.count,
    mortalityRisk: data.mortalityRisk / data.count,
    healthyAging: data.healthyAging / data.count,
    count: data.count
  }));

  // Health status distribution
  const healthStatusData = [
    { status: 'Excellent', count: dataset.filter(r => r.healthy_aging_profile >= 80).length / dataset.length * 100, color: '#82ca9d' },
    { status: 'Good', count: dataset.filter(r => r.healthy_aging_profile >= 60 && r.healthy_aging_profile < 80).length / dataset.length * 100, color: '#ffc658' },
    { status: 'Fair', count: dataset.filter(r => r.healthy_aging_profile >= 40 && r.healthy_aging_profile < 60).length / dataset.length * 100, color: '#ff7300' },
    { status: 'Poor', count: dataset.filter(r => r.healthy_aging_profile < 40).length / dataset.length * 100, color: '#d084d0' }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="outcome-analysis">
      <div className="analysis-header">
        <h2>Wellness & Aging Outcomes Analysis</h2>
        <p>Analysis of health outcomes, biomarkers, and aging trajectories</p>
      </div>

      <div className="outcome-sections">
        {/* Core Health Outcomes */}
        <div className="outcome-section">
          <h3>🏥 Core Health Outcomes</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Heart size={20} />
              <div className="stat-content">
                <div className="stat-value">{outcomeStats.biologicalAge.avg.toFixed(1)}</div>
                <div className="stat-label">Avg Biological Age</div>
                <div className="stat-subtitle">Range: {outcomeStats.biologicalAge.min.toFixed(1)} - {outcomeStats.biologicalAge.max.toFixed(1)}</div>
              </div>
            </div>
            <div className="stat-card">
              <AlertTriangle size={20} />
              <div className="stat-content">
                <div className="stat-value">{outcomeStats.mortalityRisk.avg.toFixed(2)}</div>
                <div className="stat-label">Avg Mortality Risk</div>
                <div className="stat-subtitle">Range: {outcomeStats.mortalityRisk.min.toFixed(2)} - {outcomeStats.mortalityRisk.max.toFixed(2)}</div>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp size={20} />
              <div className="stat-content">
                <div className="stat-value">{outcomeStats.lifespan.avg.toFixed(1)}</div>
                <div className="stat-label">Avg Estimated Lifespan</div>
                <div className="stat-subtitle">Range: {outcomeStats.lifespan.min.toFixed(1)} - {outcomeStats.lifespan.max.toFixed(1)}</div>
              </div>
            </div>
            <div className="stat-card">
              <CheckCircle size={20} />
              <div className="stat-content">
                <div className="stat-value">{outcomeStats.healthyAging.avg.toFixed(1)}</div>
                <div className="stat-label">Avg Healthy Aging Score</div>
                <div className="stat-subtitle">Range: {outcomeStats.healthyAging.min.toFixed(1)} - {outcomeStats.healthyAging.max.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Biomarkers */}
        <div className="outcome-section">
          <h3>🧬 Biomarkers</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{biomarkerStats.crp.avg.toFixed(2)}</div>
                <div className="stat-label">CRP (mg/L)</div>
                <div className="stat-subtitle">{biomarkerStats.crp.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{biomarkerStats.il6.avg.toFixed(2)}</div>
                <div className="stat-label">IL-6 (pg/mL)</div>
                <div className="stat-subtitle">{biomarkerStats.il6.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{biomarkerStats.igf1.avg.toFixed(0)}</div>
                <div className="stat-label">IGF-1 (ng/mL)</div>
                <div className="stat-subtitle">{biomarkerStats.igf1.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{biomarkerStats.cortisol.avg.toFixed(1)}</div>
                <div className="stat-label">Cortisol (μg/dL)</div>
                <div className="stat-subtitle">{biomarkerStats.cortisol.normal.toFixed(1)}% normal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Functional Measures */}
        <div className="outcome-section">
          <h3>💪 Functional Measures</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Activity size={20} />
              <div className="stat-content">
                <div className="stat-value">{functionalStats.gripStrength.avg.toFixed(1)}</div>
                <div className="stat-label">Grip Strength (kg)</div>
                <div className="stat-subtitle">{functionalStats.gripStrength.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{functionalStats.gaitSpeed.avg.toFixed(2)}</div>
                <div className="stat-label">Gait Speed (m/s)</div>
                <div className="stat-subtitle">{functionalStats.gaitSpeed.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{functionalStats.balance.avg.toFixed(1)}</div>
                <div className="stat-label">Balance Score</div>
                <div className="stat-subtitle">{functionalStats.balance.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{functionalStats.frailty.avg.toFixed(3)}</div>
                <div className="stat-label">Frailty Index</div>
                <div className="stat-subtitle">{functionalStats.frailty.low.toFixed(1)}% low frailty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cognitive & Psychosocial */}
        <div className="outcome-section">
          <h3>🧠 Cognitive & Psychosocial</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Brain size={20} />
              <div className="stat-content">
                <div className="stat-value">{cognitiveStats.cognitive.avg.toFixed(1)}</div>
                <div className="stat-label">Cognitive Score</div>
                <div className="stat-subtitle">{cognitiveStats.cognitive.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{cognitiveStats.processingSpeed.avg.toFixed(1)}</div>
                <div className="stat-label">Processing Speed</div>
                <div className="stat-subtitle">{cognitiveStats.processingSpeed.normal.toFixed(1)}% normal</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{psychosocialStats.lifeSatisfaction.avg.toFixed(1)}</div>
                <div className="stat-label">Life Satisfaction</div>
                <div className="stat-subtitle">{psychosocialStats.lifeSatisfaction.high.toFixed(1)}% high</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{psychosocialStats.stress.avg.toFixed(1)}</div>
                <div className="stat-label">Stress Level</div>
                <div className="stat-subtitle">{psychosocialStats.stress.low.toFixed(1)}% low stress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analysis-charts">
        <div className="chart-section">
          <h3>Health Outcomes Over Time</h3>
          <div className="chart-container full-width">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="biologicalAge" stroke="#8884d8" strokeWidth={2} name="Biological Age" />
                <Line yAxisId="right" type="monotone" dataKey="mortalityRisk" stroke="#ff7300" strokeWidth={2} name="Mortality Risk" />
                <Line yAxisId="left" type="monotone" dataKey="healthyAging" stroke="#82ca9d" strokeWidth={2} name="Healthy Aging Score" />
                <Line yAxisId="left" type="monotone" dataKey="lifeSatisfaction" stroke="#ffc658" strokeWidth={2} name="Life Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-section">
          <h3>Health Status Distribution</h3>
          <div className="charts-grid">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.status}: ${props.count.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {healthStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Outcomes by Age Group</h3>
          <div className="chart-container full-width">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="biologicalAge" fill="#8884d8" name="Biological Age" />
                <Bar yAxisId="right" dataKey="mortalityRisk" fill="#ff7300" name="Mortality Risk" />
                <Bar yAxisId="left" dataKey="healthyAging" fill="#82ca9d" name="Healthy Aging Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeAnalysis;
