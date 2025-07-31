import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

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

  if (req.method === 'GET') {
    try {
      const post = await storage.getPostBySlug(slug as string);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment views
      await storage.incrementViews(slug as string);
      
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}