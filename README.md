# TWA Research Dashboard

Enhanced Synthetic US Wellness & Aging Dataset Generation with TWA Impact Modeling

## Overview

This React application implements a comprehensive research framework for generating synthetic datasets focused on wellness and aging outcomes. Based on the latest longevity research, it creates scientifically rigorous synthetic data that links Tiny Wellness Activities (TWA) to validated wellness and aging outcomes.

## Features

### 🔬 Research-Grounded Data Generation
- **14 validated biomarkers** of aging based on expert consensus
- **Blue Zone lifestyle patterns** integration
- **Evidence-based behavior correlations** from peer-reviewed studies
- **Longitudinal aging trajectories** with seasonal variations
- **Research-validated effect sizes** for all outcomes

### 📊 Interactive Dashboard
- **Dataset Overview**: Demographic distributions, health outcomes trends
- **TWA Behavior Analysis**: Do More, Do Less, and Connection & Purpose activities
- **Wellness Outcomes Analysis**: Biomarkers, functional measures, cognitive assessments
- **Research Validation**: Benchmark validation against published studies
- **Export Functionality**: JSON, CSV, and Excel export options

### 🎯 TWA Framework

#### Do More Activities (Protective)
- **Motion**: Days/week vigorous activity (0-7)
- **Sleep**: Hours/night + sleep quality (1-10)
- **Hydration**: Cups/day (4-12)
- **Diet Quality**: Mediterranean adherence (0-100)
- **Meditation/Destress**: Minutes/week (0-300)

#### Do Less Activities (Risk)
- **Smoking**: Never/Former/Current status
- **Excessive Alcohol**: Drinks/week (>14 risk threshold)
- **Added Sugars**: Grams/day (>50g risk)
- **Excess Sodium**: Grams/day (>6g risk)
- **Ultra-processed Foods**: Servings/week (>10 risk)

#### Connection & Purpose
- **Social Networks**: Close relationships count (0-10)
- **Nature Connection**: Minutes/week in greenspace
- **Cultural Engagement**: Hours/week music/art
- **Purpose/Meaning**: Life purpose scale (1-10)

## Scientific Foundation

### Research Evidence Integration
- **Methylation-supportive diet/lifestyle**: 4.6-year biological age reduction
- **Mediterranean diet + exercise**: 0.66-year GrimAge reduction
- **Social connection impact**: 50% greater longevity chance
- **Purpose in life**: 40% mortality risk reduction (HR=0.60)

### Biomarkers of Aging
- **Physiological**: IGF-1, GDF-15, CRP, IL-6
- **Functional**: Muscle mass/strength, grip strength, gait speed, balance
- **Cognitive**: Cognitive health assessments
- **Epigenetic**: DNA methylation clocks (Horvath, GrimAge, PhenoAge)

## Getting Started

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd twa-research-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Usage

### 1. Configure Dataset Parameters
- **Number of Subjects**: 100 (Quick Test) to 25,000 (Research Grade)
- **Time Period**: 3-36 months of longitudinal data
- **Export Format**: JSON, CSV, or Excel
- **Validation**: Enable research benchmark validation

### 2. Generate Dataset
Click "Generate Dataset" to create synthetic data based on your parameters. The system will:
- Generate correlated demographic profiles
- Create realistic TWA behavior patterns
- Calculate wellness and aging outcomes
- Validate against research benchmarks

### 3. Explore Results
Navigate through the dashboard tabs to explore:
- **Dataset Overview**: Basic statistics and demographic distributions
- **TWA Behaviors**: Analysis of lifestyle activities and patterns
- **Wellness Outcomes**: Health metrics, biomarkers, and aging indicators
- **Validation**: Research benchmark validation results
- **Export**: Download data in various formats

## Data Structure

### Demographics (12 variables)
- Age group, gender, ethnicity, education, income
- Fitness level, sleep type, region, urban/rural
- Occupation and other demographic factors

### TWA Behaviors (14 variables)
- **Do More**: Motion, sleep, hydration, diet, meditation
- **Do Less**: Smoking, alcohol, sugar, sodium, processed foods
- **Connection & Purpose**: Social, nature, cultural, purpose

### Wellness Outcomes (20+ variables)
- **Core Health**: Biological age, mortality risk, lifespan
- **Biomarkers**: CRP, IL-6, IGF-1, GDF-15, cortisol
- **Functional**: Grip strength, gait speed, balance, frailty
- **Cognitive**: Composite score, processing speed
- **Psychosocial**: Life satisfaction, stress, depression risk

### Research Validation (8 variables)
- Exercise guidelines compliance
- Sleep guidelines compliance
- High diet quality indicators
- Regular meditation practice
- Strong social support
- High purpose scores
- Healthy aging profile
- Blue Zone similarity score

## Research Applications

1. **TWA Intervention Modeling**: Predict biological age changes from lifestyle modifications
2. **Personalized Longevity Planning**: Individual risk/benefit analysis for behavior changes
3. **Population Health Insights**: Demographic patterns in healthy aging trajectories
4. **Blue Zone Replication**: Test which combinations of factors drive longevity
5. **Biomarker Discovery**: Identify novel aging biomarkers from behavior patterns

## Validation Benchmarks

- **Purpose-Mortality Relationship**: HR ~0.60 (matches Boyle et al.)
- **Exercise-Biological Age**: -1.2 years for regular exercisers
- **Social Connection Impact**: 50% mortality reduction
- **Mediterranean Diet Effect**: -2.3 years biological age

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Recharts** for data visualization
- **Lucide React** for icons
- **Modern CSS** with responsive design

### Data Generation
- **Demographic Generator**: Correlated demographic profiles
- **TWA Behavior Generator**: Research-validated behavior patterns
- **Outcome Generator**: Aging and wellness outcome modeling
- **Longitudinal Generator**: Time-series data with seasonal effects

### Validation Framework
- **Demographic Accuracy**: Age distribution, income-education correlation
- **Behavior Correlations**: Exercise-sleep, diet-meditation, social-purpose
- **Outcome Validity**: Biological age effects, mortality risk factors
- **Longitudinal Coherence**: Seasonal variations, aging trajectories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Citation

If you use this dataset in research, please cite the underlying research studies referenced in the generation methodology.

## Acknowledgments

- Research evidence from peer-reviewed longevity studies
- Blue Zone lifestyle research
- Expert consensus on biomarkers of aging
- Longitudinal aging research frameworks