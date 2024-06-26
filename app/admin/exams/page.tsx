import React from "react";

import getPb from "@/pb/getPb";
import ExamCard from "@/components/admin/ExamCard";

export default async function ExamsPage() {
  const pb = await getPb();

  const exams = await pb.collection("exams").getFullList();

  const studentList = await pb.collection("users").getFullList({
    filter: "roles = 'k4punq9hul00961'",
  });

  const examAnswers = await pb.collection("exam_answers").getFullList({
    expand: "user,exam,attempt,question",
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {exams.map((exam: any) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            studentList={studentList}
            examAnswers={examAnswers}
          />
        ))}
      </div>
    </main>
  );
}
