
"use client";

import type { FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { postFormSchema, type PostFormSchemaType, createNewPostAction } from './actions';

const CreatePostPage: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<PostFormSchemaType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '<p>Start writing your amazing blog post here! You can use HTML for formatting.</p>\n<h2 class="text-xl font-headline mt-4 mb-2">A Subheading</h2>\n<p>More content...</p>\n<p><img src="https://placehold.co/600x400.png" alt="Placeholder image" class="my-4 rounded-md shadow-md" data-ai-hint="blog image" /></p>',
      excerpt: '',
      featuredImage: 'https://placehold.co/800x450.png',
      author: '',
      category: '',
      tags: '',
      readTime: '5 min read',
    },
  });

  const onSubmit: SubmitHandler<PostFormSchemaType> = async (data) => {
    const result = await createNewPostAction(data);

    if (result.success && result.slug) {
      toast({
        title: "Post Created!",
        description: result.message || "Your new blog post has been successfully created.",
      });
      router.push(`/posts/${result.slug}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error Creating Post",
        description: result.message || "Failed to create the post. Please check the form for errors.",
      });
      if (result.errors) {
        // Optionally set form errors if react-hook-form supports it directly from server action response
        Object.entries(result.errors).forEach(([fieldName, errors]) => {
          if (errors && errors.length > 0) {
            form.setError(fieldName as keyof PostFormSchemaType, { type: 'server', message: errors.join(', ') });
          }
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Create New Post</CardTitle>
          <CardDescription>Fill in the details below to publish a new blog post.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter post content in HTML format" {...field} rows={10} className="font-code text-sm" />
                    </FormControl>
                    <FormDescription>You can use HTML tags for formatting.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a short summary of the post" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png or https://placehold.co/800x450.png" {...field} />
                    </FormControl>
                     <FormDescription>Add a data-ai-hint attribute to your img tag in content if using placeholders for better AI image suggestions.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post category (e.g., Lifestyle)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., tech, travel, food" {...field} />
                    </FormControl>
                    <FormDescription>Separate tags with a comma.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 min read" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePostPage;
