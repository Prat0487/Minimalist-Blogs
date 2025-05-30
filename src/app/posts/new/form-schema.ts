
import { z } from 'zod';

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
