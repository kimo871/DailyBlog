import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  formatDistanceToNow,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { Clock, Edit2, Trash2, ArrowLeft, Badge } from "lucide-react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { CommentSection } from "../components/comments/CommentSection";
import type { Post, Comment } from "../types";
import { mockPosts } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { postsService } from "../api/posts";
import { commentsService } from "../api/comments";
import { PostCardSkeleton } from "../components/ui/postcard-skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";

function getTimeRemaining(expiresAt: Date) {
  const now = new Date();
  const hoursRemaining = differenceInHours(expiresAt, now);
  const minutesRemaining = differenceInMinutes(expiresAt, now);

  if (hoursRemaining <= 0 && minutesRemaining <= 0) {
    return { text: "Expired", isUrgent: true };
  }

  if (hoursRemaining < 1) {
    return { text: `${minutesRemaining} minutes remaining`, isUrgent: true };
  }

  if (hoursRemaining < 6) {
    return { text: `${hoursRemaining} hours remaining`, isUrgent: true };
  }

  return { text: `${hoursRemaining} hours remaining`, isUrgent: false };
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [timeNow, setTimeNow] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const getPostById = async () => {
    try {
      setIsLoading(true);
      const response = await postsService.getPostById(id);
      console.log(response?.data);
      setPost(response?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPostById();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!post && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container py-12">
          <div className="text-center py-16">
            <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Post not found
            </h1>
            <p className="text-muted-foreground mb-6">
              This post may have expired or doesn't exist.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to feed
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen h-full bg-gradient-subtle flex flex-col justify-center">
        <div className="w-3/4  mx-auto space-y-6">
          {Array.from({ length: 1 }).map(() => {
            return <PostCardSkeleton style={{ minHeight: "90vh" }} />;
          })}
        </div>
      </div>
    );
  }

  const timeRemaining =
    !isLoading && post && getTimeRemaining(new Date(post?.expires_at));
  const isAuthor = !isLoading && post && user?.id === post?.author?.id;


  const handleAddComment = async (body: string) => {
    try {
      if (!user) return;

      const response = await commentsService.createComment(post.id, { body });
      console.log(response);

      const newComment: Comment = {
        id: response?.data?.id || `comment-${Date.now()}`,
        body,
        user_id: user.id,
        user: user,
        post_id: post.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      setPost({
        ...post,
        comments: [...post.comments, newComment],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditComment = async (commentId: string, body: string) => {
    try {
      if (!user) return;

      const response = await commentsService.editComment(commentId, { body });
      console.log(response);

      setPost({
        ...post,
        comments: post.comments.map((c) =>
          c.id === commentId ? { ...c, body, updatedAt: new Date() } : c
        ),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      if (!user) return;

      const response = await commentsService.deleteComment(commentId);
      console.log(response);

      setPost({
        ...post,
        comments: post.comments.filter((c) => c.id !== commentId),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await postsService.deletePost(post?.id);
      console.log(response);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finall");
    }
  };

  // Simple markdown-like rendering
  const renderBody = (body: string) => {
    return body.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="font-serif text-2xl font-semibold text-foreground mt-8 mb-4"
          >
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="font-serif text-xl font-semibold text-foreground mt-6 mb-3"
          >
            {line.slice(4)}
          </h3>
        );
      }
      if (line.trim() === "") {
        return <br key={i} />;
      }
      return (
        <p key={i} className="text-foreground leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="container py-12">
        <article className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to feed
          </Button>

          {/* Post header */}
          <header className="mb-8 animate-fade-in">
            {/* Expiration warning */}
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6 ${
                timeRemaining.isUrgent
                  ? "bg-warning/10 text-warning-foreground"
                  : "bg-success/10 text-success"
              }`}
            >
              <Clock
                className={`h-4 w-4 ${
                  timeRemaining.isUrgent ? "animate-pulse" : ""
                }`}
              />
              {timeRemaining.text}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post?.title}
            </h1>

            {/* Author info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-border">
                  <AvatarImage
                    src={post?.author?.image}
                    alt={post?.author?.name}
                  />
                  <AvatarFallback>
                    {post?.author?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {post?.author?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post?.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {isAuthor && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The post will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeletePost}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {post?.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="rounded-full px-4 py-1"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </header>

          {/* Post body */}
          <div className="prose prose-lg max-w-none mb-12 animate-fade-in">
            {renderBody(post?.body)}
          </div>

          {/* Comments section */}
          <CommentSection
            comments={post.comments}
            postId={post.id}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </article>
      </main>
    </div>
  );
}
