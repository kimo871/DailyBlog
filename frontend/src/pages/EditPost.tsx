import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { differenceInHours, differenceInMinutes } from "date-fns";
import { mockPosts } from "../data/mockData";
import type { Post, Tag } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { TagInput } from "../components/tags/TagInput";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { postsService } from "../api/posts";
import { PostCardSkeleton } from "../components/ui/postcard-skeleton";

function getTimeRemaining(expiresAt: Date) {
  const now = new Date();
  const hoursRemaining = differenceInHours(expiresAt, now);
  const minutesRemaining = differenceInMinutes(expiresAt, now);

  if (hoursRemaining < 1) {
    return `${minutesRemaining} minutes`;
  }
  return `${hoursRemaining} hours`;
}

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPostById = async () => {
    try {
      setIsLoading(true);
      const response = await postsService.getPostById(id);
      console.log(response?.data);
      setPost(response?.data);
      setTitle(response?.data?.title);
      setBody(response?.data?.body);
      setTags(response?.data?.tags);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container py-12">
          <div className="text-center py-16">
            <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Post not found
            </h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to feed
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (user?.id !== post?.author?.id) {
    toast.error("You can only edit your own posts");
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!title.trim()) {
        toast.error("Please add a title");
        return;
      }

      if (!body.trim()) {
        toast.error("Please add some content");
        return;
      }

      if (tags.length === 0) {
        toast.error("Please add at least one tag");
        return;
      }

      setIsSubmitting(true);

      const response = await postsService.updatePost(post?.id, {
        ...(title && { title }),
        ...(body && { body }),
        ...(tags && { tags: tags.map((tag) => tag?.name) }),
      });
      console.log(response);
      toast.success("Post updated successfully!");
      navigate(`/posts/${post.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="secondary"
            className="mb-6"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to post
          </Button>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card animate-slide-up">
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Edit post
              </h1>
              <div className="flex items-center gap-2 text-sm text-warning-foreground bg-warning/10 px-3 py-1.5 rounded-full w-fit">
                <Clock className="h-4 w-4" />
                <span>
                  {getTimeRemaining(new Date(post?.expires_at))} until
                  expiration
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="An interesting title for your post..."
                  className="text-lg h-12"
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label htmlFor="body" className="text-base font-medium">
                  Content
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[300px] resize-y text-base leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use ## for headings and ### for subheadings
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Tags</Label>
                <TagInput selectedTags={tags} onTagsChange={setTags} />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
