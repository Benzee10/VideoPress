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

## Deploy to Vercel

### 1. Prepare Your Repository

Ensure these files are in your project root:
- `vercel.json` (already created)
- `api/` directory with serverless functions (already created)

### 2. Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

### 3. Environment Variables (Optional)

If you add database features later, configure these in Vercel Dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production"

### 4. Custom Domain (Optional)

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

### Adding New Posts

1. Create a new `.md` file in the `posts/` directory
2. Use the frontmatter format shown above
3. Deploy to see your changes live

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