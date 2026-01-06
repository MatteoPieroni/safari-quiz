import { NextRequest } from 'next/server';
import { notFound, redirect } from 'next/navigation';

import { getQuizFirstQuestion } from '@/data/db/server';

export async function GET(
  _: NextRequest,
  ctx: RouteContext<'/quiz/[quizIdOrSlug]'>
) {
  const { quizIdOrSlug } = await ctx.params;

  const firstQuestion = await getQuizFirstQuestion(quizIdOrSlug);

  if (!firstQuestion) {
    return notFound();
  }

  return redirect(`/quiz/${quizIdOrSlug}/question/${firstQuestion.index}`);
}
