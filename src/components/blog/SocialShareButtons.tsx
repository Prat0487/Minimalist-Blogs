"use client";

import { Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

const SocialShareButtons: FC<SocialShareButtonsProps> = ({ url, title }) => {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        toast({ title: "Shared successfully!" });
      } catch (error) {
        toast({ title: "Sharing failed", description: "Could not share using native share.", variant: "destructive" });
      }
    } else {
       toast({ title: "Native share not supported", description: "Your browser does not support native sharing.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center space-x-2">
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
      {typeof navigator !== 'undefined' && navigator.share && (
         <Button variant="outline" size="icon" onClick={handleNativeShare} aria-label="Share">
            <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SocialShareButtons;
