import AttemptCard from "@/components/admin/AttemptCard";
import getPb from "@/pb/getPb";

async function getExercise(id: string) {
  const pb = await getPb();
  pb.autoCancellation(false);

  const exercise = await pb.collection("exercises").getOne(id);

  const tasks = await pb.collection("exercise_tasks").getFullList({
    filter: `exercise = "${id}"`,
  });

  const attempts = await pb.collection("exercise_attempts").getFullList({
    filter: `exercise = "${id}"`,
    expand: "student",
  });

  const fetchRecordsForAttempt = async (attempt: any) => {
    const records = await pb.collection("exercise_answers").getFullList({
      filter: `attempt = "${attempt.id}"`,
    });
    return records;
  };

  const fetchAllRecords = async () => {
    const promises = attempts.map(async (attempt) => {
      const records = await fetchRecordsForAttempt(attempt);
      return { ...attempt, answers: records };
    });

    const results = await Promise.all(promises);
    return results;
  };

  const attemptsWithAnswers = await fetchAllRecords(); // Await the completion of fetching all records

  const runningAttempts = attemptsWithAnswers.filter(
    // @ts-ignore
    (attempt) => attempt.running,
  );

  const fullExercise = {
    ...exercise,
    tasks,
    attempts: attemptsWithAnswers,
    runningAttempts,
  };

  return fullExercise;
}

export default async function ExercisesPage({ params }: any) {
  console.log(params.id);
  const exercise = await getExercise(params.id);

  return (
    <div>
      <h1>Attempts</h1>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exercise.runningAttempts?.map((attempt) => (
            <AttemptCard
              key={attempt.id}
              attempt={attempt}
              exerciseID={exercise.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
