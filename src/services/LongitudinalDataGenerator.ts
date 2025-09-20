import { Demographics, MonthlyRecord, DatasetConfig } from '../types';
import { EnhancedDemographicGenerator } from './DemographicGenerator';
import { ResearchValidatedTWAGenerator } from './TWABehaviorGenerator';
import { WellnessAgingOutcomeGenerator } from './OutcomeGenerator';

export class LongitudinalTWADataGenerator {
  private demographicGen: EnhancedDemographicGenerator;
  private twaGen: ResearchValidatedTWAGenerator;
  private outcomeGen: WellnessAgingOutcomeGenerator;

  constructor() {
    this.demographicGen = new EnhancedDemographicGenerator();
    this.twaGen = new ResearchValidatedTWAGenerator();
    this.outcomeGen = new WellnessAgingOutcomeGenerator();
  }

  async generateCompleteDataset(config: DatasetConfig): Promise<MonthlyRecord[]> {
    console.log(`Generating longitudinal dataset: ${config.n_subjects} subjects, ${config.months} months`);

    // Generate base demographics
    const demographics = this.demographicGen.generateCorrelatedDemographics(config.n_subjects);
    
    const completeDataset: MonthlyRecord[] = [];

    for (const person of demographics) {
      const baselineAge = person.age_numeric;

      // Generate monthly observations
      for (let month = 0; month < config.months; month++) {
        const season = this.monthToSeason(month);

        // Generate TWA behaviors for this month
        const twaBehaviors = this.twaGen.generateMonthlyTWABehaviors(
          person, month, season
        );

        // Generate wellness/aging outcomes
        const outcomes = this.outcomeGen.generateAgingWellnessOutcomes(
          person, twaBehaviors, baselineAge, month
        );

        // Compile complete monthly record
        const monthlyRecord: MonthlyRecord = {
          // Identifiers
          subject_id: person.id,
          month,
          season,
          observation_date: this.generateObservationDate(month),

          // Demographics (time-invariant)
          demographics: person,

          // TWA Behaviors
          behaviors: twaBehaviors,

          // Wellness & Aging Outcomes
          outcomes,

          // Research validation variables
          meets_exercise_guidelines: twaBehaviors.motion_days_week >= 3,
          meets_sleep_guidelines: twaBehaviors.sleep_hours >= 7 && twaBehaviors.sleep_quality_score >= 6,
          high_diet_quality: twaBehaviors.diet_mediterranean_score >= 7,
          regular_meditation: twaBehaviors.meditation_minutes_week >= 150,
          strong_social_support: twaBehaviors.social_connections_count >= 4,
          high_purpose: twaBehaviors.purpose_meaning_score >= 8,
          healthy_aging_profile: this.calculateHealthyAgingProfile(twaBehaviors, outcomes),
          blue_zone_similarity_score: this.calculateBlueZoneSimilarity(twaBehaviors, person)
        };

        completeDataset.push(monthlyRecord);
      }

      if (completeDataset.length % 10000 === 0) {
        console.log(`Generated ${completeDataset.length} records...`);
      }
    }

    return completeDataset;
  }

  private monthToSeason(month: number): 'Spring' | 'Summer' | 'Fall' | 'Winter' {
    const seasons: ('Spring' | 'Summer' | 'Fall' | 'Winter')[] = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'];
    return seasons[month % 12];
  }

  private generateObservationDate(month: number): string {
    const year = 2024;
    const monthNum = (month % 12) + 1;
    return `${year}-${monthNum.toString().padStart(2, '0')}-15`;
  }

  private calculateHealthyAgingProfile(behaviors: any, outcomes: any): number {
    let score = 0;

    // Behavioral components (40% weight)
    const behavioralScore = (
      (behaviors.motion_days_week / 7) * 0.15 +
      (behaviors.diet_mediterranean_score / 10) * 0.15 +
      (Math.min(behaviors.meditation_minutes_week, 300) / 300) * 0.10
    );

    // Biological components (40% weight) 
    const biologicalScore = (
      Math.max(0, (85 - outcomes.biological_age_years) / 85) * 0.20 +
      (1 - Math.min(outcomes.mortality_risk_score, 1)) * 0.20
    );

    // Psychosocial components (20% weight)
    const psychosocialScore = (
      (outcomes.life_satisfaction_score / 10) * 0.10 +
      (behaviors.purpose_meaning_score / 10) * 0.10
    );

    const totalScore = (behavioralScore + biologicalScore + psychosocialScore) * 100;
    return Math.min(100, Math.max(0, totalScore));
  }

  private calculateBlueZoneSimilarity(behaviors: any, demographics: Demographics): number {
    const similarityFactors = {
      'plant_rich_diet': Math.min(behaviors.diet_mediterranean_score / 8, 1),
      'natural_movement': Math.min(behaviors.motion_days_week / 5, 1),
      'stress_management': Math.min(behaviors.meditation_minutes_week / 150, 1),
      'social_connections': Math.min(behaviors.social_connections_count / 4, 1),
      'purpose_driven': Math.min(behaviors.purpose_meaning_score / 8, 1),
      'moderate_alcohol': behaviors.alcohol_drinks_week <= 7 ? 1 : 0,
      'no_smoking': behaviors.smoking_status === 'Never' ? 1 : 0
    };

    return Object.values(similarityFactors).reduce((sum, factor) => sum + factor, 0) / Object.keys(similarityFactors).length * 100;
  }

