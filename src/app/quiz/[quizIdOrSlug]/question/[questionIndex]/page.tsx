import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import {
  getSpeciesFromQuizQuestion,
  manageSpeciesFile,
} from '@/data/db/server';
import styles from './page.module.css';
import { HomeIcon } from '@/components/icons/home';
import { QuestionForm } from '@/components/question-form/question-form';

export default async function Category({
  params,
}: PageProps<'/quiz/[quizIdOrSlug]/question/[questionIndex]'>) {
  const quizIdOrSlug = (await params).quizIdOrSlug;
  const questionIndex = (await params).questionIndex;

  if (Number.isNaN(+questionIndex)) {
    throw new Error();
  }

  const data = await getSpeciesFromQuizQuestion(quizIdOrSlug, +questionIndex);

  if (!data || !data.data) {
    return notFound();
  }

  const {
    count,
    data: [previous, current, next],
  } = data;

  if (!current) {
    return notFound();
  }

  const {
    index,
    hint_type,
    quiz: { title },
    species,
    temp_hints,
  } = current;

  const questionNumber = index + 1;
  const file = await manageSpeciesFile(current, temp_hints[0], species);

  const { name } = species;

  return (
    <>
      <div className={styles.header}>
        <h1>{title}</h1>
        <Link href="/" className={styles.icon}>
          <HomeIcon />
        </Link>
      </div>

      <div className={styles.progress}>
        {count && (
          <>
            {questionNumber}
            <progress value={questionNumber} max={count}>
              {questionNumber}/{count}
            </progress>
            {count}
          </>
        )}
      </div>

      <Suspense>
        <QuestionForm file={file} name={name} type={hint_type} />
      </Suspense>

      <div className={styles.steppers}>
        {previous?.id ? (
          <Link href={`./${previous.index}`}>Previous</Link>
        ) : (
          <span></span>
        )}
        {next?.id && <Link href={`./${next.index}`}>Next</Link>}
      </div>
    </>
  );
}
