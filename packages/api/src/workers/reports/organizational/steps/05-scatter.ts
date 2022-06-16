
import { IDimensionScatter } from '../contracts/scatter-dimension';

export default async (
  answersForScatter: IDimensionScatter
) => {

  const getInitAttribute = () => ({
    // scatter: 0,
    questions: {
      question_1: {
        scatter: 0
      },
      question_2: {
        scatter: 0
      },
      question_3: {
        scatter: 0
      },
      question_4: {
        scatter: 0
      }
    }
  });

  const getInitDimension = () => ({
    // scatter: 0,
    variables: {
      var_1: getInitAttribute(),
      var_2: getInitAttribute(),
      var_3: getInitAttribute()
    }
  });

  const initScatterDimension = () => ({
    physical: getInitDimension(),
    mental: getInitDimension(),
    emotional: getInitDimension(),
    professional: getInitDimension()
  });

  // Init final Scatter structure
  const scatterDimension = initScatterDimension();

  const getScatter = (scores: Array<number>, media: number) => {
    let distanceSum = 0;
    for (const score of scores) {
      distanceSum += Math.pow(score - media, 2);
    }
    // Beware: by population must divide (scores.length - 1)
    return Math.sqrt(distanceSum / scores.length);
  };

  // Dimensions
  for (const dimKey of Object.keys(answersForScatter)) {

    // Variables
    const dimVariables = answersForScatter[dimKey].variables;
    for (const varKey of Object.keys(dimVariables)) {

      // Questions
      const varQuestions = answersForScatter[dimKey].variables[varKey].questions;
      for (const qKey of Object.keys(varQuestions)) {
        const data = answersForScatter[dimKey].variables[varKey].questions[qKey].scatter;
        const media = data.average;
        const scores = data.scores;

        const scatter = getScatter(scores, media);
        scatterDimension[dimKey].variables[varKey].questions[qKey].scatter = scatter;
      }
    }
  }

  return scatterDimension;
};