  // Validation methods
  validateDataset(dataset: MonthlyRecord[]): any {
    const validationResults = {
      demographic_accuracy: this.validateDemographicAccuracy(dataset),
      behavior_correlations: this.validateBehaviorCorrelations(dataset),
      outcome_validity: this.validateOutcomeValidity(dataset),
      longitudinal_coherence: this.validateLongitudinalCoherence(dataset)
    };

    return validationResults;
  }

  private validateDemographicAccuracy(dataset: MonthlyRecord[]): any {
    // Sample first record of each subject for demographic validation
    const subjects = new Map();
    dataset.forEach(record => {
      if (!subjects.has(record.subject_id)) {
        subjects.set(record.subject_id, record.demographics);
      }
    });

    const demographics = Array.from(subjects.values());
    
    // Calculate age distribution
    const ageGroups = demographics.map(d => d.age_group);
    const ageDistribution = this.calculateDistribution(ageGroups);
    
    // Calculate income-education correlation
    const incomeEducationCorr = this.calculateCorrelation(
      demographics.map(d => d.income_numeric),
      demographics.map(d => this.educationToNumeric(d.education))
    );
    
    // Calculate fitness-age relationship
    const fitnessAgeCorr = this.calculateCorrelation(
      demographics.map(d => d.age_numeric),
      demographics.map(d => this.fitnessToNumeric(d.fitness_level))
    );

    return {
      age_distribution_ks_test: this.kolmogorovSmirnovTest(ageDistribution, this.getExpectedAgeDistribution()),
      income_education_correlation: incomeEducationCorr,
      fitness_age_relationship: fitnessAgeCorr
    };
  }

  private validateBehaviorCorrelations(dataset: MonthlyRecord[]): any {
    const exerciseSleepCorr = this.calculateCorrelation(
      dataset.map(r => r.behaviors.motion_days_week),
      dataset.map(r => r.behaviors.sleep_quality_score)
    );

    const dietMeditationCorr = this.calculateCorrelation(
      dataset.map(r => r.behaviors.diet_mediterranean_score),
      dataset.map(r => r.behaviors.meditation_minutes_week)
    );

    const socialPurposeCorr = this.calculateCorrelation(
      dataset.map(r => r.behaviors.social_connections_count),
      dataset.map(r => r.behaviors.purpose_meaning_score)
    );

    return {
      exercise_sleep_correlation: exerciseSleepCorr,
      diet_meditation_correlation: dietMeditationCorr,
      social_purpose_correlation: socialPurposeCorr
    };
  }

  private validateOutcomeValidity(dataset: MonthlyRecord[]): any {
    // Validate biological age effects
    const highExercise = dataset.filter(r => r.behaviors.motion_days_week >= 4);
    const lowExercise = dataset.filter(r => r.behaviors.motion_days_week < 2);
    
    const exerciseEffect = highExercise.length > 0 && lowExercise.length > 0 
      ? this.calculateMeanDifference(highExercise.map(r => r.outcomes.biological_age_years), 
                                   lowExercise.map(r => r.outcomes.biological_age_years))
      : 0;

    // Validate mortality risk factors
    const smokers = dataset.filter(r => r.behaviors.smoking_status === 'Current');
    const nonSmokers = dataset.filter(r => r.behaviors.smoking_status === 'Never');
    
    const smokingEffect = smokers.length > 0 && nonSmokers.length > 0
      ? this.calculateMeanDifference(smokers.map(r => r.outcomes.mortality_risk_score),
                                   nonSmokers.map(r => r.outcomes.mortality_risk_score))
      : 0;

    // Validate purpose-longevity relationship
    const highPurpose = dataset.filter(r => r.behaviors.purpose_meaning_score >= 8);
    const lowPurpose = dataset.filter(r => r.behaviors.purpose_meaning_score <= 4);
    
    const purposeEffect = highPurpose.length > 0 && lowPurpose.length > 0
      ? this.calculateMeanDifference(highPurpose.map(r => r.outcomes.estimated_lifespan_years),
                                   lowPurpose.map(r => r.outcomes.estimated_lifespan_years))
      : 0;

    return {
      biological_age_effects: exerciseEffect,
      mortality_risk_factors: smokingEffect,
      purpose_longevity_relationship: purposeEffect
    };
  }

