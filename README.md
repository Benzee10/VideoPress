# VideoHub - Modern Video Blog Template

A modern, responsive video blog template built with React, Express.js, and TypeScript. Features support for embedded videos (YouTube, Vimeo) and direct MP4 files with Markdown-based content management.

## Features

- **Video Support**: Handles both iframe embeds and direct MP4 video files
- **Responsive Design**: Mobile-first design with clean, modern interface
- **Dark/Light Mode**: Complete theme system with user preference storage
- **Search & Filter**: Category filtering and text search functionality
- **SEO Optimized**: Proper meta tags and Open Graph support
- **Markdown Content**: Easy content management with frontmatter metadata

## Quick Start

### Local Development

1. **Clone and Install**:
   ```bash
   git clone <your-repo>
   cd videohub
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5000`

3. **Add Content**:
   Create `.md` files in the `posts/` directory with this structure:
   ```yaml
   ---
   title: "Your Video Title"
   description: "Brief description of the video content"
   published: "2025-07-31T20:00:00Z"
   video: "<iframe src='https://www.youtube.com/embed/VIDEO_ID'></iframe>"
   # OR for MP4: video: "https://example.com/video.mp4"
   thumbnail: "https://example.com/thumbnail.jpg"
   category: "Technology"
   tags: ["tech", "tutorial"]
   ---

   # Your markdown content here
   ```

## Deploy to Vercel with GitHub Posts

This blog loads posts directly from a GitHub repository, making it completely static and easy to manage.

### 1. Create Your Posts Repository

**Option A: Separate Posts Repository (Recommended)**
1. Create a new GitHub repository for your posts (e.g., `videohub-posts`)
2. Create a `posts/` directory in the root
3. Add your markdown files to the `posts/` directory

**Option B: Use Same Repository**
1. Keep your posts in the existing `posts/` directory
2. Set `GITHUB_REPO` to your main repository name

### 2. Configure Environment Variables

In Vercel Dashboard or CLI, set these environment variables:

**Required:**
- `GITHUB_REPO` - Your repository in format `username/repository-name`

**Optional:**
- `GITHUB_TOKEN` - GitHub personal access token (for private repos or higher rate limits)

**Example:**
```bash
GITHUB_REPO=johndoe/videohub-posts
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel --env GITHUB_REPO=username/repo-name
```

**Option B: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Add environment variables in Project Settings
5. Click "Deploy"

### 4. GitHub Token Setup (Optional)

For private repositories or to avoid rate limits:

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (for private repos) or `public_repo` (for public repos)
4. Copy the token and add it as `GITHUB_TOKEN` in Vercel

### 5. Set Up Auto-Refresh (Optional)

To automatically refresh your blog when you update posts in GitHub:

1. In your posts repository, go to Settings → Webhooks
2. Click "Add webhook"
3. Set Payload URL to: `https://your-domain.vercel.app/api/webhook/github`
4. Set Content type to: `application/json`
5. Select "Just the push event"
6. Click "Add webhook"

Now your blog will update immediately when you push new posts!

**Manual Refresh:** Visit `https://your-domain.vercel.app/api/refresh-cache` to manually refresh the cache.

### 6. Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Project Structure

```
videohub/
├── api/                    # Vercel serverless functions
│   └── posts/             # API endpoints
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
│   └── dist/             # Build output
├── posts/                 # Markdown blog posts
├── server/                # Express server (dev only)
├── shared/                # Shared types and schemas
└── vercel.json           # Vercel configuration
```

## Content Management

### Adding New Posts via GitHub

**Method 1: GitHub Web Interface**
1. Go to your posts repository on GitHub
2. Navigate to the `posts/` directory
3. Click "Add file" → "Create new file"
4. Name your file `post-slug.md`
5. Add frontmatter and content (see format above)
6. Commit the file
7. Your blog will automatically update within 5 minutes

**Method 2: Git Commands**
```bash
# Clone your posts repository
git clone https://github.com/username/videohub-posts.git
cd videohub-posts

# Create new post
cat > posts/my-new-video.md << 'EOF'
---
title: "My Awesome New Video"
description: "Description of the video content"
published: "2025-07-31T20:00:00Z"
video: "https://www.youtube.com/embed/VIDEO_ID"
thumbnail: "https://example.com/thumbnail.jpg"
category: "Technology"
tags: ["tutorial", "tech"]
---

# My New Video Post

Your markdown content here...
EOF

# Commit and push
git add .
git commit -m "Add new video post"
git push
```

**Method 3: GitHub Desktop**
1. Clone your posts repository using GitHub Desktop
2. Add/edit markdown files in the `posts/` directory
3. Commit and sync changes
4. Blog updates automatically

### Editing Existing Posts

1. Find the post file in your GitHub repository
2. Click the edit button (pencil icon)
3. Make your changes
4. Commit the changes
5. Blog updates within 5 minutes

### Video Formats Supported

**Embedded Videos** (YouTube, Vimeo, etc.):
```yaml
video: "<iframe src='https://www.youtube.com/embed/VIDEO_ID' frameborder='0' allowfullscreen></iframe>"
```

**Direct MP4 Files**:
```yaml
video: "https://example.com/path/to/video.mp4"
```

### Categories

Available categories:
- Technology
- Entertainment  
- Education
- Lifestyle
- Travel
- Health
- Music
- Art
- Gardening

## Customization

### Styling
- Edit `client/src/index.css` for global styles
- Modify color scheme in CSS custom properties
- Component styles use Tailwind CSS classes

### Layout
- Header/Footer: `client/src/components/Layout.tsx`
- Homepage: `client/src/pages/home.tsx`
- Post page: `client/src/pages/post.tsx`

### Adding Features
- API routes: Add to `api/` directory
- Frontend components: Add to `client/src/components/`
- New pages: Add to `client/src/pages/` and register in `App.tsx`

## Performance Optimizations

- **Image Optimization**: Consider using Vercel's Image Optimization
- **Video Loading**: Lazy loading implemented for better performance
- **Caching**: Static assets cached automatically by Vercel
- **Bundle Size**: Tree-shaking enabled for smaller bundles

## Troubleshooting

### Common Issues

**Build Errors**: 
- Check that all dependencies are listed in `package.json`
- Ensure TypeScript types are correct

**API Not Working**:
- Verify `vercel.json` routes configuration
- Check serverless function logs in Vercel Dashboard

**Videos Not Loading**:
- Ensure iframe embed codes are complete
- Check MP4 URLs are accessible
- Verify CORS settings for external videos

### Support

For issues with deployment or customization, check:
1. Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
2. Project issues on GitHub
3. Vercel community forum

## License

MIT License - feel free to use for personal or commercial projects.