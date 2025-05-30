import type { FC } from 'react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Minimalist Blogs. All rights reserved.</p>
        <p>Crafted with care for a serene reading experience.</p>
      </div>
    </footer>
  );
};

export default Footer;
