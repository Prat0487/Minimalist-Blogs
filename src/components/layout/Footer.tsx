import type { FC } from 'react';
import Link from 'next/link';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Minimalist Blogs. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Footer navigation">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/posts/new" className="hover:text-foreground transition-colors">
              Create Post
            </Link>
            <Link href="/profile/interests" className="hover:text-foreground transition-colors">
              Interests
            </Link>
            <Link href="/auth" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Crafted with care for a serene reading experience.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
