import Option from "../models/Option.js";
import Question from "../models/Question.js";

export const gradeQuiz = async (quizId, answers, userId) => {
  // answers = { questionId: selectedOptionId }
  const questions = await Question.findByQuiz(quizId);
  let correctCount = 0;
  const details = [];

  for (const q of questions) {
    const correctOpt = await Option.getCorrectOption(q.question_id);
    const selected = answers[q.question_id];
    const isCorrect =
      correctOpt && selected && correctOpt.option_id == selected;
    if (isCorrect) correctCount++;
    details.push({
      questionId: q.question_id,
      selectedOptionId: selected || null,
      isCorrect,
    });
  }
  const score = (correctCount / questions.length) * 100;
  return { score, details };
};
