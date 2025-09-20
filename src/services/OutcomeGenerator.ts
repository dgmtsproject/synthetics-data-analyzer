import { Demographics, TWABehaviors, WellnessOutcomes } from '../types';

export class WellnessAgingOutcomeGenerator {
  private researchEffects: {
    biologicalAgeEffects: Record<string, number>;
    mortalityRiskEffects: Record<string, number>;
    biomarkerEffects: Record<string, number>;
  };

  constructor() {
    this.researchEffects = this.loadResearchEffectSizes();
  }

  private loadResearchEffectSizes() {
    return {
      biologicalAgeEffects: {
        'motion_high': -1.2,
        'diet_mediterranean': -2.3,
        'meditation_regular': -1.8,
        'smoking_current': +5.3,
        'purpose_high': -3.1,
        'social_connected': -1.5,
        'sleep_quality': -0.5,
        'alcohol_excess': +2.1,
        'processed_foods': +1.7
      },
      mortalityRiskEffects: {
        'purpose_high': 0.57,
        'social_isolated': 1.91,
        'smoking_current': 2.24,
        'exercise_regular': 0.72,
        'diet_quality_high': 0.70,
        'meditation_practice': 0.82
      },
      biomarkerEffects: {
        'crp_reduction_exercise': -0.25,
        'il6_reduction_meditation': -0.30,
        'telomere_exercise': +0.15,
        'cortisol_nature': -0.30,
        'igf1_caloric_restriction': -0.18
      }
    };
  }

  generateAgingWellnessOutcomes(
    demographics: Demographics,
    twaBehaviors: TWABehaviors,
    baselineAge: number,
    monthsElapsed: number
  ): WellnessOutcomes {
    // Calculate biological age based on TWA behaviors
    const biologicalAge = this.calculateBiologicalAge(
      baselineAge, twaBehaviors, monthsElapsed
    );

    // Calculate mortality risk score
    const mortalityRisk = this.calculateMortalityRisk(
      demographics, twaBehaviors, biologicalAge
    );

    // Generate biomarkers based on behaviors
    const biomarkers = this.generateBiomarkers(
      demographics, twaBehaviors, biologicalAge
    );

    // Generate functional measures
    const functionalMeasures = this.generateFunctionalMeasures(
      demographics, twaBehaviors, biologicalAge
    );

    // Generate psychosocial wellbeing
    const psychosocialOutcomes = this.generatePsychosocialOutcomes(
      twaBehaviors, biomarkers
    );

    return {
      biological_age_years: biologicalAge,
      biological_age_acceleration: biologicalAge - baselineAge,
      mortality_risk_score: mortalityRisk,
      estimated_lifespan_years: this.calculateEstimatedLifespan(
        demographics, mortalityRisk
      ),
      
      // Biomarkers
      crp_mg_l: biomarkers.crp,
      il6_pg_ml: biomarkers.il6,
      igf1_ng_ml: biomarkers.igf1,
      gdf15_pg_ml: biomarkers.gdf15,
      cortisol_ug_dl: biomarkers.cortisol,
      
      // Functional measures
      grip_strength_kg: functionalMeasures.grip_strength,
      gait_speed_ms: functionalMeasures.gait_speed,
      balance_score: functionalMeasures.balance,
      frailty_index: functionalMeasures.frailty,
      
      // Cognitive measures
      cognitive_composite_score: functionalMeasures.cognitive,
      processing_speed_score: functionalMeasures.processing_speed,
      
      // Psychosocial wellbeing
      life_satisfaction_score: psychosocialOutcomes.life_satisfaction,
      stress_level_score: psychosocialOutcomes.stress,
      depression_risk_score: psychosocialOutcomes.depression_risk,
      social_support_score: psychosocialOutcomes.social_support
    };
  }

