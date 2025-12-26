<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Comments\CommentController;

Route::middleware('auth:api')->group(function () {
    Route::post('/posts/{post}/comments', [CommentController::class, 'createComment']);
    Route::put('/comments/{comment}', [CommentController::class, 'updateComment']);
    Route::delete('/comments/{comment}', [CommentController::class, 'deleteComment']);
});
