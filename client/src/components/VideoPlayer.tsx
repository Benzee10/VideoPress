import { useState } from "react";
import { Play, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoPlayerProps {
  video: string;
  title: string;
  className?: string;
}

export default function VideoPlayer({ video, title, className = "" }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if video is an embed code (starts with <iframe)
  const isEmbed = video.trim().startsWith('<iframe');
  
  // Check if video is an MP4 file
  const isMp4 = video.toLowerCase().includes('.mp4');

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  if (!video) {
    return (
      <div className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No video available</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load video. The video source may be unavailable or the link may be broken.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isEmbed) {
    return (
      <div className={`aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{ 
            __html: video.replace(
              '<iframe',
              `<iframe onload="this.parentElement.previousElementSibling?.remove()" onerror="this.parentElement.parentElement.querySelector('[data-error]')?.classList.remove('hidden')" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` 
            )
          }}
        />
        <div data-error className="hidden absolute inset-0 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load embedded video. Please check the embed code.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isMp4) {
    return (
      <div className={`aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        <video
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          onError={handleVideoError}
          onLoadedMetadata={handleVideoLoad}
          aria-label={`Video player for ${title}`}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Fallback for unrecognized video format
  return (
    <div className={`aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unsupported video format. Please provide either an embed code (iframe) or a direct MP4 link.
        </AlertDescription>
      </Alert>
    </div>
  );
}
