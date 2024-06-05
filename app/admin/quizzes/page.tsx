import React from "react";

import getPb from "@/pb/getPb";
import QuizCard from "@/components/admin/QuizCard";

export default async function DashboardPage() {
  const pb = await getPb();

  const quizzes = await pb.collection("quizzes").getFullList();

  const studentList = await pb.collection("users").getFullList({
    filter: "roles = 'k4punq9hul00961'",
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quizzes.map((quiz: any) => (
          <QuizCard key={quiz.id} quiz={quiz} studentList={studentList} />
        ))}
      </div>
    </main>
  );
}
