import { VercelRequest, VercelResponse } from '@vercel/node';
import { GitHubAPI } from '../../lib/github';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { slug } = req.query;

  if (req.method === 'POST') {
    try {
      const githubAPI = new GitHubAPI();
      const post = await githubAPI.getPostBySlug(slug as string);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // For GitHub-based storage, we increment likes in memory only
      // In production, you'd track this in analytics or a separate service
      post.likes += 1;
      res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ message: "Failed to like post" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}