
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addPost, type NewPostData } from '@/lib/posts';
import { type PostFormSchemaType, postFormSchema } from './form-schema';

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
