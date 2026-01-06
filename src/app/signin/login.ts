'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createServerClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createServerClient();

  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    redirect('/error');
  }

  if (email.replaceAll(' ', '') === '' || password.replaceAll(' ', '') === '') {
    redirect('/error');
  }

  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