  private calculateBiologicalAge(
    chronologicalAge: number, 
    behaviors: TWABehaviors, 
    monthsElapsed: number
  ): number {
    const effects = this.researchEffects.biologicalAgeEffects;
    let ageModification = 0;

    // Apply protective effects (Do More behaviors)
    if (behaviors.motion_days_week >= 4) {
      ageModification += effects.motion_high;
    }
    
    if (behaviors.diet_mediterranean_score >= 7) {
      ageModification += effects.diet_mediterranean;
    }
    
    if (behaviors.meditation_minutes_week >= 150) {
      ageModification += effects.meditation_regular;
    }
    
    if (behaviors.sleep_quality_score >= 7) {
      ageModification += effects.sleep_quality * behaviors.sleep_hours;
    }
    
    if (behaviors.purpose_meaning_score >= 8) {
      ageModification += effects.purpose_high;
    }
    
    if (behaviors.social_connections_count >= 4) {
      ageModification += effects.social_connected;
    }

    // Apply risk effects (Do Less behaviors)
    if (behaviors.smoking_status === 'Current') {
      ageModification -= effects.smoking_current; // Negative = aging acceleration
    }
    
    if (behaviors.alcohol_drinks_week > 14) {
      ageModification -= effects.alcohol_excess;
    }
    
    if (behaviors.processed_food_servings_week > 10) {
      ageModification -= effects.processed_foods;
    }

    // Calculate cumulative effect over time
    const monthlyEffect = ageModification / 12; // Convert annual effect to monthly
    const cumulativeEffect = monthlyEffect * monthsElapsed;

    const biologicalAge = chronologicalAge + (monthsElapsed / 12) + cumulativeEffect;

    return Math.max(18, biologicalAge); // Minimum biological age of 18
  }

  private calculateMortalityRisk(
    demographics: Demographics,
    behaviors: TWABehaviors,
    biologicalAge: number
  ): number {
    const effects = this.researchEffects.mortalityRiskEffects;
    let riskScore = 1.0;

    // Apply protective factors
    if (behaviors.purpose_meaning_score >= 8) {
      riskScore *= effects.purpose_high;
    }
    
    if (behaviors.motion_days_week >= 3) {
      riskScore *= effects.exercise_regular;
    }
    
    if (behaviors.diet_mediterranean_score >= 7) {
      riskScore *= effects.diet_quality_high;
    }
    
    if (behaviors.meditation_minutes_week >= 150) {
      riskScore *= effects.meditation_practice;
    }

    // Apply risk factors
    if (behaviors.smoking_status === 'Current') {
      riskScore *= effects.smoking_current;
    }
    
    if (behaviors.social_connections_count < 2) {
      riskScore *= effects.social_isolated;
    }

    // Age effect (exponential increase with age)
    const ageEffect = Math.pow(1.1, (biologicalAge - 30) / 10);
    riskScore *= ageEffect;

    return Math.max(0.1, Math.min(10.0, riskScore));
  }

  private generateBiomarkers(
    demographics: Demographics,
    behaviors: TWABehaviors,
    biologicalAge: number
  ): Record<string, number> {
    const effects = this.researchEffects.biomarkerEffects;
    
    // Base biomarker values by age and gender
    const baseCRP = this.getBaseCRP(demographics.age_numeric, demographics.gender);
    const baseIL6 = this.getBaseIL6(demographics.age_numeric, demographics.gender);
    const baseIGF1 = this.getBaseIGF1(demographics.age_numeric, demographics.gender);
    const baseGDF15 = this.getBaseGDF15(demographics.age_numeric, demographics.gender);
    const baseCortisol = this.getBaseCortisol(demographics.age_numeric, demographics.gender);

    // Apply behavior effects
    let crp = baseCRP;
    let il6 = baseIL6;
    let igf1 = baseIGF1;
    let gdf15 = baseGDF15;
    let cortisol = baseCortisol;

    // Exercise effects
    if (behaviors.motion_days_week >= 4) {
      crp *= (1 + effects.crp_reduction_exercise);
      igf1 *= (1 + effects.telomere_exercise);
    }

    // Meditation effects
    if (behaviors.meditation_minutes_week >= 150) {
      il6 *= (1 + effects.il6_reduction_meditation);
      cortisol *= (1 + effects.cortisol_nature);
    }

    // Nature connection effects
    if (behaviors.nature_minutes_week >= 120) {
      cortisol *= (1 + effects.cortisol_nature);
    }

    // Diet effects
    if (behaviors.diet_mediterranean_score >= 7) {
      crp *= 0.8;
      il6 *= 0.85;
    }

    // Stress effects (inverse of meditation and nature)
    const stressLevel = Math.max(0, 10 - behaviors.meditation_minutes_week / 30 - behaviors.nature_minutes_week / 60);
    cortisol *= (1 + stressLevel * 0.1);

    // Add some biological variation
    const variation = 0.8 + Math.random() * 0.4;

    return {
      crp: Math.max(0.1, crp * variation),
      il6: Math.max(0.1, il6 * variation),
      igf1: Math.max(50, igf1 * variation),
      gdf15: Math.max(100, gdf15 * variation),
      cortisol: Math.max(5, cortisol * variation)
    };
  }

