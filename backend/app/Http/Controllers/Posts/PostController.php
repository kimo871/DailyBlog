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

/**
 * @OA\Tag(
 *     name="Posts",
 *     description="Post management endpoints"
 * )
 */

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

    /**
     * @OA\Post(
     *     path="/api/posts",
     *     tags={"Posts"},
     *     summary="Create a new post",
     *     description="Create a new post with tags",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/CreatePostRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Post created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Post created successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *     )
     * )
     */
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
    /**
     * @OA\Get(
     *     path="/api/posts/{id}",
     *     tags={"Posts"},
     *     summary="Get post by ID",
     *     description="Retrieve a specific post with its author, tags, and comments",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Post ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post retrieved successfully",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     ),
     *     @OA\Response(
     *         response=410,
     *         description="Post expired",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="This post has expired")
     *         )
     *     )
     * )
     */
    public function getPostById(Post $post): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401)
            ;}
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
  /**
     * @OA\Patch(
     *     path="/api/posts/{id}",
     *     tags={"Posts"},
     *     summary="Update a post",
     *     description="Update an existing post",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Post ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdatePostRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Post updated successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - Not the post owner",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *     )
     * )
     */
    public function updatePost(UpdatePostRequest $request, Post $post): JsonResponse
    {
        try {
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401)
              ;}
              // check ownership of post to allow this action
              if ($post->author_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not authorized to update this post'
                 ], 403);
              }
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
    /**
     * @OA\Delete(
     *     path="/api/posts/{id}",
     *     tags={"Posts"},
     *     summary="Delete a post",
     *     description="Delete an existing post",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Post ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Post deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden - Not the post owner",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")
     *     )
     * )
     */
    public function deletePost(Post $post): JsonResponse
    {
       try{
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401)
            ;}
        
              // check ownership of post to allow this action
              if ($post->author_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not authorized to delete this post'
                 ], 403);
              }

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
    /**
     * @OA\Get(
     *     path="/api/posts/my-posts",
     *     tags={"Posts"},
     *     summary="Get authenticated user's posts",
     *     description="Retrieve all posts created by the authenticated user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User posts retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="OK"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="pagination", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *     )
     * )
     */
    public function myPosts(): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401)
            ;}
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
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401)
            ;}
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