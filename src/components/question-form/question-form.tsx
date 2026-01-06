'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import FuzzySet from 'fuzzyset';
import { Image } from '@unpic/react';

import styles from './question-form.module.css';
import { AudioIcon } from '../icons/audio';
import { MicIcon } from '../icons/mic';
import type { Speech as SpeechType } from '@/utils/speech';

type QuestionFormProps = {
  file: string;
  name: string;
  type: 'image' | 'audio' | 'track' | 'nest';
};

export const QuestionForm = ({ name, file, type }: QuestionFormProps) => {
  const [answer, setAnswer] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<'success' | 'error'>();
  const resultRef = useRef<HTMLParagraphElement>(null);
  const speech = useRef<SpeechType>(null);
  const checker = useRef(FuzzySet());
  checker.current.add(name);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!answer) {
      return;
    }

    const [[distance]] = checker.current.get(answer) || [[]];

    if ((distance && distance > 0.9) || answer === name) {
      setResult('success');
      navigator.vibrate(200);
    } else {
      setResult('error');
      navigator.vibrate([200, 100, 200]);
    }

    setTimeout(() => {
      resultRef.current?.focus();
    }, 0.1);
  };

  const onButton = async () => {
    const hasMicrophonePermission =
      (
        await navigator.permissions.query({
          name: 'microphone' as PermissionName,
        })
      ).state !== 'denied';

    if (!hasMicrophonePermission) {
      return alert('Give microphone permissions to use this feature');
    }

    if (!speech.current) {
      const Speech = (await import('@/utils/speech')).Speech;

      speech.current = new Speech({
        onFinished: () => {
          setIsListening(false);
        },
        onResult: (event: SpeechRecognitionEvent) => {
          setAnswer(event.results[0][0].transcript);
        },
      });
    }

    speech.current?.start();
    setIsListening(true);
  };

  return (
    <div
      className={`${styles.card} ${
        result === 'success' && styles.cardSuccess
      } ${result === 'error' && styles.cardError}`}
    >
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

        {!result && (
          <form className={styles.form} onSubmit={handleAnswer}>
            <div className={styles.inputAndMicContainer}>
              <label>
                Answer{' '}
                <input
                  name="answer"
                  onChange={handleInput}
                  value={answer}
                  aria-disabled={isListening}
                />
              </label>
              <button
                type="button"
                onClick={onButton}
                className={styles.micButton}
                aria-disabled={isListening}
              >
                <MicIcon />
              </button>
            </div>
            <button className="" type="submit" aria-disabled={isListening}>
              Check
            </button>
          </form>
        )}
      </div>
      {result && (
        <div className={styles.answer}>
          <p className={styles.result} tabIndex={-1} ref={resultRef}>
            {result === 'success' ? 'Correct!' : 'Wrong!'}
          </p>
          <strong className={styles.answerText}>{name}</strong>
        </div>
      )}
    </div>
  );
};
