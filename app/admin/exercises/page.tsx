//@ts-nocheck

import React from "react";
import getPb from "@/pb/getPb";
import ExercisesTable from "@/components/admin/ExerciseTable";

async function getExercises() {
  const pb = await getPb();

  // Fetch all exercises
  const exercises = await pb.collection("exercises").getFullList({
    sort: "-created",
  });

  // Fetch all exercise attempts
  const exercises_answers = await pb
    .collection("exercise_answers")
    .getFullList({
      sort: "-created",
      expand: "task,attempt,attempt.student,attempt.exercise",
    });

  const exercisesMap = new Map();

  // Initialize the map with all exercises
  exercises.forEach((exercise) => {
    exercisesMap.set(exercise.id, {
      id: exercise.id,
      name: exercise.name,
      title: exercise.title,
      description: exercise.description,
      unlocked: exercise.unlocked,
      created: exercise.created,
      updated: exercise.updated,
      students: new Map(), // Use a Map to ensure unique students
    });
  });

  // Populate the map with attempts
  exercises_answers.forEach((answer) => {
    const attempt = answer.expand?.attempt || {};
    const task = answer.expand?.task || {};
    const exercise = attempt.expand?.exercise || {};
    const student = attempt.expand?.student || {};

    if (exercisesMap.has(exercise.id)) {
      const exerciseEntry = exercisesMap.get(exercise.id);

      if (!exerciseEntry.students.has(student.id)) {
        exerciseEntry.students.set(student.id, {
          id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          email: student.email,
          rank: student.rank,
          mos: student.mos,
          branch: student.branch,
          courses: student.courses,
          avatar: student.avatar,
          username: student.username,
          verified: student.verified,
          enrolledDate: student.enrolled_date,
          lastLogin: student.last_login,
          roles: student.roles,
          updated: student.updated,
          created: student.created,
          emailVisibility: student.emailVisibility,
          birthdate: student.birthdate,
          attempts: new Map(), // Initialize a Map for attempts
        });
      }

      const studentEntry = exerciseEntry.students.get(student.id);

      if (!studentEntry.attempts.has(attempt.attempt)) {
        studentEntry.attempts.set(attempt.attempt, {
          attemptNumber: attempt.attempt,
          created: attempt.created,
          updated: attempt.updated,
          containerInfo: attempt.container_info,
          running: attempt.running,
          tasks: [],
        });
      }

      studentEntry.attempts.get(attempt.attempt).tasks.push({
        id: answer.task,
        question: task.question,
        hint: task.hint,
        answer: task.answer,
        description: task.desc,
        exerciseId: task.exercise,
        created: task.created,
        updated: task.updated,
        completed: answer.completed,
        submittedAnswer: answer.submitted_answer,
      });
    }
  });

  // Convert maps to arrays
  const result = Array.from(exercisesMap.values()).map((exercise) => {
    exercise.students = Array.from(exercise.students.values()).map(
      (student) => {
        student.attempts = Array.from(student.attempts.values());
        return student;
      },
    );
    return exercise;
  });

  return result;
}

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Exercises</h1>
      </div>
      <div className="rounded-lg border shadow-sm">
        <ExercisesTable exercises={exercises} />
      </div>
    </main>
  );
}
