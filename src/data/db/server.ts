import { add, formatISO, isAfter } from 'date-fns';

import { createClient as createServerClient } from '@/utils/supabase/server';
import type { Database } from '../supabase-generated';

const signedImageDuration = 60 * 60 * 24 * 7;

export const getQuizzes = async () => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('quiz').select();

  if (error || !data.length) {
    throw error;
  }

  return data;
};

export const getQuizQuestions = async (quizId: number) => {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('quiz_questions')
    .select()
    .eq('quiz', quizId)
    .order('index');

  return data;
};

export const getSpeciesFromQuizQuestion = async (
  quizIdOrSlug: string,
  questionIndex: number
) => {
  const supabase = await createServerClient();

  const typedQuizId = !Number.isNaN(+quizIdOrSlug)
    ? +quizIdOrSlug
    : quizIdOrSlug;

  const query = supabase
    .from('quiz_questions')
    .select(
      '*, quiz!inner(title, id), species!inner(name, image_file, track_file, sound_file, nest_file), temp_hints(*)',
      {
        count: 'exact',
      }
    );
  const queryFilteredByQuiz =
    typeof typedQuizId === 'string'
      ? query.eq('quiz.name', typedQuizId)
      : query.eq('quiz.id', typedQuizId);

  const orderedQuery = queryFilteredByQuiz.order('index');

  let filteredQuery: typeof orderedQuery | undefined = undefined;

  // if index === 0, we're at the first question, so we only take the current and next
  if (questionIndex === 0) {
    filteredQuery = orderedQuery.limit(2);
  } else {
    // if index > 0, then we start taking at the previous index and take only 3, to give back [previous, current, next]
    const previousQuestionIndex = questionIndex - 1;

    filteredQuery = orderedQuery.gte('index', previousQuestionIndex).limit(3);
  }

  const { data, count: remainingQuestionsCount, error } = await filteredQuery;

  const count = remainingQuestionsCount
    ? questionIndex + remainingQuestionsCount
    : null;
  const dataWithPreviousAndNext =
    data?.length === 2 ? [undefined, ...data] : data;

  return { count, data: dataWithPreviousAndNext };
};

export const getSpeciesFromCategory = async (categoryId: string) => {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('species')
    .select()
    .eq('category', categoryId)
    .eq('hint_type', 0)
    .is('sub_category', null);

  if (!data) {
    throw new Error();
  }

  return data;
};

const storageLocations = {
  audio: 'sounds',
  image: 'images',
  track: 'images',
  nest: 'images',
} satisfies Record<Database['public']['Enums']['hint_type'], string>;

export const manageSpeciesFile = async (
  question: Pick<
    Database['public']['Tables']['quiz_questions']['Row'],
    'hint_type' | 'id'
  >,
  tempHint: Database['public']['Tables']['temp_hints']['Row'],
  species: Pick<
    Database['public']['Tables']['species']['Row'],
    'image_file' | 'track_file' | 'sound_file' | 'nest_file'
  >
) => {
  if (tempHint?.url) {
    const isExpiring = !isAfter(
      tempHint.expiration_date,
      add(new Date(), { days: 1 })
    );

    // if it's not close to expiring return image
    if (!isExpiring) {
      return tempHint.url;
    }
  }

  let speciesFile = undefined;

  switch (question.hint_type) {
    case 'image':
      speciesFile = species.image_file;
      break;
    case 'audio':
      speciesFile = species.sound_file;
      break;
    case 'nest':
      speciesFile = species.nest_file;
      break;
    case 'track':
      speciesFile = species.track_file;
      break;
  }

  if (!speciesFile) {
    throw new Error('No species file for: ' + question.hint_type);
  }

  const supabase = await createServerClient();

  const { data } = await supabase.storage
    .from(storageLocations[question.hint_type])
    .createSignedUrl(speciesFile, signedImageDuration);

  if (!data?.signedUrl) {
    throw new Error('Not able to create signed url');
  }

  const { signedUrl } = data;

  const expirationDate = add(new Date(), { seconds: signedImageDuration });
  const expirationDateISO = formatISO(expirationDate);

  // create or update new temp_hint row
  const { data: updateData, error: updateError } = await supabase
    .from('temp_hints')
    .upsert({
      id: tempHint?.id,
      quiz_question: question.id,
      expiration_date: expirationDateISO,
      url: signedUrl,
    })
    .select()
    .single();

  if (updateError) {
    console.error({ updateError });
    throw new Error('NO_HINT_CREATED');
  }

  if (!updateData) {
    throw new Error('NO_HINT_CREATED');
  }

  return updateData.url;
};

export const addImageToSpecies = async (
  speciesId: string,
  imageName: string
) => {
  const supabase = await createServerClient();

  // update species with id
  const response = await supabase
    .from('species')
    .update({
      image_file: imageName,
    })
    .eq('id', speciesId);

  console.log({ response });
};
