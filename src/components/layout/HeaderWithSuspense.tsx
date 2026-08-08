"use client";

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';

function HeaderFallback() {
  return (
    <header className="py-4 border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 hidden sm:block" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export default function HeaderWithSuspense() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <Header />
    </Suspense>
  );
}
