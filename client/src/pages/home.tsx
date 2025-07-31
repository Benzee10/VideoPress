import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import FilterSection from "@/components/FilterSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [displayCount, setDisplayCount] = useState(8);

  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort posts
    switch (sortBy) {
      case "oldest":
        return filtered.sort((a, b) => 
          new Date(a.published).getTime() - new Date(b.published).getTime()
        );
      case "popular":
        return filtered.sort((a, b) => b.views - a.views);
      case "liked":
        return filtered.sort((a, b) => b.likes - a.likes);
      case "latest":
      default:
        return filtered.sort((a, b) => 
          new Date(b.published).getTime() - new Date(a.published).getTime()
        );
    }
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const displayedPosts = filteredAndSortedPosts.slice(0, displayCount);
  const hasMore = displayedPosts.length < filteredAndSortedPosts.length;

  const loadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Failed to Load Posts</h2>
            <p className="text-muted-foreground">
              We're having trouble loading the video posts. Please try again later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Filter Section */}
      <FilterSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">No Videos Found</h2>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== "all" 
                  ? "Try adjusting your filters or search terms."
                  : "No video posts are available at the moment."
                }
              </p>
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Showing {displayedPosts.length} of {filteredAndSortedPosts.length} videos
                  {selectedCategory !== "all" && ` in ${selectedCategory}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button onClick={loadMore} size="lg">
                    Load More Videos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
