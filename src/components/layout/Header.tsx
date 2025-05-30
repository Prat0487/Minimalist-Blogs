import type { FC } from 'react';
import Logo from '@/components/common/Logo';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Header: FC = () => {
  return (
    <header className="py-4 border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search posts..." 
              className="pl-10 pr-4 py-2 text-sm" 
            />
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
