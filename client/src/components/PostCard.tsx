import { Play, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  return (
    <Link href={`/post/${post.slug}`}>
      <Card className="video-card-hover bg-card rounded-xl shadow-lg overflow-hidden cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={post.thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450';
            }}
          />
          <div className="video-overlay absolute inset-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="text-white w-6 h-6 ml-1" />
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
              Video
            </span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatDate(post.published)}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViews(post.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post.likes}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
