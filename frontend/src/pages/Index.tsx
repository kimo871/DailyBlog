import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PenLine,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  Badge,
} from "lucide-react";
import { differenceInMinutes } from "date-fns";
import type { Post } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  SearchAndFilters,
  type SortOption,
} from "../components/SearchAndFilters";
import { PostList } from "../components/posts/PostList";
import { Pagination } from "../components/posts/Pagination";
import { mockPosts, mockTags } from "../data/mockData";
import { Header } from "../components/Header";
import { postsService } from "../api/posts";
import { Skeleton } from "../components/ui/skeleton";
import { PostCardSkeleton } from "../components/ui/postcard-skeleton";

const POSTS_PER_PAGE = 5;

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [timeNow, setTimeNow] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await postsService.getPosts();
      console.log(posts?.data);
      if (posts?.data) {
        setPosts(posts?.data ?? []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPosts();
    setCurrentPage(1);
  }, [searchQuery, selectedTag, sortBy]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // Stats for hero section
  const totalPosts = posts.length;
  const totalAuthors = new Set(posts.map((p) => p?.author?.id)).size;
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="w-full container py-12 ">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 max-w-3xl mx-auto leading-tight">
            Share your thoughts,{" "}
            <span className="text-gradient">before they fade</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A place for fleeting ideas and ephemeral conversations. Write
            freely, knowing your words have a 24-hour lifespan.
          </p>

          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-4 mb-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup" className="gap-2">
                  <PenLine className="h-5 w-5" />
                  Start Writing
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">{totalPosts}</strong> posts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">{totalAuthors}</strong>{" "}
                writers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">{totalComments}</strong>{" "}
                comments
              </span>
            </div>
          </div>
        </section>
        {!isLoading ? (
          <>
            {/* Posts Feed */}
            <section className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {searchQuery ? "Search Results" : "Latest Posts"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {timeNow.toLocaleTimeString()}</span>
                </div>
              </div>

              <PostList posts={posts} />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={posts?.length}
                itemsPerPage={POSTS_PER_PAGE}
              />
            </section>
          </>
        ) : (
          <div className="w-3/4 mx-auto space-y-6">
            {Array.from(
              { length: 3 }).map(() => {
                return <PostCardSkeleton />;
              })
            }
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Scribble.</p>
        </div>
      </footer>
    </div>
  );
}
