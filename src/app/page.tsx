import { Suspense } from 'react';
import HomePageContent from '@/components/home/HomePageContent';
import PostGridSkeleton from '@/components/blog/PostGridSkeleton';

export default function HomePage() {
  return (
    <Suspense fallback={<PostGridSkeleton count={6} />}>
      <HomePageContent />
    </Suspense>
  );
}
