import { randomUUID } from "crypto";
import matter from "gray-matter";
import type { Post } from '../../shared/schema';

export class GitHubAPI {
  private githubRepo: string;
  private githubToken?: string;

  constructor() {
    this.githubRepo = process.env.GITHUB_REPO || 'your-username/your-repo';
    this.githubToken = process.env.GITHUB_TOKEN;
  }

  async fetchPosts(): Promise<Post[]> {
    try {
      console.log(`Fetching posts from GitHub repo: ${this.githubRepo}`);
      
      const apiUrl = `https://api.github.com/repos/${this.githubRepo}/contents/posts`;
      
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'VideoHub-Blog'
      };

      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`;
      }

      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        return this.createSamplePosts();
      }

      const files = await response.json();
      const posts: Post[] = [];

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
            
            posts.push(post);
          } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError);
          }
        }
      }

      console.log(`Loaded ${posts.length} posts from GitHub`);
      return posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
      
    } catch (error) {
      console.error("Error loading posts from GitHub:", error);
      return this.createSamplePosts();
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return this.fetchPosts();
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const posts = await this.fetchPosts();
    return posts.find(post => post.slug === slug);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await this.fetchPosts();
    return posts
      .filter(post => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await this.fetchPosts();
    return posts
      .filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  }

  private createSamplePosts(): Post[] {
    return [
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
      },
      {
        id: randomUUID(),
        slug: "italian-pasta",
        title: "Mastering Italian Pasta from Scratch",
        description: "Learn traditional techniques for making authentic Italian pasta at home. From selecting ingredients to perfecting the texture.",
        published: "2024-12-12T14:30:00Z",
        video: "<iframe width='560' height='315' src='https://www.youtube.com/embed/dQw4w9WgXcQ' frameborder='0' allowfullscreen></iframe>",
        thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        category: "Lifestyle",
        tags: ["cooking", "pasta", "italian", "food"],
        content: "# Mastering Italian Pasta from Scratch\n\nMaking pasta from scratch is one of the most rewarding culinary experiences...",
        views: 2800,
        likes: 156
      }
    ];
  }
}