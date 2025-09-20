import { Demographics, TWABehaviors } from '../types';

export class ResearchValidatedTWAGenerator {
  private behaviorResearch: {
    doMoreCorrelations: Record<string, number>;
    doLessCorrelations: Record<string, number>;
    demographicBehaviorEffects: Record<string, number>;
  };

  constructor() {
    this.behaviorResearch = this.loadBehaviorResearch();
  }

  private loadBehaviorResearch() {
    return {
      doMoreCorrelations: {
        'motion_sleep': 0.32,
        'diet_meditation': 0.28,
        'sleep_hydration': 0.25,
        'motion_diet': 0.35,
        'meditation_purpose': 0.42
      },
      doLessCorrelations: {
        'smoking_drinking': 0.48,
        'processed_foods_sugar': 0.55,
        'drinking_poor_sleep': 0.33,
        'smoking_stress': 0.41
      },
      demographicBehaviorEffects: {
        'education_diet_quality': 0.38,
        'income_exercise_access': 0.31,
        'age_meditation_adoption': 0.22,
        'social_connections_purpose': 0.35
      }
    };
  }

  generateMonthlyTWABehaviors(
    personDemographics: Demographics, 
    month: number, 
    season: 'Spring' | 'Summer' | 'Fall' | 'Winter'
  ): TWABehaviors {
    const demoFactors = this.calculateDemographicFactors(personDemographics);
    const seasonalFactors = this.calculateSeasonalFactors(season);

    // Generate Do More behaviors with correlations
    const motionDays = this.generateMotionBehavior(demoFactors, seasonalFactors);
    const sleepQuality = this.generateSleepBehavior(demoFactors, motionDays);
    const hydration = this.generateHydrationBehavior(demoFactors, sleepQuality);
    const dietScore = this.generateDietBehavior(demoFactors, motionDays);
    const meditationMins = this.generateMeditationBehavior(demoFactors, dietScore);

    // Generate Do Less behaviors with clustering
    const smokingStatus = this.generateSmokingBehavior(demoFactors);
    const alcoholDrinks = this.generateAlcoholBehavior(demoFactors, smokingStatus);
    const sugarGrams = this.generateSugarBehavior(demoFactors, dietScore);
    const sodiumGrams = this.generateSodiumBehavior(demoFactors, dietScore);
    const processedServings = this.generateProcessedFoods(demoFactors, dietScore);

    // Generate Connection & Purpose behaviors
    const socialConnections = this.generateSocialConnections(demoFactors);
    const natureMinutes = this.generateNatureConnection(demoFactors, seasonalFactors);
    const culturalEngagement = this.generateCulturalActivities(demoFactors);
    const purposeScore = this.generatePurposeMeaning(demoFactors, socialConnections, meditationMins);

    return {
      // Do More
      motion_days_week: motionDays,
      sleep_hours: sleepQuality.hours,
      sleep_quality_score: sleepQuality.quality,
      hydration_cups_day: hydration,
      diet_mediterranean_score: dietScore,
      meditation_minutes_week: meditationMins,
      
      // Do Less  
      smoking_status: smokingStatus,
      alcohol_drinks_week: alcoholDrinks,
      added_sugar_grams_day: sugarGrams,
      sodium_grams_day: sodiumGrams,
      processed_food_servings_week: processedServings,
      
      // Connections & Purpose
      social_connections_count: socialConnections,
      nature_minutes_week: natureMinutes,
      cultural_hours_week: culturalEngagement,
      purpose_meaning_score: purposeScore
    };
  }

  private calculateDemographicFactors(demographics: Demographics) {
    return {
      age: demographics.age_numeric,
      income: demographics.income_numeric,
      education: demographics.education,
      fitness: demographics.fitness_level,
      sleepType: demographics.sleep_type,
      region: demographics.region,
      urbanRural: demographics.urban_rural
    } as const;
  }

  private calculateSeasonalFactors(season: 'Spring' | 'Summer' | 'Fall' | 'Winter') {
    const seasonalEffects = {
      'Spring': { exercise: 1.1, mood: 1.05, outdoor: 1.2 },
      'Summer': { exercise: 1.2, mood: 1.1, outdoor: 1.5 },
      'Fall': { exercise: 0.9, mood: 0.95, outdoor: 1.0 },
      'Winter': { exercise: 0.8, mood: 0.9, outdoor: 0.6 }
    };
    return seasonalEffects[season];
  }

