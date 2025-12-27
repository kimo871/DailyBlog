
import type { Post } from '../../types';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
          No posts yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Be the first to share your thoughts. Write a post and it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
}
