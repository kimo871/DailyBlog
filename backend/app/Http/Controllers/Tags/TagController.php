<?php

namespace App\Http\Controllers\Tags;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Services\TagService;
/**
 * @OA\Tag(
 *     name="Tags",
 *     description="Tags management endpoints"
 * )
 */
class TagController extends Controller
{
    protected $authService;
    protected $tagService;

    public function __construct(AuthService $authService,TagService $tagService)
    {
        $this->authService = $authService;
        $this->tagService = $tagService;
    }
        /**
     * @OA\Get(
     *     path="/api/tags",
     *     tags={"Tags"},
     *     summary="Get tags",
     *     description="Retrieve tags",
     *     @OA\Response(
     *         response=200,
     *         description="Tags retrieved successfully",
     *     ),
     * )
     */
    public function getTags(): JsonResponse
    {
        try{
            $user = $this->authService->getCurrentUser();
            $tags= $this->tagService->getTags();
            
            return response()->json([
                'status' => 'success',
                'message' => 'OK',
                'data' => $tags, 
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