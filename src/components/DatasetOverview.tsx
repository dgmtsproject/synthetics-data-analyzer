import React from 'react';
import { MonthlyRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';

interface DatasetOverviewProps {
  dataset: MonthlyRecord[];
}

const DatasetOverview: React.FC<DatasetOverviewProps> = ({ dataset }) => {
  // Calculate basic statistics
  const totalRecords = dataset.length;
  const uniqueSubjects = new Set(dataset.map(r => r.subject_id)).size;
  const months = Math.max(...dataset.map(r => r.month)) + 1;
  
  // Age distribution
  const ageDistribution = dataset.reduce((acc, record) => {
    const ageGroup = record.demographics.age_group;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageData = Object.entries(ageDistribution).map(([ageGroup, count]) => ({
    ageGroup,
    count,
    percentage: (count / totalRecords * 100).toFixed(1)
  }));

  // Gender distribution
  const genderDistribution = dataset.reduce((acc, record) => {
    const gender = record.demographics.gender;
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderData = Object.entries(genderDistribution).map(([gender, count]) => ({
    gender,
    count,
    percentage: (count / totalRecords * 100).toFixed(1)
  }));

  // Education distribution
  const educationDistribution = dataset.reduce((acc, record) => {
    const education = record.demographics.education;
    acc[education] = (acc[education] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const educationData = Object.entries(educationDistribution).map(([education, count]) => ({
    education,
    count,
    percentage: (count / totalRecords * 100).toFixed(1)
  }));

  // Income distribution
  const incomeDistribution = dataset.reduce((acc, record) => {
    const income = record.demographics.income_bracket;
    acc[income] = (acc[income] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const incomeData = Object.entries(incomeDistribution).map(([income, count]) => ({
    income,
    count,
    percentage: (count / totalRecords * 100).toFixed(1)
  }));

  // Regional distribution
  const regionalDistribution = dataset.reduce((acc, record) => {
    const region = record.demographics.region;
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionalData = Object.entries(regionalDistribution).map(([region, count]) => ({
    region,
    count,
    percentage: (count / totalRecords * 100).toFixed(1)
  }));

  // Health outcomes over time
  const monthlyAverages = Array.from({ length: months }, (_, month) => {
    const monthData = dataset.filter(r => r.month === month);
    if (monthData.length === 0) return { month, biologicalAge: 0, mortalityRisk: 0, healthyAging: 0 };
    
    const avgBiologicalAge = monthData.reduce((sum, r) => sum + r.outcomes.biological_age_years, 0) / monthData.length;
    const avgMortalityRisk = monthData.reduce((sum, r) => sum + r.outcomes.mortality_risk_score, 0) / monthData.length;
    const avgHealthyAging = monthData.reduce((sum, r) => sum + r.healthy_aging_profile, 0) / monthData.length;
    
    return {
      month: `Month ${month + 1}`,
      biologicalAge: Math.round(avgBiologicalAge * 10) / 10,
      mortalityRisk: Math.round(avgMortalityRisk * 100) / 100,
      healthyAging: Math.round(avgHealthyAging * 10) / 10
    };
  });

  // Color schemes
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="dataset-overview">
      <div className="overview-header">
        <h2>Dataset Overview</h2>
        <div className="overview-stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <div className="stat-value">{uniqueSubjects.toLocaleString()}</div>
              <div className="stat-label">Subjects</div>
            </div>
          </div>
          <div className="stat-card">
            <Calendar size={24} />
            <div>
              <div className="stat-value">{totalRecords.toLocaleString()}</div>
              <div className="stat-label">Records</div>
            </div>
          </div>
          <div className="stat-card">
            <Activity size={24} />
            <div>
              <div className="stat-value">{months}</div>
              <div className="stat-label">Months</div>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={24} />
            <div>
              <div className="stat-value">{Math.round(totalRecords / uniqueSubjects)}</div>
              <div className="stat-label">Records/Subject</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-charts">
        <div className="chart-section">
          <h3>Demographic Distribution</h3>
          <div className="charts-grid">
            <div className="chart-container">
              <h4>Age Groups</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, 'Count']} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h4>Gender Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percentage }) => `${gender}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Socioeconomic Distribution</h3>
          <div className="charts-grid">
            <div className="chart-container">
              <h4>Education Level</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={educationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="education" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, 'Count']} />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h4>Income Brackets</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="income" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, 'Count']} />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Geographic Distribution</h3>
          <div className="charts-grid">
            <div className="chart-container">
              <h4>US Regions</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, 'Count']} />
                  <Bar dataKey="count" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Health Outcomes Over Time</h3>
          <div className="charts-grid">
            <div className="chart-container full-width">
              <h4>Biological Age and Mortality Risk Trends</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyAverages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="biologicalAge" stroke="#8884d8" strokeWidth={2} name="Biological Age" />
                  <Line yAxisId="right" type="monotone" dataKey="mortalityRisk" stroke="#ff7300" strokeWidth={2} name="Mortality Risk" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetOverview;
