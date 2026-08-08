"use client";

import { summarizeBlogPost, type SummarizeBlogPostInput } from '@/ai/flows/summarize-blog-post';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AiSummaryProps {
  blogPostContent: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ blogPostContent }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!blogPostContent) {
      setError('No content provided for summary.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const input: SummarizeBlogPostInput = { blogPostContent };
      const result = await summarizeBlogPost(input);
      setSummary(result.summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      setError('Sorry, we could not generate a summary right now. Check that your Google AI API key is configured.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 bg-primary/10 border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="flex items-center text-lg font-headline text-primary">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Summary
        </CardTitle>
        {!summary && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!summary && !isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            Get a quick AI-generated overview of this article without reading the full post.
          </p>
        )}
        {isLoading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating summary...
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {summary && !isLoading && !error && (
          <p className="text-sm text-foreground/90 leading-relaxed">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AiSummary;
