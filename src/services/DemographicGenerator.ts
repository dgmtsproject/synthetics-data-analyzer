import { Demographics } from '../types';

export class EnhancedDemographicGenerator {
  private correlationMatrix: Record<string, number>;

  constructor() {
    this.correlationMatrix = this.buildCorrelationMatrix();
  }

  private buildCorrelationMatrix(): Record<string, number> {
    return {
      'education_income': 0.42,
      'income_health_behaviors': 0.35,
      'age_fitness': -0.28,
      'social_purpose': 0.31,
      'education_health_knowledge': 0.38,
      'urban_social_connections': 0.15
    };
  }

  generateCorrelatedDemographics(nSamples: number = 10000): Demographics[] {
    const demographics: Demographics[] = [];

    for (let i = 0; i < nSamples; i++) {
      const ageGroup = this.sampleAgeGroup();
      const education = this.sampleEducationByAge(ageGroup);
      const income = this.sampleIncomeByEducationAge(education, ageGroup);
      const fitness = this.sampleFitnessByDemographics(ageGroup, income, education);
      const sleepType = this.sampleSleepTypeByDemographics(ageGroup, income);
      const region = this.sampleRegion();
      const urbanRural = this.sampleUrbanRuralByRegion(region);

      demographics.push({
        id: `SYNTH_${i.toString().padStart(6, '0')}`,
        age_group: ageGroup,
        age_numeric: this.ageGroupToNumeric(ageGroup),
        gender: this.sampleGender(),
        ethnicity: this.sampleEthnicity(),
        education,
        income_bracket: income,
        income_numeric: this.incomeBracketToNumeric(income),
        fitness_level: fitness,
        sleep_type: sleepType,
        region,
        urban_rural: urbanRural,
        occupation: this.sampleOccupationByDemographics(education, ageGroup)
      });
    }

    return demographics;
  }

  private sampleAgeGroup(): string {
    const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'];
    const probabilities = [0.11, 0.14, 0.13, 0.12, 0.13, 0.11, 0.07];
    return this.weightedRandomChoice(ageGroups, probabilities);
  }

  private sampleGender(): 'Male' | 'Female' | 'Non-binary' {
    const genders = ['Male', 'Female', 'Non-binary'];
    const probabilities = [0.49, 0.505, 0.005];
    return this.weightedRandomChoice(genders, probabilities) as 'Male' | 'Female' | 'Non-binary';
  }

  private sampleEthnicity(): 'White' | 'Hispanic' | 'Black' | 'Asian' | 'Other' {
    const ethnicities = ['White', 'Hispanic', 'Black', 'Asian', 'Other'];
    const probabilities = [0.60, 0.19, 0.13, 0.06, 0.02];
    return this.weightedRandomChoice(ethnicities, probabilities) as 'White' | 'Hispanic' | 'Black' | 'Asian' | 'Other';
  }

  private sampleEducationByAge(ageGroup: string): 'Less than HS' | 'High School' | 'Some College' | 'Bachelor+' {
    const educationLevels = ['Less than HS', 'High School', 'Some College', 'Bachelor+'];
    
    // Age-based education probabilities
    const ageEducationProbs: Record<string, number[]> = {
      '18-24': [0.05, 0.25, 0.45, 0.25],
      '25-34': [0.08, 0.22, 0.30, 0.40],
      '35-44': [0.10, 0.25, 0.28, 0.37],
      '45-54': [0.12, 0.28, 0.30, 0.30],
      '55-64': [0.15, 0.32, 0.28, 0.25],
      '65-74': [0.18, 0.35, 0.25, 0.22],
      '75+': [0.20, 0.40, 0.25, 0.15]
    };

    const probabilities = ageEducationProbs[ageGroup] || [0.11, 0.27, 0.29, 0.33];
    return this.weightedRandomChoice(educationLevels, probabilities) as 'Less than HS' | 'High School' | 'Some College' | 'Bachelor+';
  }

