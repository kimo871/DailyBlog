<?php
namespace App\Http\Controllers\Comments;
use App\Models\Comment;
use App\Models\Post;
use App\Http\Controllers\Controller;
use App\Http\Requests\Comments\CreateCommentRequest;
use App\Http\Requests\Comments\UpdateCommentRequest;
use Illuminate\Http\JsonResponse;
use App\Services\AuthService;

class CommentController extends Controller
{
    protected $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function createComment(CreateCommentRequest $request, Post $post): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();

            $comment = $post->comments()->create([
                'body' => $request->input('body'),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Comment added successfully',
                'data' => $comment->load('user')
            ], 201);
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function updateComment(UpdateCommentRequest $request, Comment $comment): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();

            if (!$comment->belongsToUser($user->id)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not allowed to edit this comment',
                ], 403);
            }

            $comment->update([
                'body' => $request->input('body'),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Comment updated successfully',
                'data' => $comment->load('user')
            ]);
        }
         catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function deleteComment(Comment $comment): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();

            if (!$comment->canBeManagedBy($user->id)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are not allowed to delete this comment',
                ], 403);
            }

            $comment->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Comment deleted successfully',
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
