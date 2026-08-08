"use client";

import { Share2, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

const SocialShareButtons: FC<SocialShareButtonsProps> = ({ url, title }) => {
  const { toast } = useToast();
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const shareActions = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied', description: 'Article URL copied to your clipboard.' });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy the link. Please copy it manually from the address bar.',
        variant: 'destructive',
      });
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      toast({
        title: 'Native share not supported',
        description: 'Your browser does not support native sharing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.share({ title, url });
      toast({ title: 'Shared successfully!' });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      toast({
        title: 'Sharing failed',
        description: 'Could not share using native share.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      {shareActions.map((action) => (
        <Button
          key={action.name}
          variant="outline"
          size="icon"
          asChild
          aria-label={`Share on ${action.name}`}
        >
          <a href={action.href} target="_blank" rel="noopener noreferrer">
            {action.icon}
          </a>
        </Button>
      ))}
      <Button variant="outline" size="icon" onClick={handleCopyLink} aria-label="Copy link">
        <Link2 className="h-4 w-4" />
      </Button>
      {canNativeShare && (
        <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="Share">
          <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SocialShareButtons;
