import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Comment {
  id: string;
  body: string;
  user_id: string;
  user: {
    name: string;
    image?: string;
  };
  created_at: string;
}

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment: (body: string) => void;
  onEditComment: (commentId: string, body: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function CommentSection({
  comments,
  postId,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment);
    setNewComment("");
    toast.success("Comment added!");
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.body);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editContent.trim()) return;
    onEditComment(commentId, editContent);
    setEditingId(null);
    setEditContent("");
    toast.success("Comment updated!");
  };

  const handleDelete = (commentId: string) => {
    onDeleteComment(commentId);
    toast.success("Comment deleted!");
  };

  return (
    <section className="mt-12">
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            {user?.image_url ? (
              <img
                className="size-10 rounded-full"
                src={`${import.meta.env.VITE_BUCKET_URL}${
                  user?.image_url ?? user?.image
                }`}
              />
            ) : (
              <Avatar className="h-10 w-10 ring-2 ring-border hover:ring-primary transition-all duration-200">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-lg border border-border bg-muted/50 p-6 text-center">
          <p className="text-muted-foreground">
            Please{" "}
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              sign in
            </a>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="flex gap-4 rounded-lg border border-border bg-card p-4 animate-fade-in"
          >
            {comment?.user?.image_url ? (
              <img
                className="size-10 rounded-full"
                src={`${import.meta.env.VITE_BUCKET_URL}${
                  comment?.user?.image_url ?? comment?.user?.image
                }`}
              />
            ) : (
              <Avatar className="h-9 w-9 ring-2 ring-border hover:ring-primary transition-all duration-200">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                  {comment?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <span className="font-medium text-foreground">
                    {comment?.user?.name}
                  </span>
                  <span className="mx-2 text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment?.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {user?.id === comment?.user_id && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(comment)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {editingId === comment?.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed">
                  {comment?.body}
                </p>
              )}
            </div>
          </article>
        ))}

        {comments?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
