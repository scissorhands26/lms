"use server";
import getPb from "@/pb/getPb";

interface Quiz {
  id: string;
  name: string;
  questions: number;
  running: boolean;
  started: string;
  time_allowed: number;
}

interface StartQuizData {
  quiz: Quiz;
  selectedStudents: string[];
}

export async function startQuiz({ quiz, selectedStudents }: StartQuizData) {
  const pb = await getPb();

  console.log(quiz, selectedStudents);

  // Update quiz status and start time
  const quizData = {
    locked: false,
    running: true,
    started: new Date(),
  };
  await pb.collection("quizzes").update(quiz.id, quizData);
  const quizRecord = await pb.collection("quizzes").getOne(quiz.id, {
    expand: "questions",
  });

  // Create quiz_attempts entries for selected students
  const quizAttempts = selectedStudents.map((studentId) => ({
    user: studentId,
    quiz: quiz.id,
    submitted: false,
  }));

  // Perform batch insertion of quiz_attempts
  const createdAttempts = await Promise.all(
    quizAttempts.map((attempt) =>
      pb.collection("quiz_attempts").create(attempt, { requestKey: null }),
    ),
  );

  // Perform batch insertion of quiz_answers
  await Promise.all(
    createdAttempts.map(async (attempt) => {
      await Promise.all(
        quizRecord.questions.map((question) => {
          const data = {
            question: question,
            quiz: quiz.id,
            user: attempt.user,
            answer: "",
            attempt: attempt.id,
          };
          return pb
            .collection("quiz_answers")
            .create(data, { requestKey: null });
        }),
      );
    }),
  );
}

export async function stopQuiz(quiz: Quiz) {
  const pb = await getPb();

  const data = {
    locked: true,
    running: false,
  };

  await pb.collection("quizzes").update(quiz.id, data);
}
