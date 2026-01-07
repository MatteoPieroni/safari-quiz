import { Suspense } from 'react';
import { Image } from '@unpic/react';

import styles from './question.module.css';
import { AudioIcon } from '../icons/audio';
import { QuestionForm } from './question-form';

type QuestionProps = {
  file: string;
  name: string;
  type: 'image' | 'audio' | 'track' | 'nest';
};

export const Question = ({ name, file, type }: QuestionProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.question}>
        {type === 'audio' && (
          <div className={styles.audioContainer}>
            <AudioIcon className={styles.audioIcon} />
            <audio src={file} controls className={styles.audio} />
          </div>
        )}
        {(type === 'image' || type === 'nest' || type === 'track') && (
          <div>
            <Image
              className={styles.img}
              layout="fullWidth"
              src={file}
              alt="FIX ME"
              priority
            />
          </div>
        )}

        <Suspense>
          <QuestionForm name={name} />
        </Suspense>
      </div>
    </div>
  );
};
