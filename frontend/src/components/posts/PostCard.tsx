import { Link } from "react-router-dom";
import { Badge, Clock, Edit2, MessageCircle } from "lucide-react";
import {
  formatDistanceToNow,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import type { Post } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

interface PostCardProps {
  post: Post;
  style?: React.CSSProperties;
}

function getTimeRemaining(expiresAt: Date) {
  const now = new Date();
  const hoursRemaining = differenceInHours(expiresAt, now);
  const minutesRemaining = differenceInMinutes(expiresAt, now);

  if (hoursRemaining <= 0 && minutesRemaining <= 0) {
    return { text: "Expired", isUrgent: true, isExpired: true };
  }

  if (hoursRemaining < 1) {
    return {
      text: `${minutesRemaining}m left`,
      isUrgent: true,
      isExpired: false,
    };
  }

  if (hoursRemaining < 6) {
    return {
      text: `${hoursRemaining}h left`,
      isUrgent: true,
      isExpired: false,
    };
  }

  return { text: `${hoursRemaining}h left`, isUrgent: false, isExpired: false };
}

export function PostCard({ post, style }: PostCardProps) {
  const { user } = useAuth();
  const timeRemaining = getTimeRemaining(new Date(post?.expires_at));
  const excerpt = post.body.replace(/[#*`]/g, "").slice(0, 150) + "...";

  return (
    <article
      style={style}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Expiration indicator */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          timeRemaining.isExpired
            ? "bg-destructive"
            : timeRemaining.isUrgent
            ? "bg-warning"
            : "bg-success"
        }`}
      />

      <div className="flex flex-col gap-4">
        {/* Author and time */}
        <div className="flex items-center justify-between">
          <Link
            to={`/posts/${post?.id}`}
            className="flex items-center gap-3 group/author"
          >
            <Avatar className="h-10 w-10 ring-2 ring-border group-hover/author:ring-primary transition-all">
              <AvatarImage
                src={post?.author?.image ?? post?.author?.imageUrl}
                alt={post.author.name}
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground group-hover/author:text-primary transition-colors">
                {post.author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post?.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </Link>
          <div className="flex gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                timeRemaining.isExpired
                  ? "bg-destructive/10 text-destructive"
                  : timeRemaining.isUrgent
                  ? "bg-warning/10 text-warning-foreground animate-pulse-soft"
                  : "bg-success/10 text-success"
              }`}
            >
              <Clock className="h-3 w-3" />
              {timeRemaining.text}
            </div>
            {user?.id === post?.author?.id && (
              <div>
                <Link to={`/posts/${post?.id}/edit`}>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Title and excerpt */}
        <Link to={`/posts/${post.id}`} className="block">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </Link>

        {/* Tags and comments */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="rounded-full text-xs font-normal px-3 py-0.5"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments.length}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
