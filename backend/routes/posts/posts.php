<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Posts\PostController;

// Post Routes (all must be authenticated as required)
Route::middleware('auth:api')->group(function () {
    Route::post('/posts', [PostController::class, 'createPost']);
    Route::patch('/posts/{post}', [PostController::class, 'updatePost']);
    Route::get('/posts/{post}', [PostController::class, 'getPostById']);
    Route::delete('/posts/{post}', [PostController::class, 'deletePost']);
    Route::get('/me/posts', [PostController::class, 'myPosts']);
    Route::get('/posts', [PostController::class, 'getPosts']);
});