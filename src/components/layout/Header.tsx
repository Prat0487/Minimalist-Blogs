
"use client";

import type { FC } from 'react';
import Logo from '@/components/common/Logo';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

const Header: FC = () => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const pathname = usePathname();
  const initialQuery = currentSearchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    // Sync searchQuery state if the URL query param changes externally,
    // but only if we are on the homepage where search is active.
    if (pathname === '/') {
      setSearchQuery(currentSearchParams.get('q') || '');
    } else {
      setSearchQuery(''); // Clear search query if not on homepage
    }
  }, [currentSearchParams, pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push('/'); // Navigate to homepage without query if search is cleared
    }
  };

  return (
    <header className="py-4 border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center space-x-2 sm:space-x-4 flex-grow justify-end">
          {pathname === '/' && (
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search posts"
              />
            </form>
          )}
           <Button variant="outline" size="sm" asChild>
            <Link href="/posts/new">
              <PlusCircle className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create Post</span>
            </Link>
          </Button>
          <DarkModeToggle />
        </div>
      </div>
      {pathname === '/' && (
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 text-sm w-full"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search posts"
              />
            </form>
          </div>
      )}
    </header>
  );
};

export default Header;
