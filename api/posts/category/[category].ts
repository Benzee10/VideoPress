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

  const { category } = req.query;

  if (req.method === 'GET') {
    try {
      const githubAPI = new GitHubAPI();
      const posts = await githubAPI.getPostsByCategory(category as string);
      res.status(200).json(posts);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ message: "Failed to fetch posts by category" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}