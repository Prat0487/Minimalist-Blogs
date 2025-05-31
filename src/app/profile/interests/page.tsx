
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const predefinedInterests = [
  "Minimalism", "Personal Growth", "Simplicity", "Mindfulness", 
  "Well-being", "Productivity", "Self-care", "Lifestyle", 
  "Time Management", "Technology", "Travel", "Food", "Finance",
  "Boundaries", "Routine", "Self-respect" // Added from post tags/categories
];

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth'); 
    }
    if (user) {
      const savedInterestsRaw = localStorage.getItem(`userInterests_${user.uid}`);
      if (savedInterestsRaw) {
        try {
          const savedInterests = JSON.parse(savedInterestsRaw);
          if (Array.isArray(savedInterests) && savedInterests.every(item => typeof item === 'string')) {
            setSelectedInterests(savedInterests);
          }
        } catch (error) {
          console.error("Error parsing saved interests from localStorage:", error);
        }
      }
    }
  }, [user, authLoading, router]);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveChanges = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save interests.',
        variant: 'destructive',
      });
      return;
    }
    setIsSaving(true);
    
    // Simulate API call if needed, for now direct localStorage
    localStorage.setItem(`userInterests_${user.uid}`, JSON.stringify(selectedInterests));

    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network latency

    toast({
      title: 'Interests Saved!',
      description: `Your preferences have been updated. ${selectedInterests.length > 0 ? 'Recommendations on the homepage will now be tailored.' : 'Clear your selections to see all posts.'}`,
    });
    setIsSaving(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Select Your Interests</CardTitle>
          <CardDescription>
            Help us personalize your content by selecting topics you&apos;re interested in.
            These will be used to recommend articles on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium text-foreground">Choose your favorite topics:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {predefinedInterests.sort().map(interest => (
              <div key={interest} className="flex items-center space-x-2 p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                  checked={selectedInterests.includes(interest)}
                  onCheckedChange={() => handleInterestChange(interest)}
                  aria-label={interest}
                />
                <Label
                  htmlFor={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-normal cursor-pointer flex-grow"
                >
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Interests'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
