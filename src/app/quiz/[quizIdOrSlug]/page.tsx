import { notFound, redirect } from 'next/navigation';

import { getQuizzes, getQuizQuestions } from '@/data/db/server';

export default async function Category({
  params,
}: {
  params: Promise<{ quizIdOrSlug: string }>;
}) {
  const type = (await params).quizIdOrSlug;
  const availableCategories = await getQuizzes();

  const category = availableCategories.find(
    (availableCategory) => availableCategory.name === type
  );

  if (!category) {
    return notFound();
  }

  const questions = await getQuizQuestions(category.id);

  if (!questions?.length) {
    return notFound();
  }

  const firstQuestion = questions[0];

  return redirect(`/quiz/${type}/question/${firstQuestion.index}`);
}
