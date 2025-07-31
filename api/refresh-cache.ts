import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' || req.method === 'GET') {
    try {
      console.log('Manual cache refresh requested');
      
      // Force refresh the posts cache
      (storage as any).lastFetch = 0;
      (storage as any).posts.clear();
      
      // Trigger a fresh load
      const posts = await storage.getAllPosts();
      
      res.status(200).json({ 
        message: 'Cache refreshed successfully',
        postsCount: posts.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Cache refresh error:', error);
      res.status(500).json({ 
        message: 'Cache refresh failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}