  private generateFunctionalMeasures(
    demographics: Demographics,
    behaviors: TWABehaviors,
    biologicalAge: number
  ): Record<string, number> {
    // Base functional measures by age and gender
    const baseGripStrength = this.getBaseGripStrength(demographics.age_numeric, demographics.gender);
    const baseGaitSpeed = this.getBaseGaitSpeed(demographics.age_numeric, demographics.gender);
    const baseBalance = this.getBaseBalance(demographics.age_numeric, demographics.gender);
    const baseFrailty = this.getBaseFrailty(demographics.age_numeric);

    // Apply behavior effects
    let gripStrength = baseGripStrength;
    let gaitSpeed = baseGaitSpeed;
    let balance = baseBalance;
    let frailty = baseFrailty;

    // Exercise effects
    if (behaviors.motion_days_week >= 4) {
      gripStrength *= 1.15;
      gaitSpeed *= 1.1;
      balance *= 1.1;
      frailty *= 0.8;
    }

    // Diet effects
    if (behaviors.diet_mediterranean_score >= 7) {
      gripStrength *= 1.05;
      gaitSpeed *= 1.05;
      balance *= 1.05;
      frailty *= 0.9;
    }

    // Sleep effects
    if (behaviors.sleep_quality_score >= 7) {
      gripStrength *= 1.05;
      gaitSpeed *= 1.05;
      balance *= 1.05;
      frailty *= 0.95;
    }

    // Social connection effects
    if (behaviors.social_connections_count >= 4) {
      frailty *= 0.9;
    }

    // Calculate cognitive measures
    const cognitive = this.calculateCognitiveScore(demographics, behaviors, biologicalAge);
    const processingSpeed = this.calculateProcessingSpeed(demographics, behaviors, biologicalAge);

    return {
      grip_strength: Math.max(10, gripStrength),
      gait_speed: Math.max(0.5, gaitSpeed),
      balance: Math.max(1, Math.min(10, balance)),
      frailty: Math.max(0, Math.min(1, frailty)),
      cognitive,
      processing_speed: processingSpeed
    };
  }

  private generatePsychosocialOutcomes(
    behaviors: TWABehaviors,
    biomarkers: Record<string, number>
  ): Record<string, number> {
    // Life satisfaction based on multiple factors
    let lifeSatisfaction = 5;
    
    // Purpose effect
    lifeSatisfaction += (behaviors.purpose_meaning_score - 5) * 0.3;
    
    // Social connection effect
    lifeSatisfaction += (behaviors.social_connections_count - 3) * 0.2;
    
    // Exercise effect
    lifeSatisfaction += (behaviors.motion_days_week - 3) * 0.1;
    
    // Meditation effect
    lifeSatisfaction += (behaviors.meditation_minutes_week / 100) * 0.2;

    // Stress level (inverse of life satisfaction and meditation)
    const stress = Math.max(1, 10 - lifeSatisfaction - (behaviors.meditation_minutes_week / 50));

    // Depression risk based on stress and social factors
    const depressionRisk = Math.max(1, stress * 0.8 - (behaviors.social_connections_count * 0.5));

    // Social support based on connections and purpose
    const socialSupport = Math.min(10, 
      (behaviors.social_connections_count * 1.5) + 
      (behaviors.purpose_meaning_score * 0.3)
    );

    return {
      life_satisfaction: Math.max(1, Math.min(10, lifeSatisfaction)),
      stress: Math.max(1, Math.min(10, stress)),
      depression_risk: Math.max(1, Math.min(10, depressionRisk)),
      social_support: Math.max(1, Math.min(10, socialSupport))
    };
  }

