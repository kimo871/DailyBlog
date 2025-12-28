// components/NotFound.tsx
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="text-center max-w-md mx-auto">

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
          <div className="relative bg-background border rounded-full p-6 w-32 h-32 mx-auto flex items-center justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/posts">
              <Search className="h-4 w-4" />
              Browse Posts
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}