
"use client";

import type { FC } from 'react';
import Logo from '@/components/common/Logo';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: FC = () => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const pathname = usePathname();
  const initialQuery = currentSearchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { user, signOutUser, loading } = useAuth(); // Changed signOut to signOutUser

  useEffect(() => {
    // Only update searchQuery from URL if on homepage and the query actually changes in URL
    if (pathname === '/') {
        const newQueryFromUrl = currentSearchParams.get('q') || '';
        if (newQueryFromUrl !== searchQuery) {
            setSearchQuery(newQueryFromUrl);
        }
    } else {
        // Clear search query if not on homepage, to prevent stale search terms
        // when navigating away and back using browser buttons
        if (searchQuery !== '') {
            setSearchQuery('');
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearchParams, pathname]); // searchQuery removed from deps to avoid loop

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (pathname !== '/') {
        // If search is submitted from a non-homepage, navigate to homepage with query
        if (trimmedQuery) {
            router.push(`/?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
            router.push('/');
        }
    } else {
        // If already on homepage, just update query params
        const params = new URLSearchParams(currentSearchParams.toString());
        if (trimmedQuery) {
            params.set('q', trimmedQuery);
        } else {
            params.delete('q');
        }
        router.push(`/?${params.toString()}`);
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[1]) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
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
          {loading ? (
            <Button variant="outline" size="icon" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOutUser}> {/* Changed signOut to signOutUser */}
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth">
                <LogIn className="mr-0 sm:mr-2 h-4 w-4" />
                 <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          )}
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