  private sampleIncomeByEducationAge(education: string, ageGroup: string): '<$35k' | '$35-75k' | '$75-100k' | '>$100k' {
    const incomeBrackets = ['<$35k', '$35-75k', '$75-100k', '>$100k'];
    
    // Education and age-based income probabilities
    const baseProbs: Record<string, number[]> = {
      'Less than HS': [0.50, 0.35, 0.10, 0.05],
      'High School': [0.35, 0.40, 0.20, 0.05],
      'Some College': [0.25, 0.45, 0.25, 0.05],
      'Bachelor+': [0.10, 0.30, 0.35, 0.25]
    };

    let probabilities = baseProbs[education] || [0.28, 0.35, 0.16, 0.21];
    
    // Adjust for age (older = higher income potential)
    const ageMultiplier = this.ageGroupToNumeric(ageGroup) / 50;
    if (ageMultiplier > 1) {
      probabilities = this.shiftProbabilitiesTowardHigher(probabilities, ageMultiplier);
    }

    return this.weightedRandomChoice(incomeBrackets, probabilities) as '<$35k' | '$35-75k' | '$75-100k' | '>$100k';
  }

  private sampleFitnessByDemographics(ageGroup: string, income: string, education: string): 'Low' | 'Medium' | 'High' {
    const fitnessLevels = ['Low', 'Medium', 'High'];
    
    // Base probabilities
    let probabilities = [0.30, 0.50, 0.20];
    
    // Adjust for age (older = lower fitness)
    const ageNumeric = this.ageGroupToNumeric(ageGroup);
    if (ageNumeric > 50) {
      probabilities = [0.50, 0.40, 0.10];
    } else if (ageNumeric < 30) {
      probabilities = [0.15, 0.45, 0.40];
    }
    
    // Adjust for income (higher income = better fitness access)
    const incomeNumeric = this.incomeBracketToNumeric(income);
    if (incomeNumeric > 75000) {
      probabilities = this.shiftProbabilitiesTowardHigher(probabilities, 1.2);
    } else if (incomeNumeric < 35000) {
      probabilities = this.shiftProbabilitiesTowardLower(probabilities, 1.2);
    }
    
    // Adjust for education (higher education = better health knowledge)
    if (education === 'Bachelor+') {
      probabilities = this.shiftProbabilitiesTowardHigher(probabilities, 1.1);
    }

    return this.weightedRandomChoice(fitnessLevels, probabilities) as 'Low' | 'Medium' | 'High';
  }

  private sampleSleepTypeByDemographics(ageGroup: string, income: string): 'Regular' | 'Short' | 'Irregular' {
    const sleepTypes = ['Regular', 'Short', 'Irregular'];
    
    // Base probabilities
    let probabilities = [0.60, 0.25, 0.15];
    
    // Adjust for age (older = more regular sleep)
    const ageNumeric = this.ageGroupToNumeric(ageGroup);
    if (ageNumeric > 50) {
      probabilities = [0.70, 0.20, 0.10];
    } else if (ageNumeric < 30) {
      probabilities = [0.45, 0.30, 0.25];
    }
    
    // Adjust for income (higher income = more regular sleep)
    const incomeNumeric = this.incomeBracketToNumeric(income);
    if (incomeNumeric > 75000) {
      probabilities = [0.70, 0.20, 0.10];
    } else if (incomeNumeric < 35000) {
      probabilities = [0.50, 0.30, 0.20];
    }

    return this.weightedRandomChoice(sleepTypes, probabilities) as 'Regular' | 'Short' | 'Irregular';
  }

  private sampleRegion(): 'Northeast' | 'Midwest' | 'South' | 'West' {
    const regions = ['Northeast', 'Midwest', 'South', 'West'];
    const probabilities = [0.17, 0.21, 0.38, 0.24];
    return this.weightedRandomChoice(regions, probabilities) as 'Northeast' | 'Midwest' | 'South' | 'West';
  }

