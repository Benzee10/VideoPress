import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-GitHub-Event, X-GitHub-Delivery, X-Hub-Signature-256');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const event = req.headers['x-github-event'];
      
      // Only process push events that affect the posts directory
      if (event === 'push') {
        const payload = req.body;
        
        // Check if any commits affected the posts directory
        const affectsPosts = payload.commits?.some((commit: any) => 
          commit.added?.some((file: string) => file.startsWith('posts/')) ||
          commit.modified?.some((file: string) => file.startsWith('posts/')) ||
          commit.removed?.some((file: string) => file.startsWith('posts/'))
        );

        if (affectsPosts) {
          console.log('GitHub webhook: Posts directory updated, clearing cache');
          
          // Force refresh the posts cache
          // We can access the private method by casting to any
          (storage as any).lastFetch = 0;
          (storage as any).posts.clear();
          
          // Trigger a fresh load
          await storage.getAllPosts();
          
          res.status(200).json({ 
            message: 'Cache refreshed successfully',
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(200).json({ 
            message: 'No posts affected, cache not refreshed',
            timestamp: new Date().toISOString()
          });
        }
      } else {
        res.status(200).json({ 
          message: 'Event ignored',
          event,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ 
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}