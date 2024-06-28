//@ts-nocheck
import getPb from "@/pb/getPb";

import GradesWrapper from "@/components/admin/GradesWrapper";

async function getQuizGrades() {
  const pb = await getPb();

  const records = await pb
    .collection("quiz_summary")
    .getFullList({ expand: "user_id,quiz_attempt_id" });

  const sortedGrades = records.reduce((acc, entry) => {
    const {
      id,
      user_id,
      user_first_name,
      user_last_name,
      user_rank,
      quiz_id,
      quiz_name,
      quiz_attempt_id,
      question,
      options,
      correct_options,
      answer,
      correct,
      expand,
    } = entry;

    const user_expanded = expand.user_id;

    if (!acc[quiz_id]) {
      acc[quiz_id] = {
        quiz_id,
        quiz_name,
        users: {},
      };
    }

    if (!acc[quiz_id].users[user_id]) {
      acc[quiz_id].users[user_id] = {
        user_id,
        user_first_name,
        user_last_name,
        user_rank,
        user_expanded,
        attempts: {},
      };
    }

    if (!acc[quiz_id].users[user_id].attempts[quiz_attempt_id]) {
      acc[quiz_id].users[user_id].attempts[quiz_attempt_id] = {
        quiz_attempt_id,
        quiz_attempt_date: expand.quiz_attempt_id.created,
        attempt_expand: expand.quiz_attempt_id,
        questions: [],
      };
    }

    acc[quiz_id].users[user_id].attempts[quiz_attempt_id].questions.push({
      id,
      question,
      options,
      correct_options,
      answer,
      correct,
    });

    return acc;
  }, {});

  const result = Object.values(sortedGrades).flatMap((quiz) =>
    Object.values(quiz.users).map((user) => ({
      quiz_id: quiz.quiz_id,
      quiz_name: quiz.quiz_name,
      user_id: user.user_id,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_rank: user.user_rank,
      user_expanded: user.user_expanded,
      attempts: Object.values(user.attempts),
    })),
  );

  console.log(result);
  return result;
}

async function getExamGrades() {
  const pb = await getPb();

  const records = await pb
    .collection("exam_summary")
    .getFullList({ expand: "user_id,exam_attempt_id" });

  console.log("Records", records);

  const sortedGrades = records.reduce((acc, entry) => {
    const {
      id,
      user_id,
      user_first_name,
      user_last_name,
      user_rank,
      exam_id,
      exam_name,
      exam_attempt_id,
      question,
      options,
      correct_options,
      answer,
      correct,
      expand,
    } = entry;

    const user_expanded = expand.user_id;

    if (!acc[exam_id]) {
      acc[exam_id] = {
        exam_id,
        exam_name,
        users: {},
      };
    }

    if (!acc[exam_id].users[user_id]) {
      acc[exam_id].users[user_id] = {
        user_id,
        user_first_name,
        user_last_name,
        user_rank,
        user_expanded,
        attempts: {},
      };
    }

    if (!acc[exam_id].users[user_id].attempts[exam_attempt_id]) {
      acc[exam_id].users[user_id].attempts[exam_attempt_id] = {
        exam_attempt_id,
        exam_attempt_date: expand.exam_attempt_id.created,
        attempt_expand: expand.exam_attempt_id,
        questions: [],
      };
    }

    acc[exam_id].users[user_id].attempts[exam_attempt_id].questions.push({
      id,
      question,
      options,
      correct_options,
      answer,
      correct,
    });

    return acc;
  }, {});

  const result = Object.values(sortedGrades).flatMap((exam) =>
    Object.values(exam.users).map((user) => ({
      exam_id: exam.exam_id,
      exam_name: exam.exam_name,
      user_id: user.user_id,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_rank: user.user_rank,
      user_expanded: user.user_expanded,
      attempts: Object.values(user.attempts),
    })),
  );

  console.log("Result", result);
  return result;
}

export default async function GradesPage() {
  const quizGrades = await getQuizGrades();
  const examGrades = await getExamGrades();

  return (
    <main className="flex-1 p-6">
      {/* <pre>{JSON.stringify(grades, null, 4)}</pre> */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grades</h1>
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Grade</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input id="student-name" placeholder="Enter student name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam-name">Assignment Name</Label>
                  <Input id="exam-name" placeholder="Enter exam name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" placeholder="Enter grade" type="number" />
                </div>
                <Button type="submit">Save Grade</Button>
              </form>
            </DialogDescription>
          </DialogContent>
        </Dialog> */}
      </div>
      <div className="mt-6 grid gap-6">
        <GradesWrapper quizGrades={quizGrades} examGrades={examGrades} />
      </div>
    </main>
  );
}
