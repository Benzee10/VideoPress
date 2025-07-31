import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Heart, ArrowLeft, Share } from "lucide-react";
import Layout from "@/components/Layout";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Post } from "@shared/schema";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
    enabled: !!slug,
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/posts/${slug}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", slug] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post liked!",
        description: "Thanks for showing your appreciation.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to like post",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or sharing failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied!",
        description: "The post link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy link",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'Entertainment': 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
      'Education': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'Lifestyle': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Travel': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      'Health': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      'Music': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      'Art': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'Gardening': 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The video post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="aspect-video w-full rounded-xl mb-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The video post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Set document title and meta tags for SEO
  if (typeof document !== 'undefined') {
    document.title = `${post.title} | VideoHub`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', post.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', post.description);
      document.head.appendChild(metaDescription);
    }

    // Update Open Graph tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateMetaTag('og:title', post.title);
    updateMetaTag('og:description', post.description);
    updateMetaTag('og:image', post.thumbnail);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('twitter:title', post.title);
    updateMetaTag('twitter:description', post.description);
    updateMetaTag('twitter:image', post.thumbnail);
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
          </Link>
        </div>

        {/* Video Player */}
        <VideoPlayer video={post.video} title={post.title} className="mb-8" />

        {/* Post Content */}
        <div className="space-y-6">
          {/* Post Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Badge className={`text-sm font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Published {formatDate(post.published)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViews(post.views)} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes} likes
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {post.title}
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              variant="outline"
              size="sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              {likeMutation.isPending ? "Liking..." : "Like"}
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
            
            {/* Content */}
            <div className="mt-8">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag key={index} className="font-semibold text-foreground mt-8 mb-4">
                      {text}
                    </HeadingTag>
                  );
                } else if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').map(item => item.replace(/^[*-]\s*/, ''));
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-medium text-foreground mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
