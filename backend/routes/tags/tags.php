<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Tags\TagController;

// Post Routes (all must be authenticated as required)
Route::middleware('auth:api')->group(function () {
    Route::get('/tags', [TagController::class, 'getTags']);
});