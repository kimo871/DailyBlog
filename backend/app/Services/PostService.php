<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostService
{
    protected $tagService;

    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    public function createPost(User $user, array $data, array $tagNames = []): Post
    {
        // validate at least one tag
        if (empty($tagNames)) {
            throw new \Exception('A post must have at least one tag');
        }

        return DB::transaction(function () use ($user, $data, $tagNames) {
            // Create post
            $post = Post::create([
                'title' => $data['title'],
                'body' => $data['body'],
                'author_id' => $user->id,
            ]);

            // Attach tags
            $this->tagService->attachTagsToPost($post, $tagNames);

            return $post->load(['author', 'tags', 'comments.user']);
        });
    }

    public function updatePost(Post $post, array $data, array $tagNames = []): Post
    {
        if (!empty($tagNames) && count($tagNames) < 1) {
            throw new \Exception('A post must have at least one tag');
        }

        return DB::transaction(function () use ($post, $data,$tagNames) {
            // Update post fields
            $post->update([
                'title' => $data['title'] ?? $post->title,
                'body' => $data['body'] ?? $post->body,
            ]);

            // Update tags if provided
            if (!empty($tagNames)) {
                $this->tagService->attachTagsToPost($post, $tagNames);
            }

            return $post->load(['author', 'tags', 'comments.user']);
        });
    }

    public function deletePost(Post $post): bool
    {
        return $post->delete(); 
    }

    public function getAllPosts(array $filters = [], int $perPage = 15)
    {
        $query = Post::with(['author', 'tags', 'comments.user'])
            ->notExpired()
            ->latest();

        // apply filters
        if (isset($filters['tag'])) {
            $query->whereHas('tags', function ($q) use ($filters) {
                $q->where('name', $filters['tag'])
                  ->orWhere('slug', $filters['tag']);
            });
        }

        if (isset($filters['author'])) {
            $query->where('author_id', $filters['author']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('body', 'like', "%{$filters['search']}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function getPost($id): ?Post
    {
        return Post::with(['author', 'tags', 'comments.user'])
            ->notExpired()
            ->find($id);
    }

    public function getUserPosts(User $user, int $perPage = 15)
    {
        return $user->posts()
        ->with(['tags', 'comments.user'])
        ->where('expires_at', '>', now())
        ->latest()
        ->paginate($perPage);
    }

    public function getPosts(int $perPage = 15)
    {
         $posts = Post::notExpired()
        ->latest()
        ->paginate($perPage);
         $posts->getCollection()->load(['author', 'tags', 'comments.user']);
    
    return $posts;
    }

    public function canManagePost(User $user, Post $post): bool
    {
        return $post->author_id === $user->id;
    }
}