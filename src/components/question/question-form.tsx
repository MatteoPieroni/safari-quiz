'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import FuzzySet from 'fuzzyset';

import styles from './question.module.css';
import { MicIcon } from '../icons/mic';
import type { Speech as SpeechType } from '@/utils/speech';

type QuestionFormProps = {
  name: string;
};

export const QuestionForm = ({ name }: QuestionFormProps) => {
  const [answer, setAnswer] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<'success' | 'error'>();
  const [isHintShown, setIsHintShown] = useState(false);
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

  const hasSuggestion = name.split(' ').at(-1) !== name;
  const suggestion = name.split(' ').at(-1);
  const censoredName = suggestion
    ? name.replace(suggestion, '').replaceAll(/[a-zA-Z-']/g, '_')
    : undefined;

  return (
    <>
      {!result ? (
        <form className={styles.form} onSubmit={handleAnswer}>
          {hasSuggestion && (
            <div>
              <button
                type="button"
                onClick={() =>
                  setIsHintShown((previousState) => !previousState)
                }
                className={styles.hintButton}
              >
                Hint ?
              </button>
              {isHintShown && (
                <div>
                  {censoredName} {suggestion}
                </div>
              )}
            </div>
          )}
          <div className={styles.inputAndMicContainer}>
            <label>
              Answer{' '}
              <input
                name="question-answer"
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
      ) : (
        <div className={styles.answer}>
          <p className={styles.result} tabIndex={-1} ref={resultRef}>
            {result === 'success' ? 'Correct!' : 'Wrong!'}
          </p>
          <strong className={styles.answerText}>{name}</strong>
        </div>
      )}
      {result && (
        <span
          className={`result-spy ${result === 'success' ? 'success' : ''} ${
            result === 'error' ? 'error' : ''
          }`}
        ></span>
      )}
    </>
  );
};