  private calculateEstimatedLifespan(demographics: Demographics, mortalityRisk: number): number {
    // Base lifespan by gender
    const baseLifespan = demographics.gender === 'Female' ? 81 : 76;
    
    // Adjust for mortality risk
    const adjustedLifespan = baseLifespan / mortalityRisk;
    
    // Add some variation
    const variation = 0.9 + Math.random() * 0.2;
    
    return Math.max(50, Math.min(100, adjustedLifespan * variation));
  }

  private calculateCognitiveScore(
    demographics: Demographics,
    behaviors: TWABehaviors,
    biologicalAge: number
  ): number {
    let cognitive = 100;
    
    // Age effect
    cognitive -= (biologicalAge - 30) * 0.5;
    
    // Education effect
    const educationEffect = {
      'Less than HS': 0.8,
      'High School': 0.9,
      'Some College': 1.0,
      'Bachelor+': 1.1
    }[demographics.education] || 1.0;
    
    cognitive *= educationEffect;
    
    // Exercise effect
    if (behaviors.motion_days_week >= 4) {
      cognitive *= 1.1;
    }
    
    // Meditation effect
    cognitive += behaviors.meditation_minutes_week * 0.1;
    
    // Social connection effect
    cognitive += behaviors.social_connections_count * 2;
    
    return Math.max(50, Math.min(150, cognitive));
  }

  private calculateProcessingSpeed(
    demographics: Demographics,
    behaviors: TWABehaviors,
    biologicalAge: number
  ): number {
    let processingSpeed = 100;
    
    // Age effect (declines with age)
    processingSpeed -= (biologicalAge - 25) * 0.3;
    
    // Exercise effect
    if (behaviors.motion_days_week >= 4) {
      processingSpeed *= 1.05;
    }
    
    // Hydration effect
    processingSpeed += (behaviors.hydration_cups_day - 6) * 1;
    
    // Sleep effect
    if (behaviors.sleep_quality_score >= 7) {
      processingSpeed *= 1.05;
    }
    
    return Math.max(50, Math.min(150, processingSpeed));
  }

  // Base biomarker values by age and gender
  private getBaseCRP(age: number, gender: string): number {
    const baseValue = gender === 'Female' ? 2.5 : 2.0;
    return baseValue + (age - 30) * 0.05;
  }

  private getBaseIL6(age: number, gender: string): number {
    const baseValue = gender === 'Female' ? 1.8 : 1.5;
    return baseValue + (age - 30) * 0.03;
  }

  private getBaseIGF1(age: number, gender: string): number {
    const baseValue = gender === 'Male' ? 200 : 180;
    return Math.max(100, baseValue - (age - 30) * 2);
  }

  private getBaseGDF15(age: number, gender: string): number {
    const baseValue = gender === 'Female' ? 800 : 700;
    return baseValue + (age - 30) * 15;
  }

  private getBaseCortisol(age: number, gender: string): number {
    const baseValue = gender === 'Female' ? 12 : 10;
    return baseValue + (age - 30) * 0.1;
  }

  // Base functional measures by age and gender
  private getBaseGripStrength(age: number, gender: string): number {
    const baseValue = gender === 'Male' ? 45 : 28;
    return Math.max(10, baseValue - (age - 30) * 0.3);
  }

  private getBaseGaitSpeed(age: number, gender: string): number {
    const baseValue = 1.4;
    return Math.max(0.5, baseValue - (age - 30) * 0.005);
  }

  private getBaseBalance(age: number, gender: string): number {
    const baseValue = 8;
    return Math.max(1, baseValue - (age - 30) * 0.02);
  }

  private getBaseFrailty(age: number): number {
    return Math.min(1, Math.max(0, (age - 30) * 0.01));
  }
}
