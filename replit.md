# VideoHub - Modern Video Blog Template

## Overview

VideoHub is a modern, responsive blog template specifically designed for video content. Built with React, Express.js, and TypeScript, it provides a complete solution for showcasing video posts with embedded content from various sources (YouTube, Vimeo, direct MP4 files). The application features a clean, fast, and mobile-friendly interface with support for Markdown-based content management.

The system supports multiple video formats through intelligent rendering - handling both iframe embeds and native HTML5 video players. Posts are managed through Markdown files with frontmatter metadata, making content creation simple and flexible.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Vite**: Fast build tool and development server with hot module replacement
- **Wouter**: Lightweight client-side routing library for navigation
- **TanStack Query**: Server state management for efficient data fetching, caching, and synchronization
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built, accessible UI components with Radix UI primitives

### Backend Architecture
- **Express.js**: RESTful API server handling blog post operations
- **File-based Storage**: Posts stored as Markdown files with frontmatter metadata
- **Memory Storage**: In-memory caching layer for fast post retrieval and view/like tracking
- **Gray-matter**: Markdown frontmatter parsing for post metadata extraction

### Data Storage Strategy
- **Markdown Files**: Posts stored in `/posts` directory with .md extension
- **Frontmatter Schema**: Structured metadata including title, description, video URL, thumbnail, category, tags, and timestamps
- **In-memory Cache**: Runtime storage for view counts, likes, and processed post data
- **Database Ready**: Drizzle ORM configured for PostgreSQL migration when needed

### Video Content Handling
- **Dual Format Support**: Automatic detection and rendering of iframe embeds vs MP4 files
- **Responsive Video Player**: Custom VideoPlayer component with error handling and loading states
- **Embed Code Processing**: Safe HTML rendering for YouTube/Vimeo iframe embeds
- **Native Video Support**: HTML5 video player for direct MP4 content with controls

### Theming and UI Design
- **Dark/Light Mode**: Complete theme system with CSS custom properties
- **Component Library**: Comprehensive UI component set using Radix UI primitives
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Custom Styling**: Extended Tailwind configuration with design system colors

### Content Management
- **Markdown Processing**: Simple markdown-to-HTML conversion for post content
- **Category System**: Predefined categories with color-coded badges
- **Tag Support**: Flexible tagging system for content organization
- **Search and Filter**: Client-side filtering by category, tags, and text search

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connector (prepared for future use)
- **drizzle-orm & drizzle-kit**: Type-safe ORM and database toolkit
- **gray-matter**: YAML frontmatter parser for Markdown files
- **express**: Web application framework for Node.js

### Frontend UI Libraries
- **@radix-ui/***: Accessible, unstyled UI primitives for complex components
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Minimalist routing library for React
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and enhanced developer experience
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Content Processing
- **date-fns**: Date formatting and manipulation utilities
- **clsx & tailwind-merge**: Conditional CSS class management
- **cmdk**: Command menu functionality for enhanced UX
- **embla-carousel-react**: Touch-friendly carousel implementation

The architecture prioritizes performance, developer experience, and scalability while maintaining simplicity in content management through the Markdown-based approach.