  private generateMotionBehavior(demoFactors: any, seasonalFactors: any): number {
    let baseDays = 0;
    
    // Base on fitness level
    const fitnessMultiplierMap: Record<string, number> = {
      'Low': 0.3,
      'Medium': 0.6,
      'High': 1.0
    };
    const fitnessMultiplier = fitnessMultiplierMap[demoFactors.fitness] || 0.5;
    
    // Age effect (declines with age)
    const ageEffect = Math.max(0.3, 1 - (demoFactors.age - 25) / 100);
    
    // Income effect (higher income = more exercise access)
    const incomeEffect = Math.min(1.5, 0.5 + (demoFactors.income / 100000));
    
    // Education effect
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.7,
      'High School': 0.8,
      'Some College': 0.9,
      'Bachelor+': 1.1
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 0.8;
    
    baseDays = 2 + (fitnessMultiplier * ageEffect * incomeEffect * educationEffect * 3);
    
    // Apply seasonal effect
    baseDays *= seasonalFactors.exercise;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    baseDays *= randomFactor;
    
    return Math.round(Math.max(0, Math.min(7, baseDays)));
  }

  private generateSleepBehavior(demoFactors: any, motionDays: number): { hours: number; quality: number } {
    let baseHours = 7.5;
    let baseQuality = 7;
    
    // Age effect (older adults sleep less but more regularly)
    if (demoFactors.age > 65) {
      baseHours = 7.0;
      baseQuality = 6.5;
    } else if (demoFactors.age < 30) {
      baseHours = 8.0;
      baseQuality = 7.5;
    }
    
    // Sleep type effect
    const sleepTypeEffectMap: Record<string, { hours: number; quality: number }> = {
      'Regular': { hours: 1.0, quality: 1.0 },
      'Short': { hours: 0.7, quality: 0.6 },
      'Irregular': { hours: 0.8, quality: 0.7 }
    };
    const sleepTypeEffect = sleepTypeEffectMap[demoFactors.sleepType] || { hours: 1.0, quality: 1.0 };
    
    // Exercise correlation (exercise improves sleep)
    const exerciseEffect = 1 + (motionDays - 3) * 0.1;
    
    // Income effect (higher income = better sleep environment)
    const incomeEffect = 0.9 + (demoFactors.income / 200000);
    
    const hours = baseHours * sleepTypeEffect.hours * exerciseEffect * incomeEffect;
    const quality = baseQuality * sleepTypeEffect.quality * exerciseEffect * incomeEffect;
    
    // Add randomness
    const hoursRandom = 0.9 + Math.random() * 0.2;
    const qualityRandom = 0.8 + Math.random() * 0.4;
    
    return {
      hours: Math.max(4, Math.min(10, hours * hoursRandom)),
      quality: Math.max(1, Math.min(10, quality * qualityRandom))
    };
  }

  private generateHydrationBehavior(demoFactors: any, sleepQuality: { hours: number; quality: number }): number {
    let baseCups = 6;
    
    // Sleep correlation (better sleep = better hydration habits)
    const sleepEffect = 0.8 + (sleepQuality.quality / 10) * 0.4;
    
    // Age effect (older adults tend to drink less)
    const ageEffect = Math.max(0.7, 1 - (demoFactors.age - 30) / 200);
    
    // Education effect (higher education = better health habits)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.8,
      'High School': 0.9,
      'Some College': 1.0,
      'Bachelor+': 1.1
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    baseCups *= sleepEffect * ageEffect * educationEffect;
    
    // Add randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    baseCups *= randomFactor;
    
    return Math.max(2, Math.min(12, Math.round(baseCups)));
  }

  private generateDietBehavior(demoFactors: any, motionDays: number): number {
    let baseScore = 5;
    
    // Exercise correlation (exercise correlates with healthy eating)
    const exerciseEffect = 0.8 + (motionDays / 7) * 0.4;
    
    // Education effect (higher education = better diet knowledge)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.6,
      'High School': 0.8,
      'Some College': 1.0,
      'Bachelor+': 1.2
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    // Income effect (higher income = better food access)
    const incomeEffect = 0.7 + (demoFactors.income / 150000);
    
    // Age effect (older adults tend to eat healthier)
    const ageEffect = Math.min(1.3, 0.8 + (demoFactors.age / 200));
    
    baseScore *= exerciseEffect * educationEffect * incomeEffect * ageEffect;
    
    // Add randomness
    const randomFactor = 0.7 + Math.random() * 0.6;
    baseScore *= randomFactor;
    
    return Math.max(1, Math.min(10, Math.round(baseScore * 10) / 10));
  }

  private generateMeditationBehavior(demoFactors: any, dietScore: number): number {
    let baseMinutes = 30;
    
    // Diet correlation (healthy eating correlates with mindfulness)
    const dietEffect = 0.5 + (dietScore / 10) * 0.5;
    
    // Age effect (older adults more likely to meditate)
    const ageEffect = Math.min(2.0, 0.5 + (demoFactors.age / 100));
    
    // Education effect (higher education = more likely to practice mindfulness)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.3,
      'High School': 0.6,
      'Some College': 1.0,
      'Bachelor+': 1.5
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    // Income effect (higher income = more time for self-care)
    const incomeEffect = 0.6 + (demoFactors.income / 200000);
    
    baseMinutes *= dietEffect * ageEffect * educationEffect * incomeEffect;
    
    // Add randomness
    const randomFactor = 0.2 + Math.random() * 1.6;
    baseMinutes *= randomFactor;
    
    return Math.max(0, Math.min(300, Math.round(baseMinutes)));
  }

