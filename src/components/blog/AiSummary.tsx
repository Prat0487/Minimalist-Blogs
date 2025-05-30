"use client";

import { summarizeBlogPost, type SummarizeBlogPostInput } from '@/ai/flows/summarize-blog-post';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AiSummaryProps {
  blogPostContent: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ blogPostContent }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const input: SummarizeBlogPostInput = { blogPostContent };
        const result = await summarizeBlogPost(input);
        setSummary(result.summary);
      } catch (err) {
        console.error("Failed to generate summary:", err);
        setError("Sorry, we couldn't generate a summary at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    if (blogPostContent) {
      fetchSummary();
    } else {
      setIsLoading(false);
      setError("No content provided for summary.");
    }
  }, [blogPostContent]);

  return (
    <Card className="mt-8 bg-primary/10 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-headline text-primary">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Generated Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
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
