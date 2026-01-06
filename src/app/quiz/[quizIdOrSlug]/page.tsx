import { notFound, redirect } from 'next/navigation';

import { getQuizFirstQuestion } from '@/data/db/server';

export default async function Category({
  params,
}: PageProps<'/quiz/[quizIdOrSlug]'>) {
  const type = (await params).quizIdOrSlug;

  const firstQuestion = await getQuizFirstQuestion(type);

  if (!firstQuestion) {
    return notFound();
  }

  return redirect(`/quiz/${type}/question/${firstQuestion.index}`);
}