  private generateSmokingBehavior(demoFactors: any): 'Never' | 'Former' | 'Current' {
    const smokingStatuses = ['Never', 'Former', 'Current'];
    
    // Base probabilities
    let probabilities = [0.65, 0.25, 0.10];
    
    // Education effect (higher education = less smoking) - commented out for now
    // const educationEffectMap: Record<string, number[]> = {
    //   'Less than HS': [0.45, 0.30, 0.25],
    //   'High School': [0.60, 0.25, 0.15],
    //   'Some College': [0.70, 0.20, 0.10],
    //   'Bachelor+': [0.80, 0.15, 0.05]
    // };
    // const educationEffect = educationEffectMap[demoFactors.education] || [0.65, 0.25, 0.10];
    
    // Income effect (higher income = less smoking)
    if (demoFactors.income > 75000) {
      probabilities = [0.80, 0.15, 0.05];
    } else if (demoFactors.income < 35000) {
      probabilities = [0.50, 0.30, 0.20];
    }
    
    // Age effect (older adults more likely to be former smokers)
    if (demoFactors.age > 50) {
      probabilities = [0.60, 0.30, 0.10];
    }
    
    return this.weightedRandomChoice(smokingStatuses, probabilities) as 'Never' | 'Former' | 'Current';
  }

  private generateAlcoholBehavior(demoFactors: any, smokingStatus: string): number {
    let baseDrinks = 2;
    
    // Smoking correlation (smokers more likely to drink)
    const smokingEffectMap: Record<string, number> = {
      'Never': 1.0,
      'Former': 1.2,
      'Current': 1.5
    };
    const smokingEffect = smokingEffectMap[smokingStatus] || 1.0;
    
    // Age effect (peak drinking in 20s-30s)
    let ageEffect = 1.0;
    if (demoFactors.age < 30) ageEffect = 1.5;
    else if (demoFactors.age > 50) ageEffect = 0.7;
    
    // Income effect (higher income = more drinking)
    const incomeEffect = 0.5 + (demoFactors.income / 100000);
    
    // Education effect (higher education = more drinking)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.7,
      'High School': 0.9,
      'Some College': 1.1,
      'Bachelor+': 1.3
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    baseDrinks *= smokingEffect * ageEffect * incomeEffect * educationEffect;
    
    // Add randomness
    const randomFactor = 0.3 + Math.random() * 1.4;
    baseDrinks *= randomFactor;
    
    return Math.max(0, Math.min(35, Math.round(baseDrinks)));
  }

  private generateSugarBehavior(demoFactors: any, dietScore: number): number {
    let baseGrams = 50;
    
    // Diet correlation (worse diet = more sugar)
    const dietEffect = 2 - (dietScore / 10);
    
    // Education effect (higher education = less sugar)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 1.3,
      'High School': 1.1,
      'Some College': 1.0,
      'Bachelor+': 0.8
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    // Age effect (younger adults eat more sugar)
    const ageEffect = Math.max(0.6, 1.5 - (demoFactors.age / 100));
    
    baseGrams *= dietEffect * educationEffect * ageEffect;
    
    // Add randomness
    const randomFactor = 0.6 + Math.random() * 0.8;
    baseGrams *= randomFactor;
    
    return Math.max(10, Math.min(150, Math.round(baseGrams)));
  }

  private generateSodiumBehavior(demoFactors: any, dietScore: number): number {
    let baseGrams = 3.5;
    
    // Diet correlation (worse diet = more sodium)
    const dietEffect = 2 - (dietScore / 10);
    
    // Age effect (older adults tend to eat more sodium)
    const ageEffect = Math.min(1.5, 0.8 + (demoFactors.age / 200));
    
    // Income effect (lower income = more processed foods)
    const incomeEffect = 1.5 - (demoFactors.income / 200000);
    
    baseGrams *= dietEffect * ageEffect * incomeEffect;
    
    // Add randomness
    const randomFactor = 0.7 + Math.random() * 0.6;
    baseGrams *= randomFactor;
    
    return Math.max(1, Math.min(8, Math.round(baseGrams * 10) / 10));
  }

