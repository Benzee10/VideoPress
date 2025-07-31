import { type Post, type InsertPost } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface IStorage {
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostsByCategory(category: string): Promise<Post[]>;
  getPostsByTag(tag: string): Promise<Post[]>;
  incrementViews(slug: string): Promise<void>;
  incrementLikes(slug: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private posts: Map<string, Post>;

  constructor() {
    this.posts = new Map();
    this.loadPostsFromMarkdown();
  }

  private async loadPostsFromMarkdown() {
    try {
      const postsDir = path.join(process.cwd(), "posts");
      if (!fs.existsSync(postsDir)) {
        console.log("Posts directory not found, creating sample posts in memory");
        this.createSamplePosts();
        return;
      }

      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const slug = file.replace('.md', '');
        const post: Post = {
          id: randomUUID(),
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          published: data.published || new Date().toISOString(),
          video: data.video || '',
          thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
          category: data.category || 'General',
          tags: data.tags || [],
          content,
          views: data.views || Math.floor(Math.random() * 5000),
          likes: data.likes || Math.floor(Math.random() * 500)
        };
        
        this.posts.set(slug, post);
      }
    } catch (error) {
      console.error("Error loading posts from markdown:", error);
      this. createSamplePosts();
    }
  }

  private createSamplePosts() {
    const samplePosts: Post[] = [
      {
        id: randomUUID(),
        slug: "home-office-setup",
        title: "Building the Perfect Home Office Setup",
        description: "Complete guide to creating a productive workspace that enhances creativity and focus. Learn about essential equipment, lighting, and organization tips.",
        published: "2024-12-15T10:00:00Z",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Technology",
        tags: ["workspace", "productivity", "homeoffice", "technology"],
        content: "# Building the Perfect Home Office Setup\n\nCreating an effective home office is essential for productivity and well-being...",
        views: 1200,
        likes: 89
      }
    ];

    samplePosts.forEach(post => {
      this.posts.set(post.slug, post);
    });
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return this.posts.get(slug);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  }

  async incrementViews(slug: string): Promise<void> {
    const post = this.posts.get(slug);
    if (post) {
      post.views += 1;
      this.posts.set(slug, post);
    }
  }

  async incrementLikes(slug: string): Promise<void> {
    const post = this.posts.get(slug);
    if (post) {
      post.likes += 1;
      this.posts.set(slug, post);
    }
  }
}

export const storage = new MemStorage();
