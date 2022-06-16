
export interface IScore {
  score: number;
  previous: number;
}

interface IVariable {
  general: IScore;
  questions: {
    question_1: {
      general: IScore;
    };
    question_2: {
      general: IScore;
    };
    question_3: {
      general: IScore;
    };
    question_4: {
      general: IScore;
    };
  }
}

interface IDimension {
  general: IScore;
  variables: {
    var_1: IVariable;
    var_2: IVariable;
    var_3: IVariable;
  }
}

export interface IAnswersDimension {
  physical: IDimension;
  mental: IDimension;
  emotional: IDimension;
  professional: IDimension;
}