  private generateProcessedFoods(demoFactors: any, dietScore: number): number {
    let baseServings = 5;
    
    // Diet correlation (worse diet = more processed foods)
    const dietEffect = 2 - (dietScore / 10);
    
    // Income effect (lower income = more processed foods)
    const incomeEffect = 1.5 - (demoFactors.income / 150000);
    
    // Education effect (higher education = fewer processed foods)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 1.4,
      'High School': 1.2,
      'Some College': 1.0,
      'Bachelor+': 0.7
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    baseServings *= dietEffect * incomeEffect * educationEffect;
    
    // Add randomness
    const randomFactor = 0.6 + Math.random() * 0.8;
    baseServings *= randomFactor;
    
    return Math.max(0, Math.min(20, Math.round(baseServings)));
  }

  private generateSocialConnections(demoFactors: any): number {
    let baseConnections = 3;
    
    // Urban/rural effect (urban = more connections)
    const urbanEffectMap: Record<string, number> = {
      'Urban': 1.3,
      'Suburban': 1.1,
      'Rural': 0.8
    };
    const urbanEffect = urbanEffectMap[demoFactors.urbanRural] || 1.0;
    
    // Income effect (higher income = more social opportunities)
    const incomeEffect = 0.7 + (demoFactors.income / 200000);
    
    // Age effect (social connections peak in middle age)
    const ageEffect = Math.max(0.6, 1.2 - Math.abs(demoFactors.age - 40) / 50);
    
    // Education effect (higher education = more social connections)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.8,
      'High School': 0.9,
      'Some College': 1.0,
      'Bachelor+': 1.2
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    baseConnections *= urbanEffect * incomeEffect * ageEffect * educationEffect;
    
    // Add randomness
    const randomFactor = 0.6 + Math.random() * 0.8;
    baseConnections *= randomFactor;
    
    return Math.max(0, Math.min(10, Math.round(baseConnections)));
  }

  private generateNatureConnection(demoFactors: any, seasonalFactors: any): number {
    let baseMinutes = 60;
    
    // Seasonal effect
    baseMinutes *= seasonalFactors.outdoor;
    
    // Urban/rural effect (rural = more nature access)
    const urbanEffectMap: Record<string, number> = {
      'Urban': 0.5,
      'Suburban': 0.8,
      'Rural': 1.5
    };
    const urbanEffect = urbanEffectMap[demoFactors.urbanRural] || 1.0;
    
    // Income effect (higher income = more leisure time)
    const incomeEffect = 0.6 + (demoFactors.income / 200000);
    
    // Age effect (older adults more likely to spend time in nature)
    const ageEffect = Math.min(1.5, 0.7 + (demoFactors.age / 150));
    
    baseMinutes *= urbanEffect * incomeEffect * ageEffect;
    
    // Add randomness
    const randomFactor = 0.4 + Math.random() * 1.2;
    baseMinutes *= randomFactor;
    
    return Math.max(0, Math.min(300, Math.round(baseMinutes)));
  }

  private generateCulturalActivities(demoFactors: any): number {
    let baseHours = 2;
    
    // Education effect (higher education = more cultural engagement)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.5,
      'High School': 0.8,
      'Some College': 1.0,
      'Bachelor+': 1.5
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    // Income effect (higher income = more cultural access)
    const incomeEffect = 0.5 + (demoFactors.income / 150000);
    
    // Age effect (cultural engagement varies by age)
    const ageEffect = Math.max(0.6, 1.2 - Math.abs(demoFactors.age - 45) / 60);
    
    baseHours *= educationEffect * incomeEffect * ageEffect;
    
    // Add randomness
    const randomFactor = 0.3 + Math.random() * 1.4;
    baseHours *= randomFactor;
    
    return Math.max(0, Math.min(20, Math.round(baseHours)));
  }

  private generatePurposeMeaning(
    demoFactors: any, 
    socialConnections: number, 
    meditationMins: number
  ): number {
    let baseScore = 5;
    
    // Social connection correlation
    const socialEffect = 0.5 + (socialConnections / 10) * 0.5;
    
    // Meditation correlation
    const meditationEffect = 0.6 + (meditationMins / 300) * 0.4;
    
    // Age effect (purpose increases with age)
    const ageEffect = Math.min(1.5, 0.7 + (demoFactors.age / 100));
    
    // Education effect (higher education = more purpose)
    const educationEffectMap: Record<string, number> = {
      'Less than HS': 0.8,
      'High School': 0.9,
      'Some College': 1.0,
      'Bachelor+': 1.1
    };
    const educationEffect = educationEffectMap[demoFactors.education] || 1.0;
    
    baseScore *= socialEffect * meditationEffect * ageEffect * educationEffect;
    
    // Add randomness
    const randomFactor = 0.6 + Math.random() * 0.8;
    baseScore *= randomFactor;
    
    return Math.max(1, Math.min(10, Math.round(baseScore * 10) / 10));
  }

  private weightedRandomChoice<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  }
}
