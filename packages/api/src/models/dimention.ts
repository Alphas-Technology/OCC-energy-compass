
export interface Dimention<T> {
  physical: {
    foodAndHydration: {
      dietQuality: T;
      quantityOfFood: T;
      foodKnowledge: T;
      hydration: T;
    };
    physicalActivity: {
      cardiovascularExercise: T;
      strengtheningExercise: T;
      movement: T;
      exerciseDiscipline: T;
    };
    rest: {
      amountOfSleep: T;
      dailyEnergy: T;
      activeBreaks: T;
      sleepQuality: T;
    }
  };
  mental: {
    stress: {
      workStress: T;
      personalStress: T;
      financialHealth: T;
      stressResponse: T;
    };
    mindfulness: {
      focus: T;
      meditation: T;
      stateOfCalm: T;
      presence: T;
    };
    productivity: {
      concentration: T;
      multitask: T;
      laborJourneys: T;
      humor: T;
    };
  };
  emotional: {
    purpose: {
      personalPurpose: T;
      socialImpact: T;
      passions: T;
      coherence: T;
    };
    constructiveRelationships: {
      socialization: T;
      laborRelations: T;
      feedback: T;
      relationship: T;
    };
    positivePsychology: {
      attitude: T;
      conflictManagement: T;
      resilience: T;
      gratitude: T;
    };
  };
  professional: {
    professionalHabits: {
      habits: T;
      weather: T;
      meetings: T;
      compliance: T;
    };
    personalDevelopment: {
      careerGoals: T;
      developing: T;
      weather: T;
      selfKnowledge: T;
    };
    distractorManagement: {
      screenTime: T;
      procrastination: T;
      distractorsStrategy: T;
      balance: T;
    };
  };
}
