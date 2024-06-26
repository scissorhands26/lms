"use client";

import { useState } from "react";
import QuizGradesTable from "./QuizGradesTable";
import ExamGradesTable from "./ExamGradesTable";
import { Button } from "../ui/button";

export default function GradesWrapper({ quizGrades, examGrades }: any) {
  const [shownTable, setShownTable] = useState("quiz");

  function handleTableChange(table: string) {
    console.log("Switching to table:", table);
    setShownTable(table);
  }

  return (
    <div>
      <div className="mb-4 flex w-full flex-row justify-between gap-4">
        <Button className="w-full" onClick={() => handleTableChange("quiz")}>
          Quiz
        </Button>
        <Button className="w-full" onClick={() => handleTableChange("exam")}>
          Exam
        </Button>
      </div>

      {shownTable === "quiz" ? (
        <QuizGradesTable dataGrades={quizGrades} />
      ) : (
        <ExamGradesTable dataGrades={examGrades} />
      )}
    </div>
  );
}
