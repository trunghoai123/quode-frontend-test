'use client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_PROJECT_URL!,
  process.env.NEXT_PUBLIC_ACCESS_TOKEN!,
);

export async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from('post_images')
    .upload(Math.random().toString(36).substring(2), file);
  if (error) {
    console.log('upload error');
    return null;
  } else {
    console.log('upload success', data);
    return `${process.env.NEXT_PUBLIC_PROJECT_URL}/storage/v1/object/public/${data.fullPath}`;
  }
}
