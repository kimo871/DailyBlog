<?php

namespace App\Http\Controllers\Posts;

use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Posts\CreatePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Services\AuthService;

class PostController extends Controller
{
    protected $postService;
    protected $authService;

    public function __construct(PostService $postService,AuthService $authService)
    {
        $this->postService = $postService;
        $this->authService = $authService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['tag', 'author', 'search']);
        $posts = $this->postService->getAllPosts($filters);
        
        return response()->json([
            'status' => 'success',
            'data' => $posts,
        ]);
    }

    public function createPost(CreatePostRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401);
    }
            
            $post = $this->postService->createPost(
                user: $user,
                data: $request->validated(),
                tagNames: $request->input('tags', [])
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Post created successfully',
                'data' => $post,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function getPostById(Post $post): JsonResponse
    {
        try{
            // if post is expired and still not deleted filter it
            if ($post->expires_at && $post->expires_at->isPast()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This post has expired',
                ], 410);
            }

            $post->load(['author', 'tags', 'comments.user']);
            
            return response()->json([
                'status' => 'success',
                'data' => $post,
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        } 
    }

    public function updatePost(UpdatePostRequest $request, Post $post): JsonResponse
    {
        try {
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401);}
            $updatedPost = $this->postService->updatePost(
                post: $post,
                data: $request->validated(),
                tagNames: $request->input('tags', [])
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Post updated successfully',
                'data' => $updatedPost,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function deletePost(Post $post): JsonResponse
    {
       try{
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401);}
        
            $this->postService->deletePost($post);
        
            return response()->json([
                'status' => 'success',
                'message' => 'Post deleted successfully',
            ]);
       }
       catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }   
    }

    public function myPosts(): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            $posts = $this->postService->getUserPosts($user);
            
            return response()->json([
                'status' => 'success',
                'message' => 'OK',
                'data' => $posts->items(),        // array of posts
                'pagination' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'per_page' => $posts->perPage(),
                    'total' => $posts->total(),
                    'first_page_url' => $posts->url(1),
                    'last_page_url' => $posts->url($posts->lastPage()),
                    'next_page_url' => $posts->nextPageUrl(),
                    'prev_page_url' => $posts->previousPageUrl(),
                ],
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        } 
    }

    public function getPosts(): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            $posts = $this->postService->getPosts();
            
            return response()->json([
                'status' => 'success',
                'message' => 'OK',
                'data' => $posts->items(), 
                'pagination' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'per_page' => $posts->perPage(),
                    'total' => $posts->total(),
                    'first_page_url' => $posts->url(1),
                    'last_page_url' => $posts->url($posts->lastPage()),
                    'next_page_url' => $posts->nextPageUrl(),
                    'prev_page_url' => $posts->previousPageUrl(),
                ],
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        } 
    }
}