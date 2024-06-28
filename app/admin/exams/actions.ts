"use server";
import getPb from "@/pb/getPb";

interface Exam {
  id: string;
  name: string;
  questions: number;
  running: boolean;
  started: string;
  time_allowed: number;
}

interface StartExamData {
  exam: Exam;
  selectedStudents: string[];
}

export async function startExam({ exam, selectedStudents }: StartExamData) {
  const pb = await getPb();

  console.log(exam, selectedStudents);

  // Update exam status and start time
  const examData = {
    locked: false,
    running: true,
    started: new Date(),
  };
  await pb.collection("exams").update(exam.id, examData);
  const examRecord = await pb.collection("exams").getOne(exam.id, {
    expand: "questions",
  });

  // Create exam_attempts entries for selected students
  const examAttempts = selectedStudents.map((studentId) => ({
    user: studentId,
    exam: exam.id,
    submitted: false,
  }));

  // Perform batch insertion of exam_attempts
  const createdAttempts = await Promise.all(
    examAttempts.map((attempt) =>
      pb.collection("exam_attempts").create(attempt, { requestKey: null }),
    ),
  );

  // Perform batch insertion of exam_answers
  await Promise.all(
    createdAttempts.map(async (attempt) => {
      console.log("Attempt:", attempt);
      await Promise.all(
        examRecord.questions.map((question: any) => {
          const data = {
            question: question,
            exam: exam.id,
            user: attempt.user,
            answer: "",
            attempt: attempt.id,
          };
          return pb
            .collection("exam_answers")
            .create(data, { requestKey: null });
        }),
      );
    }),
  );
}

export async function stopExam(exam: Exam) {
  const pb = await getPb();

  const data = {
    locked: true,
    running: false,
  };

  await pb.collection("exams").update(exam.id, data);
}
