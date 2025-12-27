<?php

namespace App\Http\Controllers\Tags;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Services\TagService;

class TagController extends Controller
{
    protected $authService;
    protected $tagService;

    public function __construct(AuthService $authService,TagService $tagService)
    {
        $this->authService = $authService;
        $this->tagService = $tagService;
    }
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