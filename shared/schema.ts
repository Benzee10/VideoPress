import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  published: z.string().datetime(),
  video: z.string(), // Either iframe embed code or MP4 URL
  thumbnail: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  content: z.string(), // Markdown content
  views: z.number().default(0),
  likes: z.number().default(0),
});

export const insertPostSchema = postSchema.omit({ id: true });

export type Post = z.infer<typeof postSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;

// Categories enum for type safety
export const categories = [
  "Technology",
  "Entertainment", 
  "Education",
  "Lifestyle",
  "Travel",
  "Health",
  "Music",
  "Art",
  "Gardening"
] as const;

export type Category = typeof categories[number];
