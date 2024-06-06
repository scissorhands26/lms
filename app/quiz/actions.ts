"use server";
import getPb from "@/pb/getPb";

export async function submitQuiz(
  attempt: any,
  answers: any,
  submitted: boolean,
) {
  console.log("Attempt:", attempt);
  console.log("Answers:", answers);

  const pb = await getPb();

  await pb.collection("quiz_attempts").update(attempt.id, {
    submitted: submitted,
    expired: true,
  });

  for (const questionId in answers) {
    const answer = answers[questionId];
    const question = await pb.collection("question_bank").getOne(questionId);

    await updateAnswerInDB(attempt, question, answer);

    console.log("Question:", question);
  }
}

export async function updateAnswerInDB(
  attempt: any,
  question: any,
  answer: string,
) {
  const pb = await getPb();

  const doesAnswerExist = await pb.collection("quiz_answers").getFullList({
    filter: `question = "${question.id}" && attempt = "${attempt.id}"`,
  });

  if (doesAnswerExist.length > 0) {
    await pb.collection("quiz_answers").update(doesAnswerExist[0].id, {
      answer,
    });
  } else {
    await pb.collection("quiz_answers").create({
      user: pb.authStore.model.id,
      quiz: attempt.expand.quiz.id,
      question: question.id,
      attempt: attempt.id,
      answer,
    });
  }

  console.log("Attempt:", attempt);
  console.log("Question:", question);
  console.log("Answer:", answer);
}

export async function navigateToQuiz(quiz: any) {}