  private sampleUrbanRuralByRegion(region: string): 'Urban' | 'Suburban' | 'Rural' {
    const urbanRuralTypes = ['Urban', 'Suburban', 'Rural'];
    
    const regionProbs: Record<string, number[]> = {
      'Northeast': [0.25, 0.60, 0.15],
      'Midwest': [0.15, 0.50, 0.35],
      'South': [0.20, 0.45, 0.35],
      'West': [0.30, 0.55, 0.15]
    };

    const probabilities = regionProbs[region] || [0.20, 0.50, 0.30];
    return this.weightedRandomChoice(urbanRuralTypes, probabilities) as 'Urban' | 'Suburban' | 'Rural';
  }

  private sampleOccupationByDemographics(education: string, ageGroup: string): string {
    const occupations = {
      'Less than HS': ['Service Worker', 'Laborer', 'Retail Worker', 'Unemployed'],
      'High School': ['Office Worker', 'Technician', 'Sales', 'Service Worker'],
      'Some College': ['Administrative', 'Technician', 'Sales Manager', 'Healthcare Support'],
      'Bachelor+': ['Professional', 'Manager', 'Engineer', 'Healthcare Professional']
    };

    const ageOccupations: Record<string, string[]> = {
      '18-24': ['Student', 'Service Worker', 'Retail Worker'],
      '25-34': ['Professional', 'Office Worker', 'Technician'],
      '35-44': ['Manager', 'Professional', 'Healthcare Professional'],
      '45-54': ['Manager', 'Professional', 'Administrative'],
      '55-64': ['Manager', 'Administrative', 'Consultant'],
      '65-74': ['Retired', 'Consultant', 'Part-time'],
      '75+': ['Retired', 'Volunteer']
    };

    const educationOccupations = occupations[education as keyof typeof occupations] || occupations['High School'];
    const ageOccupationsList = ageOccupations[ageGroup] || ['Office Worker'];
    
    // Combine and weight by age
    const allOccupations = Array.from(new Set([...educationOccupations, ...ageOccupationsList]));
    const weights = allOccupations.map(occ => 
      educationOccupations.includes(occ) ? 1 : 0.5
    );

    return this.weightedRandomChoice(allOccupations, weights);
  }

  private ageGroupToNumeric(ageGroup: string): number {
    const ageMap: Record<string, number> = {
      '18-24': 21,
      '25-34': 29.5,
      '35-44': 39.5,
      '45-54': 49.5,
      '55-64': 59.5,
      '65-74': 69.5,
      '75+': 80
    };
    return ageMap[ageGroup] || 40;
  }

  private incomeBracketToNumeric(incomeBracket: string): number {
    const incomeMap: Record<string, number> = {
      '<$35k': 25000,
      '$35-75k': 55000,
      '$75-100k': 87500,
      '>$100k': 125000
    };
    return incomeMap[incomeBracket] || 50000;
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

  private shiftProbabilitiesTowardHigher(probabilities: number[], factor: number): number[] {
    const shifted = [...probabilities];
    const reduction = (factor - 1) * 0.1;
    
    // Reduce lower probabilities and increase higher ones
    for (let i = 0; i < shifted.length; i++) {
      if (i < shifted.length / 2) {
        shifted[i] = Math.max(0, shifted[i] - reduction);
      } else {
        shifted[i] = Math.min(1, shifted[i] + reduction);
      }
    }
    
    // Normalize
    const total = shifted.reduce((sum, prob) => sum + prob, 0);
    return shifted.map(prob => prob / total);
  }

  private shiftProbabilitiesTowardLower(probabilities: number[], factor: number): number[] {
    const shifted = [...probabilities];
    const reduction = (factor - 1) * 0.1;
    
    // Increase lower probabilities and reduce higher ones
    for (let i = 0; i < shifted.length; i++) {
      if (i < shifted.length / 2) {
        shifted[i] = Math.min(1, shifted[i] + reduction);
      } else {
        shifted[i] = Math.max(0, shifted[i] - reduction);
      }
    }
    
    // Normalize
    const total = shifted.reduce((sum, prob) => sum + prob, 0);
    return shifted.map(prob => prob / total);
  }
}
