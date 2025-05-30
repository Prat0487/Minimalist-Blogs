import Link from 'next/link';
import type { FC } from 'react';

const Logo: FC = () => {
  return (
    <Link href="/" className="text-2xl font-headline font-bold text-primary hover:text-accent transition-colors">
      Minimalist Blogs
    </Link>
  );
};

export default Logo;
