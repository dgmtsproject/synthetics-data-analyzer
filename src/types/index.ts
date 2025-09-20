// Core data types for TWA Research Dashboard

export interface Demographics {
  id: string;
  age_group: string;
  age_numeric: number;
  gender: 'Male' | 'Female' | 'Non-binary';
  ethnicity: 'White' | 'Hispanic' | 'Black' | 'Asian' | 'Other';
  education: 'Less than HS' | 'High School' | 'Some College' | 'Bachelor+';
  income_bracket: '<$35k' | '$35-75k' | '$75-100k' | '>$100k';
  income_numeric: number;
  fitness_level: 'Low' | 'Medium' | 'High';
  sleep_type: 'Regular' | 'Short' | 'Irregular';
  region: 'Northeast' | 'Midwest' | 'South' | 'West';
  urban_rural: 'Urban' | 'Suburban' | 'Rural';
  occupation: string;
}

export interface TWABehaviors {
  // Do More Activities
  motion_days_week: number;
  sleep_hours: number;
  sleep_quality_score: number;
  hydration_cups_day: number;
  diet_mediterranean_score: number;
  meditation_minutes_week: number;
  
  // Do Less Activities
  smoking_status: 'Never' | 'Former' | 'Current';
  alcohol_drinks_week: number;
  added_sugar_grams_day: number;
  sodium_grams_day: number;
  processed_food_servings_week: number;
  
  // Connection & Purpose
  social_connections_count: number;
  nature_minutes_week: number;
  cultural_hours_week: number;
  purpose_meaning_score: number;
}

export interface WellnessOutcomes {
  biological_age_years: number;
  biological_age_acceleration: number;
  mortality_risk_score: number;
  estimated_lifespan_years: number;
  
  // Biomarkers
  crp_mg_l: number;
  il6_pg_ml: number;
  igf1_ng_ml: number;
  gdf15_pg_ml: number;
  cortisol_ug_dl: number;
  
  // Functional measures
  grip_strength_kg: number;
  gait_speed_ms: number;
  balance_score: number;
  frailty_index: number;
  
  // Cognitive measures
  cognitive_composite_score: number;
  processing_speed_score: number;
  
  // Psychosocial wellbeing
  life_satisfaction_score: number;
  stress_level_score: number;
  depression_risk_score: number;
  social_support_score: number;
}

export interface MonthlyRecord {
  subject_id: string;
  month: number;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  observation_date: string;
  
  // Demographics (time-invariant)
  demographics: Demographics;
  
  // TWA Behaviors
  behaviors: TWABehaviors;
  
  // Wellness & Aging Outcomes
  outcomes: WellnessOutcomes;
  
  // Research validation variables
  meets_exercise_guidelines: boolean;
  meets_sleep_guidelines: boolean;
  high_diet_quality: boolean;
  regular_meditation: boolean;
  strong_social_support: boolean;
  high_purpose: boolean;
  healthy_aging_profile: number;
  blue_zone_similarity_score: number;
}

export interface DatasetConfig {
  n_subjects: number;
  months: number;
  include_validation: boolean;
  export_format: 'csv' | 'json' | 'excel';
}

export interface ValidationResults {
  demographic_accuracy: {
    age_distribution_ks_test: number;
    income_education_correlation: number;
    fitness_age_relationship: number;
  };
  behavior_correlations: {
    exercise_sleep_correlation: number;
    diet_meditation_correlation: number;
    social_purpose_correlation: number;
  };
  outcome_validity: {
    biological_age_effects: number;
    mortality_risk_factors: number;
    purpose_longevity_relationship: number;
  };
  longitudinal_coherence: {
    seasonal_variations: number;
    aging_trajectories: number;
    behavior_stability: number;
  };
}
