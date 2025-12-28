import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import type { Tag } from "../types";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { TagInput } from "../components/tags/TagInput";
import { Label } from "../components/ui/label";
import { postsService } from "../api/posts";
import { tagsService } from "../api/tags";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  if (!isAuthenticated) {
    navigate("/login");
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

      console.log({ title, body, tags: tags.map((tag) => tag?.name) });

      const response = await postsService.createPost(
        JSON.stringify({ title, body, tags: tags.map((tag) => tag?.name) })
      );
      console.log(response);

      toast.success("Post published! It will expire in 24 hours.");
      navigate("/");
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
            variant="outline"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to feed
          </Button>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card animate-slide-up">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Create a new post
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Your post will automatically expire after 24 hours</span>
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

              <div className="space-y-2">
                <Label htmlFor="body" className="text-base font-medium">
                  Content
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share your thoughts... You can use ## for headings and ### for subheadings."
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
                <p className="text-sm text-muted-foreground">
                  Posting as{" "}
                  <span className="font-medium text-foreground">
                    {user?.name}
                  </span>
                </p>
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
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Post
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
