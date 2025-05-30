
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addPost, type NewPostData } from '@/lib/posts';

export const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
  excerpt: z.string().min(5, "Excerpt must be at least 5 characters long."),
  featuredImage: z.string().url("Please enter a valid URL for the featured image. Use https://placehold.co/800x450.png for a placeholder."),
  author: z.string().min(2, "Author name must be at least 2 characters long."),
  category: z.string().min(2, "Category must be at least 2 characters long."),
  tags: z.string().min(1, "Please enter at least one tag, comma-separated."),
  readTime: z.string().min(1, "Read time is required (e.g., '5 min read')."),
});

export type PostFormSchemaType = z.infer<typeof postFormSchema>;

export async function createNewPostAction(data: PostFormSchemaType) {
  try {
    const validatedData = postFormSchema.parse(data);

    const newPostData: NewPostData = {
      ...validatedData,
      tags: validatedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    const newPost = addPost(newPostData);

    revalidatePath('/');
    revalidatePath('/posts');
    revalidatePath(`/posts/${newPost.slug}`);
    
    // Return a success status and the new slug
    return { success: true, slug: newPost.slug, message: 'Post created successfully!' };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors, message: 'Validation failed.' };
    }
    console.error('Error creating post:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}
