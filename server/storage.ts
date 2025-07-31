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

export class GitHubStorage implements IStorage {
  private posts: Map<string, Post>;
  private lastFetch: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes cache
  private githubRepo: string;
  private githubToken?: string;

  constructor() {
    this.posts = new Map();
    this.githubRepo = process.env.GITHUB_REPO || 'your-username/your-repo'; // e.g., 'username/videohub-posts'
    this.githubToken = process.env.GITHUB_TOKEN; // Optional for private repos
    this.loadPostsFromGitHub();
  }

  private async loadPostsFromGitHub() {
    try {
      // Check if we need to refresh cache
      const now = Date.now();
      if (this.posts.size > 0 && (now - this.lastFetch) < this.cacheTimeout) {
        return;
      }

      console.log(`Fetching posts from GitHub repo: ${this.githubRepo}`);
      
      // GitHub API URL to list contents of posts directory
      const apiUrl = `https://api.github.com/repos/${this.githubRepo}/contents/posts`;
      
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'VideoHub-Blog'
      };

      // Add auth token if available (for private repos)
      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`;
      }

      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        this.loadLocalFallback();
        return;
      }

      const files = await response.json();
      
      // Clear existing posts
      this.posts.clear();

      // Process each markdown file
      for (const file of files) {
        if (file.name.endsWith('.md') && file.type === 'file') {
          try {
            const fileResponse = await fetch(file.download_url);
            const fileContent = await fileResponse.text();
            const { data, content } = matter(fileContent);
            
            const slug = file.name.replace('.md', '');
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
          } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError);
          }
        }
      }

      this.lastFetch = now;
      console.log(`Loaded ${this.posts.size} posts from GitHub`);
      
    } catch (error) {
      console.error("Error loading posts from GitHub:", error);
      this.loadLocalFallback();
    }
  }

  private async loadLocalFallback() {
    try {
      console.log("Falling back to local posts directory");
      const postsDir = path.join(process.cwd(), "posts");
      
      if (!fs.existsSync(postsDir)) {
        console.log("No local posts directory found, creating sample posts");
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
      console.error("Error loading local posts:", error);
      this.createSamplePosts();
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
    await this.loadPostsFromGitHub(); // Refresh from GitHub if needed
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    await this.loadPostsFromGitHub(); // Refresh from GitHub if needed
    return this.posts.get(slug);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    await this.loadPostsFromGitHub(); // Refresh from GitHub if needed
    return Array.from(this.posts.values())
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    await this.loadPostsFromGitHub(); // Refresh from GitHub if needed
    return Array.from(this.posts.values())
      .filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  }

  async incrementViews(slug: string): Promise<void> {
    // For GitHub-based storage, we'll just increment in memory
    // In a real app, you might want to track this in a separate analytics service
    const post = this.posts.get(slug);
    if (post) {
      post.views += 1;
      this.posts.set(slug, post);
    }
  }

  async incrementLikes(slug: string): Promise<void> {
    // For GitHub-based storage, we'll just increment in memory
    // In a real app, you might want to track this in a separate analytics service
    const post = this.posts.get(slug);
    if (post) {
      post.likes += 1;
      this.posts.set(slug, post);
    }
  }
}

export const storage = new GitHubStorage();
