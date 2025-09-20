import React from 'react';
import { MonthlyRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Moon, Droplets, Apple, Brain, Users, TreePine, Music, Target } from 'lucide-react';

interface BehaviorAnalysisProps {
  dataset: MonthlyRecord[];
}

const BehaviorAnalysis: React.FC<BehaviorAnalysisProps> = ({ dataset }) => {
  // Do More Activities Analysis
  const doMoreStats = {
    motion: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.motion_days_week, 0) / dataset.length,
      meets_guidelines: dataset.filter(r => r.behaviors.motion_days_week >= 3).length / dataset.length * 100
    },
    sleep: {
      avg_hours: dataset.reduce((sum, r) => sum + r.behaviors.sleep_hours, 0) / dataset.length,
      avg_quality: dataset.reduce((sum, r) => sum + r.behaviors.sleep_quality_score, 0) / dataset.length,
      meets_guidelines: dataset.filter(r => r.behaviors.sleep_hours >= 7 && r.behaviors.sleep_quality_score >= 6).length / dataset.length * 100
    },
    hydration: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.hydration_cups_day, 0) / dataset.length
    },
    diet: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.diet_mediterranean_score, 0) / dataset.length,
      high_quality: dataset.filter(r => r.behaviors.diet_mediterranean_score >= 7).length / dataset.length * 100
    },
    meditation: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.meditation_minutes_week, 0) / dataset.length,
      regular: dataset.filter(r => r.behaviors.meditation_minutes_week >= 150).length / dataset.length * 100
    }
  };

  // Do Less Activities Analysis
  const doLessStats = {
    smoking: {
      never: dataset.filter(r => r.behaviors.smoking_status === 'Never').length / dataset.length * 100,
      former: dataset.filter(r => r.behaviors.smoking_status === 'Former').length / dataset.length * 100,
      current: dataset.filter(r => r.behaviors.smoking_status === 'Current').length / dataset.length * 100
    },
    alcohol: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.alcohol_drinks_week, 0) / dataset.length,
      heavy_drinking: dataset.filter(r => r.behaviors.alcohol_drinks_week > 14).length / dataset.length * 100
    },
    sugar: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.added_sugar_grams_day, 0) / dataset.length,
      high_intake: dataset.filter(r => r.behaviors.added_sugar_grams_day > 50).length / dataset.length * 100
    },
    sodium: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.sodium_grams_day, 0) / dataset.length,
      high_intake: dataset.filter(r => r.behaviors.sodium_grams_day > 6).length / dataset.length * 100
    },
    processed_foods: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.processed_food_servings_week, 0) / dataset.length,
      high_intake: dataset.filter(r => r.behaviors.processed_food_servings_week > 10).length / dataset.length * 100
    }
  };

  // Connection & Purpose Analysis
  const connectionStats = {
    social: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.social_connections_count, 0) / dataset.length,
      strong_support: dataset.filter(r => r.behaviors.social_connections_count >= 4).length / dataset.length * 100
    },
    nature: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.nature_minutes_week, 0) / dataset.length
    },
    cultural: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.cultural_hours_week, 0) / dataset.length
    },
    purpose: {
      avg: dataset.reduce((sum, r) => sum + r.behaviors.purpose_meaning_score, 0) / dataset.length,
      high_purpose: dataset.filter(r => r.behaviors.purpose_meaning_score >= 8).length / dataset.length * 100
    }
  };

  // Monthly trends
  const monthlyTrends = Array.from({ length: Math.max(...dataset.map(r => r.month)) + 1 }, (_, month) => {
    const monthData = dataset.filter(r => r.month === month);
    if (monthData.length === 0) return { month: `Month ${month + 1}`, motion: 0, sleep: 0, diet: 0, meditation: 0 };
    
    return {
      month: `Month ${month + 1}`,
      motion: monthData.reduce((sum, r) => sum + r.behaviors.motion_days_week, 0) / monthData.length,
      sleep: monthData.reduce((sum, r) => sum + r.behaviors.sleep_quality_score, 0) / monthData.length,
      diet: monthData.reduce((sum, r) => sum + r.behaviors.diet_mediterranean_score, 0) / monthData.length,
      meditation: monthData.reduce((sum, r) => sum + r.behaviors.meditation_minutes_week, 0) / monthData.length
    };
  });

  // Behavior correlations
  const correlationData = [
    { behavior: 'Exercise', sleep: doMoreStats.motion.avg, diet: doMoreStats.diet.avg, meditation: doMoreStats.meditation.avg / 10 },
    { behavior: 'Sleep Quality', sleep: doMoreStats.sleep.avg_quality, diet: doMoreStats.diet.avg, meditation: doMoreStats.meditation.avg / 10 },
    { behavior: 'Diet Quality', sleep: doMoreStats.sleep.avg_quality, diet: doMoreStats.diet.avg, meditation: doMoreStats.meditation.avg / 10 }
  ];

  // Smoking distribution
  const smokingData = [
    { status: 'Never', count: doLessStats.smoking.never, color: '#82ca9d' },
    { status: 'Former', count: doLessStats.smoking.former, color: '#ffc658' },
    { status: 'Current', count: doLessStats.smoking.current, color: '#ff7300' }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="behavior-analysis">
      <div className="analysis-header">
        <h2>TWA Behavior Analysis</h2>
        <p>Analysis of Tiny Wellness Activities (TWA) behaviors and their patterns</p>
      </div>

      <div className="behavior-sections">
        {/* Do More Activities */}
        <div className="behavior-section">
          <h3>🏃‍♂️ Do More Activities</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Activity size={20} />
              <div className="stat-content">
                <div className="stat-value">{doMoreStats.motion.avg.toFixed(1)}</div>
                <div className="stat-label">Days/Week Exercise</div>
                <div className="stat-subtitle">{doMoreStats.motion.meets_guidelines.toFixed(1)}% meet guidelines</div>
              </div>
            </div>
            <div className="stat-card">
              <Moon size={20} />
              <div className="stat-content">
                <div className="stat-value">{doMoreStats.sleep.avg_hours.toFixed(1)}h</div>
                <div className="stat-label">Sleep Hours</div>
                <div className="stat-subtitle">Quality: {doMoreStats.sleep.avg_quality.toFixed(1)}/10</div>
              </div>
            </div>
            <div className="stat-card">
              <Droplets size={20} />
              <div className="stat-content">
                <div className="stat-value">{doMoreStats.hydration.avg.toFixed(1)}</div>
                <div className="stat-label">Cups/Day Hydration</div>
              </div>
            </div>
            <div className="stat-card">
              <Apple size={20} />
              <div className="stat-content">
                <div className="stat-value">{doMoreStats.diet.avg.toFixed(1)}</div>
                <div className="stat-label">Mediterranean Diet Score</div>
                <div className="stat-subtitle">{doMoreStats.diet.high_quality.toFixed(1)}% high quality</div>
              </div>
            </div>
            <div className="stat-card">
              <Brain size={20} />
              <div className="stat-content">
                <div className="stat-value">{doMoreStats.meditation.avg.toFixed(0)}</div>
                <div className="stat-label">Min/Week Meditation</div>
                <div className="stat-subtitle">{doMoreStats.meditation.regular.toFixed(1)}% regular practice</div>
              </div>
            </div>
          </div>
        </div>

        {/* Do Less Activities */}
        <div className="behavior-section">
          <h3>🚫 Do Less Activities</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{doLessStats.smoking.never.toFixed(1)}%</div>
                <div className="stat-label">Never Smoked</div>
                <div className="stat-subtitle">{doLessStats.smoking.current.toFixed(1)}% current smokers</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{doLessStats.alcohol.avg.toFixed(1)}</div>
                <div className="stat-label">Drinks/Week</div>
                <div className="stat-subtitle">{doLessStats.alcohol.heavy_drinking.toFixed(1)}% heavy drinking</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{doLessStats.sugar.avg.toFixed(1)}g</div>
                <div className="stat-label">Added Sugar/Day</div>
                <div className="stat-subtitle">{doLessStats.sugar.high_intake.toFixed(1)}% high intake</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{doLessStats.sodium.avg.toFixed(1)}g</div>
                <div className="stat-label">Sodium/Day</div>
                <div className="stat-subtitle">{doLessStats.sodium.high_intake.toFixed(1)}% high intake</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{doLessStats.processed_foods.avg.toFixed(1)}</div>
                <div className="stat-label">Processed Servings/Week</div>
                <div className="stat-subtitle">{doLessStats.processed_foods.high_intake.toFixed(1)}% high intake</div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection & Purpose */}
        <div className="behavior-section">
          <h3>🤝 Connection & Purpose</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Users size={20} />
              <div className="stat-content">
                <div className="stat-value">{connectionStats.social.avg.toFixed(1)}</div>
                <div className="stat-label">Social Connections</div>
                <div className="stat-subtitle">{connectionStats.social.strong_support.toFixed(1)}% strong support</div>
              </div>
            </div>
            <div className="stat-card">
              <TreePine size={20} />
              <div className="stat-content">
                <div className="stat-value">{connectionStats.nature.avg.toFixed(0)}</div>
                <div className="stat-label">Nature Min/Week</div>
              </div>
            </div>
            <div className="stat-card">
              <Music size={20} />
              <div className="stat-content">
                <div className="stat-value">{connectionStats.cultural.avg.toFixed(1)}</div>
                <div className="stat-label">Cultural Hours/Week</div>
              </div>
            </div>
            <div className="stat-card">
              <Target size={20} />
              <div className="stat-content">
                <div className="stat-value">{connectionStats.purpose.avg.toFixed(1)}</div>
                <div className="stat-label">Purpose Score</div>
                <div className="stat-subtitle">{connectionStats.purpose.high_purpose.toFixed(1)}% high purpose</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analysis-charts">
        <div className="chart-section">
          <h3>Behavior Trends Over Time</h3>
          <div className="chart-container full-width">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="motion" stroke="#8884d8" strokeWidth={2} name="Exercise Days" />
                <Line yAxisId="left" type="monotone" dataKey="sleep" stroke="#82ca9d" strokeWidth={2} name="Sleep Quality" />
                <Line yAxisId="left" type="monotone" dataKey="diet" stroke="#ffc658" strokeWidth={2} name="Diet Score" />
                <Line yAxisId="right" type="monotone" dataKey="meditation" stroke="#ff7300" strokeWidth={2} name="Meditation Min" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-section">
          <h3>Smoking Status Distribution</h3>
          <div className="charts-grid">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={smokingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.status}: ${props.count.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {smokingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorAnalysis;