  private validateLongitudinalCoherence(dataset: MonthlyRecord[]): any {
    // Group by subject
    const subjectGroups = new Map<string, MonthlyRecord[]>();
    dataset.forEach(record => {
      if (!subjectGroups.has(record.subject_id)) {
        subjectGroups.set(record.subject_id, []);
      }
      subjectGroups.get(record.subject_id)!.push(record);
    });

    // Calculate seasonal variations
    const seasonalVariations = this.calculateSeasonalVariations(dataset);
    
    // Calculate aging trajectories
    const agingTrajectories = this.calculateAgingTrajectories(Array.from(subjectGroups.values()));
    
    // Calculate behavior stability
    const behaviorStability = this.calculateBehaviorStability(Array.from(subjectGroups.values()));

    return {
      seasonal_variations: seasonalVariations,
      aging_trajectories: agingTrajectories,
      behavior_stability: behaviorStability
    };
  }

  // Helper methods
  private calculateDistribution(items: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    items.forEach(item => {
      distribution[item] = (distribution[item] || 0) + 1;
    });
    return distribution;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateMeanDifference(group1: number[], group2: number[]): number {
    if (group1.length === 0 || group2.length === 0) return 0;
    
    const mean1 = group1.reduce((sum, val) => sum + val, 0) / group1.length;
    const mean2 = group2.reduce((sum, val) => sum + val, 0) / group2.length;
    
    return mean1 - mean2;
  }

  private kolmogorovSmirnovTest(observed: Record<string, number>, expected: Record<string, number>): number {
    // Simplified KS test implementation
    const totalObserved = Object.values(observed).reduce((sum, count) => sum + count, 0);
    const totalExpected = Object.values(expected).reduce((sum, count) => sum + count, 0);
    
    let maxDifference = 0;
    const allKeys = new Set([...Object.keys(observed), ...Object.keys(expected)]);
    
    allKeys.forEach(key => {
      const observedProp = (observed[key] || 0) / totalObserved;
      const expectedProp = (expected[key] || 0) / totalExpected;
      maxDifference = Math.max(maxDifference, Math.abs(observedProp - expectedProp));
    });
    
    return maxDifference;
  }

  private getExpectedAgeDistribution(): Record<string, number> {
    return {
      '18-24': 11,
      '25-34': 14,
      '35-44': 13,
      '45-54': 12,
      '55-64': 13,
      '65-74': 11,
      '75+': 7
    };
  }

  private educationToNumeric(education: string): number {
    const map: Record<string, number> = {
      'Less than HS': 1,
      'High School': 2,
      'Some College': 3,
      'Bachelor+': 4
    };
    return map[education] || 2;
  }

  private fitnessToNumeric(fitness: string): number {
    const map: Record<string, number> = {
      'Low': 1,
      'Medium': 2,
      'High': 3
    };
    return map[fitness] || 2;
  }

  private calculateSeasonalVariations(dataset: MonthlyRecord[]): number {
    const seasonalData = {
      'Spring': dataset.filter(r => r.season === 'Spring'),
      'Summer': dataset.filter(r => r.season === 'Summer'),
      'Fall': dataset.filter(r => r.season === 'Fall'),
      'Winter': dataset.filter(r => r.season === 'Winter')
    };

    const seasonalMeans = Object.entries(seasonalData).map(([season, records]) => ({
      season,
      mean: records.reduce((sum, r) => sum + r.behaviors.motion_days_week, 0) / records.length
    }));

    const overallMean = seasonalMeans.reduce((sum, s) => sum + s.mean, 0) / seasonalMeans.length;
    const variance = seasonalMeans.reduce((sum, s) => sum + Math.pow(s.mean - overallMean, 2), 0) / seasonalMeans.length;
    
    return Math.sqrt(variance);
  }

  private calculateAgingTrajectories(subjectGroups: MonthlyRecord[][]): number {
    let totalSlope = 0;
    let validSubjects = 0;

    subjectGroups.forEach(subjectRecords => {
      if (subjectRecords.length < 2) return;
      
      const sortedRecords = subjectRecords.sort((a, b) => a.month - b.month);
      const ages = sortedRecords.map(r => r.outcomes.biological_age_years);
      const months = sortedRecords.map(r => r.month);
      
      const slope = this.calculateLinearSlope(months, ages);
      if (!isNaN(slope)) {
        totalSlope += slope;
        validSubjects++;
      }
    });

    return validSubjects > 0 ? totalSlope / validSubjects : 0;
  }

  private calculateBehaviorStability(subjectGroups: MonthlyRecord[][]): number {
    let totalStability = 0;
    let validSubjects = 0;

    subjectGroups.forEach(subjectRecords => {
      if (subjectRecords.length < 2) return;
      
      const sortedRecords = subjectRecords.sort((a, b) => a.month - b.month);
      const behaviors = sortedRecords.map(r => r.behaviors.motion_days_week);
      
      const variance = this.calculateVariance(behaviors);
      const mean = behaviors.reduce((sum, val) => sum + val, 0) / behaviors.length;
      const stability = mean > 0 ? 1 - (variance / (mean * mean)) : 0;
      
      totalStability += stability;
      validSubjects++;
    });

    return validSubjects > 0 ? totalStability / validSubjects : 0;
  }

  private calculateLinearSlope(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return isNaN(slope) ? 0 : slope;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
}
