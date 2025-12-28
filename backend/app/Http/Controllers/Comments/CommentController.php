<?php
namespace App\Http\Controllers\Comments;
use App\Models\Comment;
use App\Models\Post;
use App\Http\Controllers\Controller;
use App\Http\Requests\Comments\CreateCommentRequest;
use App\Http\Requests\Comments\UpdateCommentRequest;
use Illuminate\Http\JsonResponse;
use App\Services\AuthService;

/**
 * @OA\Tag(
 *     name="Comments",
 *     description="Comment management endpoints"
 * )
 */
class CommentController extends Controller
{
    protected $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
        /**
     * @OA\Post(
     *     path="/api/posts/{post}/comments",
     *     tags={"Comments"},
     *     summary="Create a new Comment",
     *     description="Create a new comment",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/CreateCommentRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Comment created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Comment created successfully"),
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
        /**
     * @OA\Put(
     *     path="/api/comments/{comment}",
     *     tags={"Comments"},
     *     summary="Update a Comment",
     *     description="Update a  comment",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateCommentRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Comment Updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Comment updated successfully"),
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
    public function updateComment(UpdateCommentRequest $request, Comment $comment): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401);
            }

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
    /**
     * @OA\Delete(
     *     path="/api/comments/{id}",
     *     tags={"Comments"},
     *     summary="Delete a comment",
     *     description="Delete an existing comment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Comment ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comment deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Comment deleted successfully")
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
    public function deleteComment(Comment $comment): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            if (!$user) {
              return response()->json(['status'=>'error','message'=>'No user found'], 401);
            }

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
