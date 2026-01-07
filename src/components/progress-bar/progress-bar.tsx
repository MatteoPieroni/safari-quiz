import { getQuizQuestionsCount } from '@/data/db/server';
import styles from './progress-bar.module.css';

type ProgressBarProps = {
  quizIdOrSlug: string;
  questionNumber: number;
};

export const ProgressBar = async ({
  quizIdOrSlug,
  questionNumber,
}: ProgressBarProps) => {
  const count = await getQuizQuestionsCount(quizIdOrSlug);

  if (!count) {
    return null;
  }

  return (
    <div className={styles.progress}>
      <>
        {questionNumber}
        <progress value={questionNumber} max={count}>
          {questionNumber}/{count}
        </progress>
        {count}
      </>
    </div>
  );
};
