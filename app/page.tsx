'use client';
import ImageUploader from '@/components/ImageUploader';
import ImagePost from '@/components/ImagePost';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-14 max-w-5xl mx-auto">
      <ImageUploader />
      <ImagePost />
    </main>
  );
}
