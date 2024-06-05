"use server";

export async function submitQuiz(formData: FormData) {
  console.log("Submitted Quiz:");

  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}

export async function navigateToQuiz(quiz: any) {}
